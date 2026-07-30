import { useState } from 'react';
import { testPackages, futureTopics } from '@/data/extras';
import { FlaskConical, Rocket, Lock } from 'lucide-react';

export function TestPackages() {
  return (
    <section id="tests" className="bg-secondary/40 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-brand-gold font-extrabold text-sm tracking-wide">حزم التدفقات التشغيلية المعتمدة</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">حزم التدفقات واختبارات القبول WF-01 – WF-24</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            خرائط للتشغيل والتدريب والتحقق — كل حزمة تربط مجموعة قرارات مرجعية بتدفق قابل للاختبار من البداية للنهاية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testPackages.map((t) => (
            <div
              key={t.code}
              className="bg-card border-2 border-border hover:border-brand-gold rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="bg-brand-green text-white text-xs font-black px-3 py-1.5 rounded-lg" dir="ltr">
                  {t.code}
                </span>
                <FlaskConical className="w-5 h-5 text-brand-gold" />
              </div>
              <h3 className="font-extrabold text-foreground leading-snug mb-2">{t.name}</h3>
              <div className="text-xs text-muted-foreground font-bold">
                القرارات المرجعية: <span dir="ltr">{t.refs}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FutureTopics() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? futureTopics : futureTopics.slice(0, 8);

  return (
    <section id="future" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <span className="text-brand-gold font-extrabold text-sm tracking-wide">الموضوعات المتبقية لاستكمال دورة العمل</span>
        <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">الموضوعات المستقبلية D 37 – D 58</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          تُعامَل كسجل استكمال محفوظ وليست سياسات نهائية قبل اعتمادها — وجود قرار مفتوح لا يعني أن المشروع يجب أن يتوقف.
        </p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="grid divide-y divide-border">
          {visible.map((f) => (
            <div key={f.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 md:w-24 shrink-0">
                <span className="bg-muted text-brand-green font-black text-sm px-3 py-1.5 rounded-lg" dir="ltr">
                  {f.id}
                </span>
                <Lock className="w-4 h-4 text-brand-gold" />
              </div>
              <div className="flex-1 font-semibold text-foreground/90 leading-relaxed">{f.topic}</div>
              <div className="text-xs text-muted-foreground font-bold md:w-64 md:text-left shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {f.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-brand-green hover:bg-brand-green-dark text-white font-extrabold px-8 py-3 rounded-xl transition-colors"
        >
          {showAll ? 'عرض أقل' : `عرض كل الموضوعات الـ ${futureTopics.length}`}
        </button>
      </div>

      <div className="mt-8 flex items-start gap-3 bg-brand-green/5 border-2 border-brand-green/15 rounded-2xl p-5">
        <Rocket className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          يبدأ فريق التنفيذ من القرارات D 01 – D 36 وتُغلَق البنود المصنفة بخطة مطابقة الاحتياج مع النظام حسب توقيتها،
          بينما تبقى التحسينات المتقدمة في مرحلتها اللاحقة بسجل واضح — وأي قرار جديد يُسجَّل في سجل القرارات ويُحدَّث هذا المستند عند الحاجة دون إعادة تسمية النسخ التاريخية.
        </p>
      </div>
    </section>
  );
}
