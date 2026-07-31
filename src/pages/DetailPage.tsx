import { useEffect, useMemo, useRef, useState } from 'react'
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
  LayoutGrid,
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
import type { Block, DetailPageData } from '../data/details/types'
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

type HeadingBlock = Extract<Block, { type: 'heading' }>

interface PageSection {
  heading: HeadingBlock
  blocks: Block[]
}

const countFlows = (blocks: Block[]) => blocks.filter((b) => b.type === 'flow').length

export default function DetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const page: DetailPageData | undefined = slug ? detailPagesBySlug[slug] : undefined

  const [activeTab, setActiveTab] = useState(0)
  const contentTopRef = useRef<HTMLDivElement>(null)
  const pendingScroll = useRef<string | null>(null)

  const pageIndex = page ? detailPagesList.findIndex((p) => p.slug === page.slug) : -1
  const prevPage = pageIndex > 0 ? detailPagesList[pageIndex - 1] : undefined
  const nextPage = pageIndex >= 0 && pageIndex < detailPagesList.length - 1 ? detailPagesList[pageIndex + 1] : undefined

  // تقسيم الكتل إلى مقدمة + أقسام (كل عنوان رئيسي = تبويب) دون تغيير المحتوى
  const parsed = useMemo(() => {
    if (!page) return null
    const preamble: Block[] = []
    const sections: PageSection[] = []
    for (const b of page.blocks) {
      if (b.type === 'heading') sections.push({ heading: b, blocks: [] })
      else if (sections.length) sections[sections.length - 1].blocks.push(b)
      else preamble.push(b)
    }
    // إزاحة ترقيم المخططات لكل قسم (تحافظ على مراسي flow-N العالمية)
    const offsets: number[] = []
    let acc = countFlows(preamble)
    for (const s of sections) {
      offsets.push(acc)
      acc += countFlows(s.blocks)
    }
    // خريطة المراسي → رقم التبويب (للروابط العميقة من الموقع والأطلس)
    const hashMap: Record<string, number> = {}
    sections.forEach((s, i) => {
      if (s.heading.anchor) hashMap[s.heading.anchor] = i
      let f = offsets[i]
      for (const b of s.blocks) {
        if (b.type === 'decision') hashMap['d-' + b.id.replace(/\s+/g, '').toLowerCase()] = i
        if (b.type === 'flow') hashMap['flow-' + f++] = i
      }
    })
    return { preamble, sections, offsets, hashMap }
  }, [page])

  // الروابط العميقة: #d-d33 أو #flow-2 أو #anchor يفتح التبويب الصح ثم يمرّر للعنصر
  useEffect(() => {
    if (!parsed) return
    const hash = location.hash.replace('#', '')
    if (!hash) {
      setActiveTab(0)
      window.scrollTo({ top: 0 })
      return
    }
    const idx = parsed.hashMap[hash]
    if (idx !== undefined) {
      pendingScroll.current = hash
      setActiveTab(idx)
    }
  }, [location.hash, parsed])

  useEffect(() => {
    if (pendingScroll.current) {
      const id = pendingScroll.current
      pendingScroll.current = null
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 140)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  useEffect(() => {
    if (page) document.title = `${page.title} — الدليل التفصيلي | أريج`
  }, [page])

  if (!page || !parsed) {
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

  const tocLabel = (anchor: string | undefined, fallback: string) =>
    (anchor && page.toc.find((t) => t.id === anchor)?.label) || fallback

  const selectTab = (i: number) => {
    setActiveTab(i)
    const anchor = parsed.sections[i].heading.anchor
    if (anchor) window.history.replaceState(null, '', `#${anchor}`)
    setTimeout(() => contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const active = parsed.sections[activeTab]

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
            <span className="font-black text-brand-green">{page.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/charts"
              className="hidden items-center gap-1.5 rounded-lg border-2 border-brand-gold/50 px-3 py-1.5 text-xs font-black text-brand-gold transition-colors hover:bg-brand-gold/10 sm:inline-flex"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              أطلس المخططات
            </Link>
            <Link to="/">
              <img src="/logo.png" alt="أريج" className="h-9 w-auto" />
            </Link>
          </div>
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

      {/* شريط التبويبات */}
      <div className="sticky top-[61px] z-30 border-b border-border bg-background backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {parsed.sections.map((s, i) => {
              const decision = s.blocks.find((b) => b.type === 'decision') as Extract<Block, { type: 'decision' }> | undefined
              const isActive = i === activeTab
              return (
                <button
                  key={i}
                  onClick={() => selectTab(i)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                    isActive ? 'border-brand-green bg-brand-green text-white' : 'border-border bg-card hover:border-brand-gold'
                  }`}
                >
                  {decision && (
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-brand-green/10 text-brand-green'}`} dir="ltr">
                      {decision.id}
                    </span>
                  )}
                  {tocLabel(s.heading.anchor, s.heading.text)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* مقدمة الصفحة (ثابتة فوق كل التبويبات) */}
        {parsed.preamble.length > 0 && (
          <div className="mb-8">
            <BlockList blocks={parsed.preamble} />
          </div>
        )}

        <div ref={contentTopRef} className="scroll-mt-32" />
        {active && <BlockList blocks={[active.heading, ...active.blocks]} flowStart={parsed.offsets[activeTab]} />}

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
      </div>

      {/* تذييل بسيط */}
      <footer className="border-t border-border bg-brand-green-dark py-6 text-center text-sm text-white/70">
        شركة أريج لماكينات وخدمات الطباعة — الدليل التفصيلي لتنفيذ نظام ERP · مستند Business Requirements & Operational Blueprint V 1.0
      </footer>
    </div>
  )
}
