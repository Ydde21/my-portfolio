import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const info = [
  { icon: Mail, label: "yddecsasas21@gmail.com", href: "mailto:yddecsasas21@gmail.com" },
  { icon: Phone, label: "+63 918-552-5352", href: "tel:+639185525352" },
  { icon: MapPin, label: "Bacolod City, Philippines", href: null },
];

const socials = [
  { icon: Github, href: "https://github.com/Ydde21", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/eddy-casas-72a07b364/", label: "LinkedIn" },
];

export default function ContactSection() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      website: formData.get("website") as string,
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you soon!"
        });
        form.reset();
      } else {
        let message = "Failed to send message";
        try {
          const errorData = await response.json();
          message = errorData.error || message;
        } catch {
          // no-op: keep generic fallback if server returned non-JSON
        }
        throw new Error(message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="border-t border-border px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="section-index">04 — Contact</p>
          <h2 className="font-display mt-3 max-w-md text-3xl leading-tight tracking-tight sm:text-5xl">
            Have a project in mind?
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            I'm open to full-time roles, freelance builds, and collaborations.
            The form reaches me directly — I usually reply within a day.
          </p>

          <ul className="mt-10 space-y-4">
            {info.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-center gap-3.5">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {href ? (
                  <a
                    href={href}
                    className="link-underline text-sm text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">{label}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-6">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-medium"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
          <div>
            <label htmlFor="contact-name" className="section-index mb-2 block">
              Name
            </label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Your name"
              maxLength={120}
              required
              className="rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="section-index mb-2 block">
              Email
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              maxLength={254}
              required
              className="rounded-sm"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="section-index mb-2 block">
              Message
            </label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Tell me about the project..."
              rows={6}
              maxLength={4000}
              required
              className="resize-none rounded-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={sending}
            className="w-full rounded-sm font-medium"
          >
            {sending ? "Sending..." : "Send message"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
