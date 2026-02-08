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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ContactSection() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const mailtoLink = `mailto:yddecsasas21@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.open(mailtoLink, "_blank");

    setSending(false);
    toast({ title: "Message ready!", description: "Your email client should open. Send the email to complete." });
    form.reset();
  };

  return (
    <section id="contact" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
                <motion.div key={label} className="flex items-center gap-4">
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  {href ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{label}</span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
              <Input name="name" placeholder="Your Name" required className="rounded-lg" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
              <Input name="email" type="email" placeholder="Your Email" required className="rounded-lg" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
              <Textarea name="message" placeholder="Your Message" rows={5} required className="rounded-lg resize-none" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" disabled={sending} className="rounded-full w-full font-semibold shadow-lg shadow-primary/20">
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
