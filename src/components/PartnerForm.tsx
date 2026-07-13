import React from "react";

const logo = "/logo.png";
const partnerImg = "/partner.jpg";

interface PartnerFormProps {
  language: string;
  onNavigate: (page: "home" | "partner" | "apply") => void;
}

export default function PartnerForm({ language, onNavigate }: PartnerFormProps) {
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
                For Employers & Agencies
              </span>
              <h1 className="mb-8 text-5xl leading-[1.05] lg:text-6xl font-display text-brand-navy">
                Partner <span className="italic">with us.</span>
              </h1>
              <p className="text-lg leading-relaxed text-brand-navy/70">
                Mihret Agency works directly with employers, families, households, and
                recruitment partners across Kuwait. Reach out to discuss placement requirements,
                timelines, and a long-term working relationship with our office in Addis Ababa.
              </p>
            </div>
            
            <div className="lg:col-span-5 relative group overflow-hidden rounded-lg aspect-[4/3] bg-brand-cream border border-brand-border/40">
              <div className="absolute inset-0 p-2 flex items-center justify-center">
                <img 
                  src={partnerImg} 
                  alt="For Employers & Agencies" 
                  className="max-w-full max-h-full object-contain transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="mb-12 border border-brand-border bg-white p-8 lg:p-10 shadow-sm">
            <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              Agency Details
            </span>
            <p className="mt-3 font-display text-3xl lg:text-4xl text-brand-navy">Mihret Agency</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-brand-navy/50 font-semibold">
              Overseas Recruitment and Placement Agency
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <a href="tel:+251911007818" className="group block border-t border-brand-navy/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Primary Phone</span>
              <p className="mt-4 font-display text-2xl group-hover:italic text-brand-navy transition-all duration-300 font-mono text-xl">+251 911 007 818</p>
            </a>
            <a href="tel:+251902759251" className="group block border-t border-brand-navy/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Secondary Phone</span>
              <p className="mt-4 font-display text-2xl group-hover:italic text-brand-navy transition-all duration-300 font-mono text-xl">+251 902 759 251</p>
            </a>
            <a href="mailto:mihretagency@gmail.com" className="group block border-t border-brand-navy/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Email</span>
              <p className="mt-4 break-all font-display text-2xl group-hover:italic text-brand-navy transition-all duration-300 font-mono text-lg">mihretagency@gmail.com</p>
            </a>
          </div>

          <div className="mt-16 border-t border-brand-border pt-10">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              Office
            </span>
            <address className="not-italic text-lg leading-relaxed text-brand-navy/70">
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
            <iframe
              title="Mihret Agency office location"
              src="https://maps.google.com/maps?q=MERIKATO+HAJI+LEGESEE+Building,Addis+Ababa&t=m&z=17&output=embed"
              className="mt-8 aspect-[16/9] w-full border border-brand-border grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
