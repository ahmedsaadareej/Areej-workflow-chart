import { principles } from '@/data/workflow';
import { Compass } from 'lucide-react';

export default function Principles() {
  return (
    <section id="principles" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <span className="text-brand-gold font-extrabold text-sm tracking-wide">المبادئ العامة لنموذج التشغيل</span>
        <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">المبادئ الحاكمة الستة</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          يتغير اسم البرنامج أو الشاشة أو التقنية دون تغيير جوهر العملية المطلوبة.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {principles.map((p, i) => (
          <div
            key={p.title}
            className="group bg-card border-2 border-border hover:border-brand-gold rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-green group-hover:bg-brand-gold text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-brand-gold font-black text-2xl">{String(i + 1).padStart(2, '0')}</div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-green mb-2">{p.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
