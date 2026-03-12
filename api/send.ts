import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const CONTACT_RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? "60000", 10);
const CONTACT_RATE_LIMIT_MAX_REQUESTS = Number.parseInt(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS ?? "5", 10);
const CONTACT_RATE_LIMIT_BLOCK_MS = Number.parseInt(process.env.CONTACT_RATE_LIMIT_BLOCK_MS ?? "900000", 10);
const MAX_NAME_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 4000;

type RateLimitEntry = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const contactSchema = z
  .object({
    name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    email: z
      .string()
      .trim()
      .min(3)
      .max(254)
      .email()
      .refine((value) => !value.includes("\r") && !value.includes("\n"), "Invalid email address"),
    message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
    website: z.string().trim().max(0).optional().default(""),
  })
  .strict();

function getHeaderValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

function getClientIp(req: VercelRequest): string {
  const forwardedFor = getHeaderValue(req.headers["x-forwarded-for"]);
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function isAllowedOrigin(req: VercelRequest): boolean {
  const originHeader = getHeaderValue(req.headers.origin);

  if (!originHeader) {
    return true;
  }

  let requestOrigin: URL;
  try {
    requestOrigin = new URL(originHeader);
  } catch {
    return false;
  }

  const normalizedOrigin = requestOrigin.origin;
  if (allowedOrigins.size > 0) {
    return allowedOrigins.has(normalizedOrigin);
  }

  if (isLoopbackHost(requestOrigin.hostname)) {
    return true;
  }

  const host = getHeaderValue(req.headers["x-forwarded-host"]) ?? getHeaderValue(req.headers.host);
  const proto = getHeaderValue(req.headers["x-forwarded-proto"]) ?? "https";
  if (!host) {
    return false;
  }

  return normalizedOrigin === `${proto}://${host}`;
}

function cleanupRateLimitStore(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    const windowExpired = now - value.windowStart > CONTACT_RATE_LIMIT_WINDOW_MS * 2;
    const blockExpired = value.blockedUntil <= now;
    if (windowExpired && blockExpired) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(clientKey: string): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);

  if (current && current.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000),
    };
  }

  if (!current || now - current.windowStart >= CONTACT_RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientKey, { count: 1, windowStart: now, blockedUntil: 0 });
    cleanupRateLimitStore(now);
    return { allowed: true };
  }

  current.count += 1;
  if (current.count > CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    current.blockedUntil = now + CONTACT_RATE_LIMIT_BLOCK_MS;
    return { allowed: false, retryAfterSeconds: Math.ceil(CONTACT_RATE_LIMIT_BLOCK_MS / 1000) };
  }

  return { allowed: true };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function setDefaultSecurityHeaders(res: VercelResponse): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setDefaultSecurityHeaders(res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const contentType = getHeaderValue(req.headers["content-type"])?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return res.status(415).json({ error: "Unsupported media type" });
  }

  const rateLimitResult = checkRateLimit(getClientIp(req));
  if (!rateLimitResult.allowed) {
    res.setHeader("Retry-After", rateLimitResult.retryAfterSeconds.toString());
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const parsedBody = contactSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: "Invalid request payload." });
  }

  const { name, email, message, website } = parsedBody.data;

  if (website.length > 0) {
    return res.status(200).json({ success: true });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Email provider API key is missing.");
    return res.status(500).json({ error: "Unable to send message right now." });
  }

  const resend = new Resend(resendApiKey);

  const safeName = name.replace(/[\r\n]+/g, " ").trim();
  const safeEmail = email.trim().toLowerCase();
  const safeMessage = message.trim();

  const escapedName = escapeHtml(safeName);
  const escapedEmail = escapeHtml(safeEmail);
  const escapedMessage = escapeHtml(safeMessage);
  const escapedMessageWithBreaks = escapedMessage.replace(/\n/g, "<br />");

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["yddecasas21@gmail.com"],
      subject: `New Message from ${safeName.slice(0, 80)}`,
      replyTo: safeEmail,
      text: `New Contact Form Submission\n\nName: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapedMessageWithBreaks}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Email provider send failed.", {
        name: error.name,
        message: error.message,
      });
      return res.status(502).json({ error: "Unable to send message right now." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Unexpected contact handler error.", error);
    return res.status(500).json({ error: "Unable to send message right now." });
  }
}
