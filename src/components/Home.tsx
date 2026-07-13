import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../types";
import { 
  Briefcase, ArrowRight, UserCheck, ShieldCheck, MapPin, 
  Phone, Mail, Award, CheckCircle 
} from "lucide-react";

interface HomeProps {
  language: Language;
  onNavigate: (page: "home" | "partner" | "apply" | "tracker" | "admin") => void;
  translationsState: Record<Language, any>;
  images: {
    heroTeam: string;
    about: string;
    ourServices: string;
    ourValues: string;
    destKuwait: string;
    destSaudi: string;
  };
}

function SlideshowImage({ local, fallback, alt, className }: { local: string; fallback: string; alt: string; className?: string }) {
  const [src, setSrc] = useState(local);

  useEffect(() => {
    setSrc(local);
  }, [local]);

  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback);
        }
      }}
      referrerPolicy="no-referrer"
      className={className}
      loading="lazy"
    />
  );
}

interface FadingSlideshowProps {
  images: { local: string; fallback: string }[];
  alt: string;
  className?: string;
  interval?: number;
}

function FadingSlideshow({ images, alt, className = "w-full h-full object-cover", interval = 4000 }: FadingSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <SlideshowImage
            local={images[index].local}
            fallback={images[index].fallback}
            alt={`${alt} - Slide ${index + 1}`}
            className={className}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home({ language, onNavigate, translationsState, images }: HomeProps) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const t = translationsState[language];

  // Images with referrerPolicy constraint
  const heroTeamUrl = images.heroTeam;
  const aboutUrl = images.about;
  const ourServicesUrl = images.ourServices;
  const ourValuesUrl = images.ourValues;

  const values = [
    { 
      n: "01", 
      title: t.valueTitle1 || "Integrity & Transparency", 
      titleAm: t.valueTitle1Am || "ታማኝነት እና ግልጽነት", 
      titleAr: t.valueTitle1Ar || "النزاهة والشفافية", 
      body: t.valueBody1 || "Clear terms, honest expectations, and no hidden fees — for workers and employers alike.", 
      bodyAm: t.valueBody1Am || "ግልጽ የስራ ውል፣ ታማኝ አገልግሎት እና ምንም አይነት የተደበቀ ክፍያ የሌለበት — ለሰራተኞችም ሆነ ለቀጣሪዎች።", 
      bodyAr: t.valueBody1Ar || "شروط واضحة، توقعات صادقة، ولا توجد رسوم خفية — للعمال وأرباب العمل على حد سواء." 
    },
    { 
      n: "02", 
      title: t.valueTitle2 || "Professional Service", 
      titleAm: t.valueTitle2Am || "ራሱን የቻለ ሙያዊ አገልግሎት", 
      titleAr: t.valueTitle2Ar || "خدمة مهنية متكاملة", 
      body: t.valueBody2 || "A trained team guides every placement from first interview to safe arrival overseas.", 
      bodyAm: t.valueBody2Am || "የሰለጠነ የቅጥር መሪ ቡድን ከመጀመሪያው ቃለ መጠይቅ ጀምሮ እስካስተማማኝ መዳረሻ ሀገር ድረስ ይመራል።", 
      bodyAr: t.valueBody2Ar || "فريق مدرب يوجه كل عملية استقدام من المقابلة الأولى وحتى الوصول الآمن في الخارج." 
    },
    { 
      n: "03", 
      title: t.valueTitle3 || "Respect for Workers", 
      titleAm: t.valueTitle3Am || "ለሰራተኞች ክብር", 
      titleAr: t.valueTitle3Ar || "احترام كرامة وحقوق العمال", 
      body: t.valueBody3 || "Dignified treatment, fair contracts, and continued support throughout the employment term.", 
      bodyAm: t.valueBody3Am || "ክብር ያለው አያያዝ፣ ሚዛናዊ የጋራ ስምምነት ኮንትራት እና በስራ ዘመን በሙሉ ቀጣይነት ያለው ምርጥ ድጋፍ።", 
      bodyAr: t.valueBody3Ar || "معاملة كريمة وعادلة، عقود عمل عادلة، ودعم مستمر طوال فترة عقد العمل والتوظيف." 
    },
    { 
      n: "04", 
      title: t.valueTitle4 || "Legal & Ethical Recruitment", 
      titleAm: t.valueTitle4Am || "ህጋዊ እና ስነ-ምግባራዊ ምልመላ", 
      titleAr: t.valueTitle4Ar || "الاستقدام القانوني والأخلاقي", 
      body: t.valueBody4 || "Fully licensed in Ethiopia and compliant with destination-country labor regulations.", 
      bodyAm: t.valueBody4Am || "በኢትዮጵያ ስራና ማህበራዊ ጉዳይ ሙሉ ፍቃድ ያለው እና የመዳረሻ አገሮችን ህግጋት የተከተለ።", 
      bodyAr: t.valueBody4Ar || "مرخص بالكامل في إثيوبيا ومتوافق تمامًا مع لوائح قوانين العمل في دول المقصد والخليج." 
    },
    { 
      n: "05", 
      title: t.valueTitle5 || "Commitment to Excellence", 
      titleAm: t.valueTitle5Am || "ለምርጥ ውጤት መትጋት", 
      titleAr: t.valueTitle5Ar || "الالتزام بالتميز والجودة", 
      body: t.valueBody5 || "We measure success by long-term placements and the satisfaction of both sides.", 
      bodyAm: t.valueBody5Am || "ስኬታችንን የምንለካው በሰራተኞቻችን የረጅም ጊዜ ስኬታማነት እና በሁለቱም ወገን መደሰት ነው።", 
      bodyAr: t.valueBody5Ar || "نقيس نجاحنا باستمرار التوظيف طويل الأمد والرضا والموثوقية من كلا الطرفين." 
    },
  ];

  const destinations = [
    { 
      country: "Kuwait", 
      city: t.destKuwaitCity || "Kuwait City", 
      img: images.destKuwait,
      blurb: t.destKuwaitBlurb || "Established placement pipeline with families seeking experienced domestic staff.",
      blurbAm: t.destKuwaitBlurbAm || "ልምድ ያላቸውን የቤት ውስጥ ሰራተኞች ከሚፈልጉ ታማኝ ቤተሰቦች ጋር የተመሰረተ የስራ ትስስር።",
      blurbAr: t.destKuwaitBlurbAr || "مسار توظيف متكامل ومنظم لدى عائلات كويتية تبحث عن كوادر متميزة وخبيرة.",
      cities: [t.destKuwaitCity || "Kuwait City"],
      citiesAm: [t.destKuwaitCityAm || "ኩዌት ሲቲ"],
      citiesAr: [t.destKuwaitCityAr || "مدينة الكويت"],
      flightTime: t.destKuwaitFlightTime || "Approx. 4 hours, 10 minutes",
      flightTimeAm: t.destKuwaitFlightTimeAm || "ወደ 4 ሰዓት ከ 10 ደቂቃ ያህል",
      flightTimeAr: t.destKuwaitFlightTimeAr || "حوالي ٤ ساعات و ١٠ دقائق",
      relationship: t.destKuwaitRelationship || "Direct recruitment partnership ensuring verified safety standards and supportive welfare.",
      relationshipAm: t.destKuwaitRelationshipAm || "የሰራተኞቻችንን መብትና ደህንነት የሚያረጋግጥ ቀጥተኛ የስራ ውል ስምምነት።",
      relationshipAr: t.destKuwaitRelationshipAr || "شراكة استقدام مباشرة تضمن معايير أمان عالية ورعاية مستمرة وشاملة.",
      turnaround: t.destKuwaitTurnaround || "20 - 30 Days",
      turnaroundAm: t.destKuwaitTurnaroundAm || "20 - 30 ቀናት",
      turnaroundAr: t.destKuwaitTurnaroundAr || "٢٠ - ٣٠ يوماً"
    }
  ];

  const testimonials = [
    { role: t.role1, text: t.testimonial1 },
    { role: t.role2, text: t.testimonial2 },
    { role: t.role3, text: t.testimonial3 },
    { role: t.role4, text: t.testimonial4 },
  ];

  const services = [
    ["Housemaids", ""],
    ["Cleaners", ""],
    ["Cooks", ""],
    ["Nannies", ""],
    ["Caregivers", ""],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32 md:pt-32 lg:px-12 lg:pb-40 bg-[#0E1A2C] text-white">
        {/* Full-bleed corner-to-corner background image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background Image filling the section completely corner to corner */}
          <img 
            src={heroTeamUrl} 
            alt="Mihret Agency Background"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-[10000ms] hover:scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Dark luxury gradient overlay for ultimate text readability (made half as thin/strong) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A2C]/45 via-[#0E1A2C]/35 to-[#0E1A2C]/50" />
          
          {/* Elegant corner accents directly in the edge-to-edge frame */}
          <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-real-gold/40" />
          <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-real-gold/40" />
          <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-real-gold/40" />
          <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-real-gold/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center">
            
            {/* Visual Stagger Entrance for Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                <Award className="size-4 shrink-0 animate-pulse text-real-gold" />
                <span className="text-real-gold">Ministry License Approved & Certified</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl leading-[1.05] tracking-tight font-display text-white max-w-3xl">
                {t.heroTitle}
              </h1>
              
              <p className="max-w-xl text-lg leading-relaxed text-white/80 mx-auto">
                <span className="font-semibold text-real-gold">{t.heroSub}</span>
                <br />
                {t.heroText}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <button
                  onClick={() => {
                    onNavigate("partner");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group inline-flex items-center justify-center border-2 border-real-gold bg-real-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0E1A2C] transition-all hover:brightness-105 hover:shadow-lg hover:shadow-real-gold/10 active:scale-95 cursor-pointer"
                >
                  <span>{t.partnerBtn}</span>
                  <ArrowRight className="ml-2.5 size-4 transition-transform group-hover:translate-x-1 text-[#0E1A2C]" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("apply");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center border-2 border-real-gold bg-real-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0E1A2C] transition-all hover:brightness-105 hover:shadow-lg hover:shadow-real-gold/10 active:scale-95 cursor-pointer"
                >
                  {t.applyBtn}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Placements strip */}
      <section className="border-y border-brand-border bg-card/30 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-brand-navy/40">
            {t.stripLabel}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-24">
            {["Kuwait"].map((b, i) => (
              <div key={b} className="flex items-center gap-3 font-display text-xl font-light tracking-wide text-brand-navy/80">
                <span className="text-sm font-semibold text-brand-gold">0{i+1}.</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 bg-[#F5F7FB] px-6 py-24 lg:px-12 border-b border-brand-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between border-b border-brand-border pb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
                LEGALLY LICENSED RECRUITMENT
              </span>
              <h2 className="mt-2 text-4xl lg:text-5xl font-display text-brand-navy">{t.aboutTitle}</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold/80 block">
              {t.aboutSub}
            </span>
          </div>

          <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
            <div className="space-y-6 text-lg leading-relaxed text-brand-navy/75">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-brand-gold">
                {t.aboutP1}
              </p>
              <p className="whitespace-pre-line leading-relaxed text-base border-t border-brand-border/40 pt-4">{t.aboutP2}</p>
            </div>
            
            <div className="relative w-full aspect-[16/10] group rounded shadow-sm bg-brand-cream border border-brand-border/40 overflow-hidden">
              <div className="absolute inset-0 p-2 flex items-center justify-center">
                <SlideshowImage
                  local={aboutUrl}
                  fallback="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=905&q=80"
                  alt="Mihret Agency professional placements candidate checking documentation"
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 bg-white px-6 py-24 lg:px-12 border-b border-brand-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 border-b border-brand-border pb-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
              PROFESSIONAL DOMESTIC STAFF
            </span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-display text-brand-navy">{t.footerServices}</h2>
          </div>

          <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
            <div className="relative w-full aspect-[4/3] group rounded shadow-sm bg-brand-cream border border-brand-border/40 overflow-hidden">
              <div className="absolute inset-0 p-2 flex items-center justify-center">
                <SlideshowImage
                  local={ourServicesUrl}
                  fallback="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=960&q=80"
                  alt="Care and attention to household detail and placement guidance"
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>

            <ul className="divide-y divide-brand-border border-y border-brand-border">
              {services.map(([tKey]) => {
                let title = "";
                let desc = "";
                if (tKey === "Housemaids") { title = t.serviceHousemaids; desc = t.serviceHousemaidsDesc; }
                else if (tKey === "Cleaners") { title = t.serviceCleaners; desc = t.serviceCleanersDesc; }
                else if (tKey === "Cooks") { title = t.serviceCooks; desc = t.serviceCooksDesc; }
                else if (tKey === "Nannies") { title = t.serviceNannies; desc = t.serviceNanniesDesc; }
                else if (tKey === "Caregivers") { title = t.serviceCaregivers; desc = t.serviceCaregiversDesc; }
                else { title = tKey; desc = ""; }
                
                return (
                  <li key={tKey} className="group flex items-center justify-between gap-6 py-5 hover:bg-[#F5F7FB] px-3 transition-colors">
                    <div>
                      <h3 className="text-xl font-display tracking-tight text-brand-navy transition-all group-hover:text-brand-gold">{title}</h3>
                      <p className="mt-1 text-sm text-brand-navy/60">{desc}</p>
                    </div>
                    <span className="text-brand-gold translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">→</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Values + Vision (Why Choose Us) */}
      <section id="values" className="scroll-mt-24 bg-white px-6 py-24 text-brand-navy lg:px-12 border-b border-brand-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-16 lg:grid-cols-[1.25fr_1fr]">
            <div className="lg:sticky lg:top-28 space-y-10">
              <div className="relative w-full aspect-square rounded-lg shadow-sm bg-brand-cream border border-brand-border/40 overflow-hidden">
                <div className="absolute inset-0 p-2 flex items-center justify-center">
                  <SlideshowImage
                    local={ourValuesUrl}
                    fallback="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80"
                    alt="Candidate interviews and secure processing at Mihret Agency"
                    className="max-w-full max-h-full object-contain transition-all duration-700 hover:scale-[1.01]"
                  />
                </div>
              </div>
              <div className="border-l-2 border-brand-gold pl-6 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  {t.commitmentTitle}
                </span>
                <p className="text-lg leading-relaxed text-brand-navy/75">
                  {t.commitmentText}
                </p>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <h2 className="mb-12 text-4xl lg:text-6xl leading-tight font-display text-brand-navy">
                {t.valuesTitle}{" "}
                <span className="text-brand-gold italic block md:inline font-serif">{t.valuesTitleSpan}</span>
              </h2>
              <div className="space-y-10">
                {values.map((p) => {
                  // Determine title and body based on language
                  let displayTitle = p.title;
                  let displayBody = p.body;
                  if (language === "am") {
                    displayTitle = p.titleAm;
                    displayBody = p.bodyAm;
                  } else if (language === "ar") {
                    displayTitle = p.titleAr;
                    displayBody = p.bodyAr;
                  }
                  return (
                    <div key={p.n} className="flex gap-6 border-b border-brand-border pb-8 last:border-b-0">
                      <span className="font-display text-4xl font-extralight text-brand-gold/40">{p.n}</span>
                      <div className="space-y-1.5">
                        <h4 className="font-sans text-lg font-medium text-brand-navy">{displayTitle}</h4>
                        <p className="text-base leading-relaxed text-brand-navy/60">{displayBody}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-6 py-24 lg:px-12 border-b border-brand-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 border-b border-brand-border pb-8 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              CLIENT & WORKER SATISFACTION
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl">{t.testimonialsTitle}</h2>
            <p className="mt-4 text-base sm:text-lg text-brand-navy/70">
              {t.testimonialsSub}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden min-h-[250px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="border border-brand-border p-8 md:p-12 bg-[#F5F7FB] shadow-md relative">
                    <span className="absolute top-4 right-6 font-serif text-6xl text-brand-gold/15 select-none font-bold">“</span>
                    <p className="text-lg md:text-xl text-brand-navy/85 leading-relaxed mb-8 italic">
                      “{testimonials[testimonialIndex].text}”
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-brand-border/50 pt-6">
                      <div>
                        <p className="text-xs md:text-sm text-brand-navy/55">{testimonials[testimonialIndex].role}</p>
                      </div>
                      <div className="inline-flex self-start sm:self-center items-center gap-1.5 rounded-full bg-brand-gold/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold border border-brand-gold/20">
                        <CheckCircle className="size-3.5" />
                        <span>{t.verified}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="mt-8 flex justify-center gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === testimonialIndex ? "bg-brand-navy w-8" : "bg-brand-border hover:bg-brand-gold"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="scroll-mt-24 px-6 py-24 lg:px-12 bg-[#F5F7FB]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 border-b border-brand-border pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                OFFICIAL WORK DESTINATIONS
              </span>
              <h2 className="mt-2 text-4xl lg:text-5xl font-display">{t.destTitle}</h2>
            </div>
            <p className="text-lg leading-relaxed text-brand-navy/70 lg:col-span-7">
              {t.destText}
            </p>
          </div>

          <div className="bg-brand-cream border border-brand-border overflow-hidden">
            {destinations.map((d) => {
              // Extract translation blurb
              let displayBlurb = d.blurb;
              if (language === "am") displayBlurb = d.blurbAm;
              else if (language === "ar") displayBlurb = d.blurbAr;

              return (
                <div key={d.country} className="grid lg:grid-cols-12">
                  {/* Left: Image */}
                  <div className="lg:col-span-5 relative overflow-hidden bg-brand-cream min-h-[300px] lg:min-h-full">
                    <img
                      src={d.img}
                      alt={`${d.country} metropolitan skyline`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-102"
                    />
                    <div className="absolute top-4 left-4 bg-brand-navy/90 text-brand-cream border border-brand-gold/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider select-none">
                      {t.activePlacements}
                    </div>
                  </div>

                  {/* Right: Info & Details always open sideways */}
                  <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
                        LICENSED PIPELINE
                      </span>
                      <h3 className="mb-2 text-4xl font-display text-brand-navy">{d.country}</h3>
                      <p className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-brand-navy/40">
                        {d.city}
                      </p>
                      <p className="text-base leading-relaxed text-brand-navy/70 mb-8">{displayBlurb}</p>

                      {/* Sideways Details */}
                      <div className="border-t border-brand-border/40 pt-8 grid gap-8 sm:grid-cols-2">
                        {/* Column 1: Flight, Turnaround, Cities */}
                        <div className="space-y-6">
                          <div className="space-y-1">
                            <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy/40">
                              {t.flightDurationLabel}
                            </span>
                            <p className="text-sm font-semibold text-brand-navy/85">
                              {language === "am" ? d.flightTimeAm : language === "ar" ? d.flightTimeAr : d.flightTime}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy/40">
                              {t.turnaroundLabel}
                            </span>
                            <p className="text-sm font-semibold text-brand-navy/85">
                              {language === "am" ? d.turnaroundAm : language === "ar" ? d.turnaroundAr : d.turnaround}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy/40">
                              {t.citiesLabel}
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {(language === "am" ? d.citiesAm : language === "ar" ? d.citiesAr : d.cities).map((city) => (
                                <span key={city} className="bg-white/70 border border-brand-border px-2 py-0.5 text-[10px] font-medium text-brand-navy/75 rounded">
                                  {city}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Partnership / Relationship */}
                        <div className="space-y-2">
                          <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy/40">
                            {t.relationshipLabel}
                          </span>
                          <p className="text-sm leading-relaxed text-brand-navy/70">
                            {language === "am" ? d.relationshipAm : language === "ar" ? d.relationshipAr : d.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="scroll-mt-24 border-t border-brand-border px-6 py-24 lg:px-12 bg-brand-cream">
        <div className="mx-auto max-w-7xl font-sans">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                {t.locationLabel}
              </span>
              <h2 className="text-4xl leading-tight lg:text-5xl font-display text-brand-navy">{t.locationTitle}</h2>
              <address className="not-italic text-lg leading-relaxed text-brand-navy/70 space-y-1">
                {t.locationAddress.split("\n").map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </address>
              <div className="pt-4">
                <a
                  href="https://share.google/WoALpZnPItqcZzYIR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex border-2 border-brand-navy px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy transition-all hover:bg-brand-navy hover:text-brand-cream active:scale-95"
                >
                  {t.directionsBtn}
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="overflow-hidden">
                <iframe
                  title="Mihret Private Employment Agency office location in Addis Ababa"
                  src="https://maps.google.com/maps?q=MERIKATO+HAJI+LEGESEE+Building,Addis+Ababa&t=m&z=17&output=embed"
                  className="aspect-[4/3] w-full border border-brand-border grayscale hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contacts Panel */}
      <section id="contact" className="scroll-mt-24 border-t border-brand-border bg-brand-navy px-6 py-24 text-brand-cream lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-brand-cream/15 pb-10">
            <div>
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                {t.contactLabel}
              </span>
              <h2 className="text-4xl leading-tight lg:text-6xl font-display text-brand-cream">
                {t.contactTitle}
              </h2>
            </div>
          </div>
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
            <a href="tel:+251911007818" className="group block border-t border-brand-cream/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                <Phone className="size-3 text-brand-gold" />
                <span>{t.contactPrimary}</span>
              </span>
              <p className="mt-4 font-display text-3xl group-hover:text-brand-gold hover:italic transition-all duration-300">+251 911 007 818</p>
            </a>
            <a href="tel:+251902759251" className="group block border-t border-brand-cream/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                <Phone className="size-3 text-brand-gold" />
                <span>{t.contactSecondary}</span>
              </span>
              <p className="mt-4 font-display text-3xl group-hover:text-brand-gold hover:italic transition-all duration-300">+251 902 759 251</p>
            </a>
            <a href="mailto:mihretagency@gmail.com" className="group block border-t border-brand-cream/15 pt-6 transition-colors hover:border-brand-gold">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                <Mail className="size-3 text-brand-gold" />
                <span>{t.contactEmail}</span>
              </span>
              <p className="mt-4 break-all font-display text-3xl group-hover:text-brand-gold hover:italic transition-all duration-300 font-mono text-2xl">mihretagency@gmail.com</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
