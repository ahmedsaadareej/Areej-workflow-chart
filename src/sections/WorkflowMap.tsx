import { workflowSteps, designRule } from '@/data/workflow';
import { ArrowLeft, Info } from 'lucide-react';
import MoreButton from '@/components/more-button';

export default function WorkflowMap() {
  return (
    <section id="map" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <span className="text-brand-gold font-extrabold text-sm tracking-wide">من الاستفسار إلى ما بعد البيع</span>
        <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">الخريطة الرئيسية لدورة أعمال أريج</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          الخريطة التالية تجمع القرارات المعتمدة في مسار واحد — مرّر أو اضغط على أي مرحلة لعرض تفاصيلها.
        </p>
      </div>

      {/* شريط المسار */}
      <div className="overflow-x-auto scrollbar-thin pb-4 -mx-4 px-4">
        <div className="flex items-stretch gap-0 min-w-max">
          {workflowSteps.map((s, i) => (
            <div key={s.n} className="flex items-center group">
              <div className="relative bg-card border-2 border-border hover:border-brand-gold rounded-2xl p-4 w-44 transition-all hover:shadow-xl hover:-translate-y-1 cursor-default">
                <div className="absolute -top-3 right-4 bg-brand-green group-hover:bg-brand-gold text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                  {s.n}
                </div>
                <div className="font-extrabold text-brand-green mt-2">{s.title}</div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</div>
              </div>
              {i < workflowSteps.length - 1 && (
                <ArrowLeft className="w-6 h-6 mx-1 text-brand-gold shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* مبدأ التصميم */}
      <div className="mt-8 bg-brand-green text-white rounded-2xl p-6 md:p-8 flex gap-4 items-start shadow-lg">
        <div className="bg-brand-gold/20 rounded-xl p-3 shrink-0">
          <Info className="w-6 h-6 text-brand-gold" />
        </div>
        <div>
          <div className="font-extrabold text-brand-gold text-lg mb-2">مبدأ التصميم الحاكم</div>
          <p className="leading-relaxed text-white/90">{designRule}</p>
          <p className="mt-3 text-white/70 text-sm">
            إنشاء المستند لا يعني بالضرورة حجز المخزون أو خصمه؛ لكل أثر مستند واعتماد مستقل — يمنع شرط الانتقال
            الانتقالَ قبل اكتماله مثل الاعتماد أو الدفع أو الائتمان أو توافر الخامة أو جاهزية الملف أو فحص الجودة.
          </p>
        </div>
      </div>

      <MoreButton to="/details/business-map" label="اعرف المزيد عن الخريطة وأبعاد التحليل" />
    </section>
  );
}
