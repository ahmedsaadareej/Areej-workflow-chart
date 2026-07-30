import { useState } from 'react';
import { glossary } from '@/data/workflow';
import { roles } from '@/data/extras';
import { BookOpenText, UsersRound, Search } from 'lucide-react';

export function Roles() {
  return (
    <section id="roles" className="bg-brand-green-dark py-16 scroll-mt-24 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-brand-gold font-extrabold text-sm tracking-wide">مصفوفة المسؤوليات العامة</span>
          <h2 className="text-3xl md:text-4xl font-black mt-2">من يفعل ماذا في الدورة العامة</h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">
            الأدوار الحاكمة في الدورة العامة — تظل قواعد فصل المهام ثابتة مهما تغيرت الصلاحيات الديناميكية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div
              key={r.role}
              className="bg-white/[0.06] border border-white/10 hover:border-brand-gold/60 rounded-2xl p-5 transition-all hover:bg-white/[0.1]"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <UsersRound className="w-5 h-5 text-brand-gold shrink-0" />
                <h3 className="font-extrabold">{r.role}</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{r.duties}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Glossary() {
  const [q, setQ] = useState('');
  const filtered = glossary.filter((g) => !q || g.term.includes(q) || g.meaning.includes(q));

  return (
    <section id="glossary" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <span className="text-brand-gold font-extrabold text-sm tracking-wide">قاموس المستندات والسجلات العامة</span>
        <h2 className="text-3xl md:text-4xl font-black text-brand-green mt-2">المسرد الموحّد للمصطلحات</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          توحيد المصطلحات التشغيلية العامة مع مصطلحات الأنظمة — عند ذكر الدور أو السجل يُكتب الاسم الحالي بين قوسين.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في المصطلحات…"
          className="w-full bg-card border-2 border-border focus:border-brand-gold rounded-xl py-3 pr-12 pl-4 outline-none transition-colors font-semibold"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <div key={g.term} className="bg-card border-2 border-border hover:border-brand-gold rounded-2xl p-5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenText className="w-5 h-5 text-brand-gold shrink-0" />
              <h3 className="font-extrabold text-brand-green">{g.term}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{g.meaning}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground font-bold">لا توجد نتائج مطابقة.</div>
        )}
      </div>
    </section>
  );
}
