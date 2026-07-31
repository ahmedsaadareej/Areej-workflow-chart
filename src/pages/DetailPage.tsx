import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  ChevronLeft,
  Coins,
  FileText,
  FlaskConical,
  Handshake,
  Home,
  IdCard,
  Map as MapIcon,
  Package,
  Palette,
  Printer,
  Rocket,
  Scale,
  Users,
  Warehouse,
} from 'lucide-react'
import { detailPagesBySlug, detailPagesList } from '../data/details'
import type { DetailPageData } from '../data/details/types'
import { BlockList } from '../components/detail-blocks'

const iconMap: Record<string, typeof MapIcon> = {
  map: MapIcon,
  book: BookOpenText,
  scale: Scale,
  handshake: Handshake,
  package: Package,
  coins: Coins,
  warehouse: Warehouse,
  users: Users,
  printer: Printer,
  palette: Palette,
  calendar: CalendarDays,
  id: IdCard,
  test: FlaskConical,
  rocket: Rocket,
}

export function DetailIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? BookOpenText
  return <Icon className={className} />
}

export default function DetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const page: DetailPageData | undefined = slug ? detailPagesBySlug[slug] : undefined

  const pageIndex = page ? detailPagesList.findIndex((p) => p.slug === page.slug) : -1
  const prevPage = pageIndex > 0 ? detailPagesList[pageIndex - 1] : undefined
  const nextPage = pageIndex >= 0 && pageIndex < detailPagesList.length - 1 ? detailPagesList[pageIndex + 1] : undefined

  useEffect(() => {
    if (!page) return
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0 })
  }, [page, location.hash])

  useEffect(() => {
    if (page) document.title = `${page.title} — الدليل التفصيلي | أريج`
  }, [page])

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-cairo">
        <p className="text-6xl font-black text-brand-green">404</p>
        <p className="mt-3 text-lg font-bold text-foreground">الصفحة المطلوبة غير موجودة</p>
        <Link
          to="/details"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 font-bold text-white transition-colors hover:bg-brand-green-dark"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الدليل التفصيلي
        </Link>
      </div>
    )
  }

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
            <Link to="/details" className="font-bold text-muted-foreground transition-colors hover:text-brand-green">
              الدليل التفصيلي
            </Link>
            <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-black text-brand-green">{page.title}</span>
          </div>
          <Link to="/">
            <img src="/logo.png" alt="أريج" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      {/* ترويسة الصفحة */}
      <div className="border-b border-border bg-brand-green text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-brand-gold/20 p-3.5">
              <DetailIcon name={page.icon} className="h-8 w-8 text-brand-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black sm:text-3xl">{page.title}</h1>
              <p className="mt-2 max-w-3xl leading-relaxed text-white/85">{page.subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {page.docRefs.map((ref) => (
                  <span key={ref} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90">
                    <FileText className="h-3 w-3 text-brand-gold" />
                    {ref}
                  </span>
                ))}
                {page.decisions?.map((d) => (
                  <span key={d} className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-black text-brand-gold">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="mx-auto max-w-7xl gap-10 px-4 py-10 lg:flex">
        {/* الفهرس الجانبي */}
        <aside className="mb-8 shrink-0 lg:mb-0 lg:w-64">
          <div className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24">
            <p className="mb-3 text-sm font-black text-brand-green">محتويات الصفحة</p>
            <ul className="space-y-1">
              {page.toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-brand-green/5 hover:text-brand-green"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* الكتل */}
        <main className="min-w-0 flex-1">
          <BlockList blocks={page.blocks} />

          {/* تنقل سابق / تالي */}
          <nav className="mt-12 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
            {prevPage ? (
              <Link
                to={`/details/${prevPage.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-brand-gold hover:shadow-md"
              >
                <ArrowRight className="h-5 w-5 shrink-0 text-brand-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">السابق</p>
                  <p className="font-black text-brand-green group-hover:text-brand-gold">{prevPage.title}</p>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {nextPage && (
              <Link
                to={`/details/${nextPage.slug}`}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-brand-gold hover:shadow-md sm:text-right"
              >
                <div>
                  <p className="text-xs text-muted-foreground">التالي</p>
                  <p className="font-black text-brand-green group-hover:text-brand-gold">{nextPage.title}</p>
                </div>
                <ChevronLeft className="h-5 w-5 shrink-0 text-brand-gold" />
              </Link>
            )}
          </nav>
        </main>
      </div>

      {/* تذييل بسيط */}
      <footer className="border-t border-border bg-brand-green-dark py-6 text-center text-sm text-white/70">
        شركة أريج لماكينات وخدمات الطباعة — الدليل التفصيلي لتنفيذ نظام ERP · مستند Business Requirements & Operational Blueprint V 1.0
      </footer>
    </div>
  )
}
