import { BadgeCheck, FileText, CalendarDays, ShieldCheck } from 'lucide-react'
import { meta } from '@/data/workflow'

export default function Footer() {
  return (
    <footer className="bg-brand-green-dark text-white">
      {/* Approval statement */}
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-green-dark">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-brand-gold">بيان الاعتماد الرسمي</p>
              <p className="leading-relaxed text-white/90">
                يُعتمد هذا المستند لدورات وقواعد العمل من D 01 إلى D 36 بكامل التعديلات المتفق
                عليها حتى 30 يوليو 2026، ويُعمل به اعتباراً من تاريخ الاعتماد، وتُلغى كل ما
                يتعارض معه من ممارسات سابقة.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
                  الحالة: {meta.status}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-brand-gold" />
                  {meta.docCode}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-gold" />
                  {meta.date} — {meta.version}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="شعار أريج" className="h-9 w-9 rounded-full ring-1 ring-brand-gold/60 object-contain bg-white/90" />
            <div>
              <p className="text-sm font-bold">{meta.company}</p>
              <p className="text-xs text-white/60">{meta.docName}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">
            نسخة عرض تفاعلية من المستند المعتمد — {meta.version} — {meta.date}
          </p>
        </div>
      </div>
    </footer>
  )
}
