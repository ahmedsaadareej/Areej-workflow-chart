import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { BookOpenText, ChevronLeft, FileText, Home, LayoutGrid, Sigma } from 'lucide-react'
import { atlasFlows, atlasFormulas, atlasSections } from '../data/details/atlas'
import { FlowDiagram, BlockRenderer } from '../components/detail-blocks'
import { DetailIcon } from './DetailPage'

export default function ChartsAtlas() {
  const [section, setSection] = useState<string>('all')

  useEffect(() => {
    document.title = 'أطلس المخططات التشغيلية | أريج'
    window.scrollTo({ top: 0 })
  }, [])

  const sections = useMemo(
    () => (section === 'all' ? atlasSections : atlasSections.filter((s) => s.page.slug === section)),
    [section],
  )

  const formulas = useMemo(
    () => (section === 'all' ? atlasFormulas : atlasFormulas.filter((f) => f.page.slug === section)),
    [section],
  )

  return (
    <div className="min-h-screen bg-background font-cairo text-foreground">
      {/* شريط علوي */}
      <header className="sticky top-0 z-40 border-b border-border bg-card backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="inline-flex items-center gap-1.5 font-bold text-muted-foreground transition-colors hover:text-brand-green">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
            <Link to="/details" className="font-bold text-muted-foreground transition-colors hover:text-brand-green">
              الدليل التفصيلي
            </Link>
            <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-black text-brand-green">أطلس المخططات</span>
          </div>
          <Link to="/">
            <img src="/logo.png" alt="أريج" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      {/* ترويسة */}
      <div className="bg-brand-green text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-black text-brand-gold">
            <LayoutGrid className="h-4 w-4" />
            كل الرسوم التشغيلية في مكان واحد
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">أطلس المخططات التشغيلية</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/85">
            {atlasFlows.length} مخططاً تدفقياً في {atlasSections.length} أقسام + {atlasFormulas.length} معادلات حاكمة — كل مخطط مرتبط بسياقه
            الكامل في الدليل التفصيلي.
          </p>
        </div>
      </div>

      {/* شريط الفلاتر */}
      <div className="sticky top-[57px] z-30 border-b border-border bg-background backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <button
              onClick={() => setSection('all')}
              className={`whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                section === 'all' ? 'border-brand-green bg-brand-green text-white' : 'border-border bg-card hover:border-brand-gold'
              }`}
            >
              الكل ({atlasFlows.length})
            </button>
            {atlasSections.map((s) => (
              <button
                key={s.page.slug}
                onClick={() => setSection(s.page.slug)}
                className={`whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                  section === s.page.slug ? 'border-brand-green bg-brand-green text-white' : 'border-border bg-card hover:border-brand-gold'
                }`}
              >
                {s.page.title} ({s.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المخططات مجمعة حسب القسم */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10">
        {sections.map(({ page }) => {
          const flows = atlasFlows.filter((f) => f.page.slug === page.slug)
          return (
            <section key={page.slug}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-r-4 border-brand-gold pr-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-brand-green/10 p-2.5">
                    <DetailIcon name={page.icon} className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-green sm:text-2xl">{page.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {flows.length} {flows.length === 1 ? 'مخطط' : 'مخططات'}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/details/${page.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-black text-brand-green transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <BookOpenText className="h-4 w-4" />
                  الصفحة الكاملة للقسم
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-2">
                {flows.map((flow) => (
                  <div key={flow.flowIndex} className="flex h-full flex-col gap-2">
                    <FlowDiagram steps={flow.steps} title={flow.title} />
                    <Link
                      to={`/details/${page.slug}#flow-${flow.flowIndex}`}
                      className="inline-flex w-fit items-center gap-1.5 pr-1 text-sm font-extrabold text-brand-gold transition-colors hover:text-brand-green"
                    >
                      <FileText className="h-4 w-4" />
                      السياق الكامل والشرح في الدليل
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* المعادلات الحاكمة */}
        {formulas.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3 border-r-4 border-brand-gold pr-4">
              <div className="rounded-xl bg-brand-green/10 p-2.5">
                <Sigma className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h2 className="text-xl font-black text-brand-green sm:text-2xl">المعادلات الحاكمة</h2>
                <p className="text-sm text-muted-foreground">القواعد الحسابية المعتمدة التي تُبنى عليها الفوترة والتسويات</p>
              </div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {formulas.map((f, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <BlockRenderer block={f.block} />
                  <Link
                    to={`/details/${f.page.slug}`}
                    className="inline-flex w-fit items-center gap-1.5 pr-1 text-sm font-extrabold text-brand-gold transition-colors hover:text-brand-green"
                  >
                    <FileText className="h-4 w-4" />
                    {f.page.title}
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border bg-brand-green-dark py-6 text-center text-sm text-white/70">
        شركة أريج لماكينات وخدمات الطباعة — أطلس المخططات التشغيلية · مستمد من الدليل التفصيلي V 1.0
      </footer>
    </div>
  )
}
