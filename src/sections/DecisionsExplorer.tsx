import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { categories } from '@/data/workflow';
import { decisions } from '@/data/decisions';
import { Search, ChevronDown, ChevronLeft, Scale, Route, ShieldCheck, Tag, BadgeCheck, BookOpenText } from 'lucide-react';

export default function DecisionsExplorer() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return decisions.filter((d) => {
      const inCat = cat === 'all' || d.categoryId === cat;
      const inQuery =
        !q ||
        d.id.includes(q) ||
        d.title.includes(q) ||
        d.rule.includes(q) ||
        d.chapter.includes(q) ||
        d.tags.some((t) => t.includes(q));
      return inCat && inQuery;
    });
  }, [query, cat]);

  return (
    <section id="decisions" className="bg-secondary/40 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-brand-gold font-extrabold text-sm tracking-wide">سجل قواعد ودورات العمل المعتمدة</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">القرارات المعتمدة D 01 – D 36</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            كل بند يحمل رقم قرار فهو قرار تشغيل معتمد؛ قاعدة الاعتماد: أي تعديل يصدر تعديلاً صريحاً على القرار نفسه ولا يحذف الأثر السابق.
          </p>
          <div className="mt-5">
            <Link
              to="/details"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold px-6 py-2.5 rounded-xl transition-colors"
            >
              <BookOpenText className="w-4 h-4" />
              الدليل التفصيلي الكامل لكل الأقسام
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* البحث والتصفية */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث برقم القرار أو العنوان أو كلمة من القاعدة… مثل: حجز، ضمان، QR، تقسيط"
              className="w-full bg-card border-2 border-border focus:border-brand-gold rounded-xl py-3.5 pr-12 pl-4 outline-none transition-colors font-semibold"
            />
          </div>
          <div className="text-sm text-muted-foreground self-center font-bold whitespace-nowrap">
            {filtered.length} من {decisions.length} قراراً
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-3 mb-8 -mx-4 px-4">
          <button
            onClick={() => setCat('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
              cat === 'all'
                ? 'bg-brand-green text-white border-brand-green'
                : 'bg-card border-border hover:border-brand-gold'
            }`}
          >
            الكل ({decisions.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                cat === c.id
                  ? 'bg-brand-green text-white border-brand-green'
                  : 'bg-card border-border hover:border-brand-gold'
              }`}
            >
              {c.icon} {c.name} ({c.decisions.length})
            </button>
          ))}
        </div>

        {/* بطاقات القرارات */}
        <div className="grid gap-4">
          {filtered.map((d) => {
            const open = openId === d.id;
            const catInfo = categories.find((c) => c.id === d.categoryId);
            return (
              <article
                key={d.id}
                className={`bg-card rounded-2xl border-2 transition-all overflow-hidden ${
                  open ? 'border-brand-gold shadow-xl' : 'border-border hover:border-brand-gold/60'
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="w-full flex items-center gap-4 p-5 text-right"
                >
                  <div className="bg-brand-green text-white font-black text-sm px-3 py-2 rounded-xl shrink-0 min-w-[4.5rem] text-center" dir="ltr">
                    {d.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-foreground">{d.title}</h3>
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5" /> معتمد
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-semibold">
                      {catInfo?.icon} {d.chapter}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-gold shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {open && (
                  <div className="px-5 pb-6 pt-1 grid gap-4 animate-in fade-in">
                    <div className="bg-secondary/60 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-brand-green font-extrabold mb-2">
                        <Scale className="w-5 h-5 text-brand-gold" /> القاعدة المعتمدة
                      </div>
                      <p className="leading-relaxed text-foreground/90">{d.rule}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-800 font-extrabold mb-2">
                          <Route className="w-5 h-5" /> المسار التشغيلي
                        </div>
                        <p className="leading-relaxed text-foreground/85 text-sm">{d.path}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-emerald-800 font-extrabold mb-2">
                          <ShieldCheck className="w-5 h-5" /> الضوابط والموافقات
                        </div>
                        <p className="leading-relaxed text-foreground/85 text-sm">{d.controls}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {d.tags.map((t) => (
                        <span key={t} className="text-xs bg-muted text-muted-foreground font-bold px-2.5 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/details/${d.categoryId}#${'d-' + d.id.replace(/\s+/g, '').toLowerCase()}`}
                      className="inline-flex w-fit items-center gap-1.5 text-sm font-extrabold text-brand-gold hover:text-brand-green transition-colors"
                    >
                      <BookOpenText className="w-4 h-4" />
                      اعرف المزيد — الشرح الكامل والمخطط في الدليل التفصيلي
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-bold">
              لا توجد نتائج مطابقة — جرّب كلمة بحث أخرى.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
