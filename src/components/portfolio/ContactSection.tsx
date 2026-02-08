import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Get In Touch</h2>
          <p className="mt-3 text-muted-foreground">Have a project in mind? Let's talk.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              {info.map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {href ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{label}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Input name="name" placeholder="Your Name" required className="rounded-lg" />
            <Input name="email" type="email" placeholder="Your Email" required className="rounded-lg" />
            <Textarea name="message" placeholder="Your Message" rows={5} required className="rounded-lg resize-none" />
            <Button type="submit" disabled={sending} className="rounded-full w-full font-semibold">
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
