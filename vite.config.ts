import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "node:http";

type DevRequest = IncomingMessage & {
  body?: unknown;
};

type DevResponse = ServerResponse<IncomingMessage> & {
  status?: (code: number) => DevResponse;
  json?: (body: unknown) => DevResponse;
};

type ApiHandler = (req: never, res: never) => Promise<unknown>;

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
}

function localApiPlugin() {
  let handlersPromise:
    | Promise<{
        send: ApiHandler;
        chat: ApiHandler;
      }>
    | null = null;

  const getHandlers = async (): Promise<{ send: ApiHandler; chat: ApiHandler }> => {
    if (!handlersPromise) {
      handlersPromise = Promise.all([import("./api/send"), import("./api/chat")]).then(([sendModule, chatModule]) => ({
        send: sendModule.default as ApiHandler,
        chat: chatModule.default as ApiHandler,
      }));
    }
    return handlersPromise;
  };

  return {
    name: "local-vercel-api-routes",
    configureServer(server: {
      middlewares: {
        use: (
          fn: (
            req: IncomingMessage,
            res: ServerResponse,
            next: () => void,
          ) => void | Promise<void>,
        ) => void;
      };
    }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) {
          next();
          return;
        }

        const pathname = url.split("?")[0];
        const handlers = await getHandlers();
        const handler =
          pathname === "/api/send" ? handlers.send : pathname === "/api/chat" ? handlers.chat : null;

        if (!handler) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }

        const request = req as DevRequest;
        const response = res as DevResponse;

        response.status = function status(code: number): DevResponse {
          this.statusCode = code;
          return this;
        };

        response.json = function json(body: unknown): DevResponse {
          if (!this.headersSent) {
            this.setHeader("Content-Type", "application/json; charset=utf-8");
          }
          this.end(JSON.stringify(body));
          return this;
        };

        if (
          request.method === "POST" ||
          request.method === "PUT" ||
          request.method === "PATCH"
        ) {
          request.body = await readJsonBody(request);
        } else {
          request.body = {};
        }

        await handler(request as never, response as never);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && localApiPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
