import React from "react";

const logo = "/logo.png";
const applyImg = "/apply.jpg";

interface ApplyFormProps {
  language: string;
  onNavigate: (page: "home" | "partner" | "apply") => void;
}

export default function ApplyForm({ language, onNavigate }: ApplyFormProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-navy">
      <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-white backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 cursor-pointer text-left">
            <img src={logo} alt="Mihret Agency logo" className="size-9 object-contain" />
            <span className="font-display text-xl tracking-tight font-bold bg-gradient-to-r from-[#457b9d] to-[#DB2777] bg-clip-text text-transparent">Mihret Agency</span>
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="border border-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-brand-navy hover:text-brand-cream cursor-pointer"
          >
            ← Home
          </button>
        </div>
      </nav>

      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-4xl animate-fade-in">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center mb-16">
            <div className="lg:col-span-7">
              <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold font-sans">
                Worker Applications
              </span>
              <h1 className="mb-8 text-5xl leading-[1.05] lg:text-6xl font-display text-brand-navy">
                Apply to <span className="italic">work abroad.</span>
              </h1>
              <p className="text-lg leading-relaxed text-brand-navy/70">
                Bring a valid Ethiopian ID or passport, recent passport-size photographs, and any
                certificates of prior work, training, or education. Our team will guide you through
                interviews, medical screening, and contract preparation.
              </p>
            </div>
            
            <div className="lg:col-span-5 relative group overflow-hidden rounded-lg aspect-[4/3] bg-brand-cream border border-brand-border/40">
              <div className="absolute inset-0 p-2 flex items-center justify-center">
                <img 
                  src={applyImg} 
                  alt="Worker Applications" 
                  className="max-w-full max-h-full object-contain transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="mb-10 border-l-4 border-brand-gold bg-white p-8 lg:p-10 shadow-sm border border-y border-r border-brand-border animate-fade-in">
            <p className="text-lg leading-relaxed text-brand-navy/80">
              <strong className="font-semibold text-brand-navy">Please note:</strong> all
              applications must be submitted <em>in person</em> at our Addis Ababa office.
              We do not accept applications by phone, email, or social media. This requirement
              is in place to verify your identity, review original documents, and ensure every
              candidate fully understands the contract terms before placement.
            </p>
          </div>

          <div className="grid gap-12 border-t border-brand-border pt-10 lg:grid-cols-2">
            <div>
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Office Address
              </span>
              <address className="not-italic text-lg leading-relaxed text-brand-navy/75">
                Addis Ababa, Ethiopia<br />
                MERIKATO HAJI LEGESEE Building
              </address>
              <a
                href="https://share.google/WoALpZnPItqcZzYIR"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-brand-navy hover:text-brand-cream cursor-pointer"
              >
                Get Directions →
              </a>

            </div>
            <div>
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Contact
              </span>
              <ul className="space-y-3 text-lg text-brand-navy/75">
                <li><a href="tel:+251911007818" className="hover:text-brand-gold transition-colors font-medium font-mono text-base">+251 911 007 818</a></li>
                <li><a href="tel:+251902759251" className="hover:text-brand-gold transition-colors font-medium font-mono text-base">+251 902 759 251</a></li>
                <li><a href="mailto:mihretagency@gmail.com" className="break-all hover:text-brand-gold transition-colors font-mono text-base">mihretagency@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              Find Us on the Map
            </span>
            <iframe
              title="Mihret Agency office location"
              src="https://maps.google.com/maps?q=MERIKATO+HAJI+LEGESEE+Building,Addis+Ababa&t=m&z=17&output=embed"
              className="aspect-[16/9] w-full border border-brand-border grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
