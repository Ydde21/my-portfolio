import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import logo3d from "@/assets/logo-3d.png";

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="border-t border-border px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="section-index">02 — About</p>
          <motion.div
            className="mt-8 w-52 overflow-hidden rounded-sm border border-border sm:w-60"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={logo3d}
              alt="Eddy Casas"
              className={
                reduceMotion
                  ? "w-full object-cover"
                  : "w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              }
              loading="lazy"
            />
          </motion.div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Bacolod City, PH
          </p>
        </div>

        <div>
          <motion.h2
            className="font-display max-w-xl text-3xl leading-tight tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            I'm a full-stack developer who cares about the whole product — from
            database schema to the last hover state.
          </motion.h2>

          <motion.div
            className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              I've shipped fourteen production applications: hotel management,
              clinic queueing, Philippine payroll compliance, procurement
              workflows, e-commerce tooling. My bias is toward software that
              survives contact with real users — role-based access that actually
              holds, audit logs you can trust, invoices that reconcile.
            </p>
            <p>
              I work across React, TypeScript, Node.js, ASP.NET Core, and
              PostgreSQL, and I treat design as part of engineering rather than
              a handoff. If a screen needs explanation, the screen isn't done.
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="/CasasEddy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium"
            >
              <Eye className="h-4 w-4" />
              View resume
            </a>
            <a
              href="#contact"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowUpRight className="h-4 w-4" />
              Start a conversation
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              ["14", "Projects shipped"],
              ["17", "Technologies"],
              ["2", "Years coding"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl tracking-tight sm:text-4xl">
                  {value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
