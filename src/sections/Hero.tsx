import { Link } from 'react-router';
import { meta } from '@/data/workflow';
import { decisions } from '@/data/decisions';
import { testPackages, futureTopics } from '@/data/extras';
import { BadgeCheck, CalendarDays, FileText, Layers } from 'lucide-react';

const stats = [
  { icon: BadgeCheck, value: `${decisions.length} + 1`, label: 'قراراً معتمداً D 01 – D 36' },
  { icon: Layers, value: `${testPackages.length}`, label: 'حزمة تدفق واختبار WF' },
  { icon: FileText, value: `${futureTopics.length}`, label: 'موضوعاً مستقبلياً D 37 – D 58' },
  { icon: CalendarDays, value: meta.date, label: 'تاريخ الإصدار' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-green-dark text-white">
      {/* زخارف خلفية */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-10">
          <div className="justify-self-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-2xl scale-110" />
              <img
                src="/logo.png"
                alt="شعار شركة أريج"
                className="relative w-44 h-44 md:w-56 md:h-56 rounded-full object-cover ring-4 ring-brand-gold shadow-2xl bg-white"
              />
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold rounded-full px-4 py-1.5 text-sm font-bold mb-5">
              <BadgeCheck className="w-4 h-4" />
              {meta.status}
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
              {meta.docName}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-semibold mb-2">
              {meta.company} — <span dir="ltr" className="font-cairo">{meta.docCode} {meta.version}</span>
            </p>
            <p className="text-white/60 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              مرجع تقني محايد يشرح كيف تعمل أريج من الاستفسار حتى التسليم والتحصيل وما بعد البيع — دون افتراض اسم البرنامج المستخدم،
              مع شرح دورة العمل والمسؤوليات والبوابات والمستندات والضوابط.
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <a
                href="#decisions"
                className="bg-brand-gold hover:bg-amber-500 text-emerald-950 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
              >
                استكشف القرارات الـ 36
              </a>
              <a
                href="#map"
                className="border-2 border-white/25 hover:border-brand-gold hover:text-brand-gold text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                الخريطة الرئيسية للدورة
              </a>
              <Link
                to="/details"
                className="border-2 border-brand-gold/60 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-emerald-950 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                الدليل التفصيلي لتنفيذ ERP
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/[0.1] transition-colors"
            >
              <s.icon className="w-6 h-6 text-brand-gold mb-3" />
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-white/60 text-sm font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* موجة فاصلة */}
      <svg viewBox="0 0 1440 80" className="block w-full text-background fill-current" preserveAspectRatio="none">
        <path d="M0,40 C360,90 1080,-10 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}
