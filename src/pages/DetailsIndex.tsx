import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowRight, BookOpenText, ChevronLeft, FileText, Home, LayoutGrid } from 'lucide-react'
import { detailPagesList } from '../data/details'
import { atlasFlows } from '../data/details/atlas'
import { DetailIcon } from './DetailPage'

export default function DetailsIndex() {
  useEffect(() => {
    document.title = 'الدليل التفصيلي لتنفيذ نظام ERP | أريج'
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="min-h-screen bg-background font-cairo text-foreground">
      {/* شريط علوي */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="inline-flex items-center gap-1.5 font-bold text-muted-foreground transition-colors hover:text-brand-green">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-black text-brand-green">الدليل التفصيلي</span>
          </div>
          <Link to="/">
            <img src="/logo.png" alt="أريج" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      {/* ترويسة */}
      <div className="bg-brand-green text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-black text-brand-gold">
            <BookOpenText className="h-4 w-4" />
            المرجع التنفيذي الكامل
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">الدليل التفصيلي لتنفيذ نظام ERP</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/85">
            شرح شامل لكل قسم من أقسام دورة العمل مع مخططات توضح كيف تتم كل عملية بالتفصيل — مبني على مستند
            Business Requirements & Operational Blueprint V 1.0، وجاهز كمرجع لفريق تنفيذ ERPNext.
          </p>
        </div>
      </div>

      {/* بطاقات الأقسام */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* لافتة أطلس المخططات */}
        <Link
          to="/charts"
          className="group mb-8 flex flex-col items-start gap-4 rounded-2xl border-2 border-brand-gold/50 bg-gradient-to-l from-brand-green to-brand-green-dark p-6 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:flex-row sm:items-center"
        >
          <div className="rounded-xl bg-brand-gold/20 p-3.5">
            <LayoutGrid className="h-8 w-8 text-brand-gold" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-brand-gold">أطلس المخططات التشغيلية</h2>
            <p className="mt-1 text-sm leading-relaxed text-white/85">
              كل الرسوم التدفقية والمعادلات الحاكمة ({atlasFlows.length} مخططاً) في صفحة واحدة بفلاتر حسب القسم — مرجع سريع للعرض والمراجعة.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-gold px-5 py-2.5 font-black text-brand-green-dark transition-transform group-hover:-translate-x-1">
            افتح الأطلس
            <ChevronLeft className="h-4 w-4" />
          </span>
        </Link>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detailPagesList.map((page) => (
            <Link
              key={page.slug}
              to={`/details/${page.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-green/10 p-3 transition-colors group-hover:bg-brand-gold/15">
                  <DetailIcon name={page.icon} className="h-6 w-6 text-brand-green transition-colors group-hover:text-brand-gold" />
                </div>
                <h2 className="font-black leading-snug text-brand-green group-hover:text-brand-gold">{page.title}</h2>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{page.subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {page.docRefs.slice(0, 2).map((ref) => (
                  <span key={ref} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {ref}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-brand-gold">
                استعرض القسم
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        {/* عودة */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3 font-black text-white transition-colors hover:bg-brand-green-dark"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الموقع الرئيسي
          </Link>
        </div>
      </div>

      <footer className="border-t border-border bg-brand-green-dark py-6 text-center text-sm text-white/70">
        شركة أريج لماكينات وخدمات الطباعة — الدليل التفصيلي لتنفيذ نظام ERP · مستند Business Requirements & Operational Blueprint V 1.0
      </footer>
    </div>
  )
}
