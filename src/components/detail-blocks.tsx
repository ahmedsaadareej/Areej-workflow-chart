import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  FileText,
  Flag,
  GitBranch,
  Info,
  ListChecks,
  ShieldCheck,
  Sigma,
} from 'lucide-react'
import type { Block, FlowStep } from '../data/details/types'

// ---------- المخطط التدفقي الرأسي ----------
const kindStyles: Record<string, { box: string; badge: string; icon: typeof Flag }> = {
  start: { box: 'bg-brand-green text-white border-brand-green', badge: 'bg-white/20 text-white', icon: Flag },
  end: { box: 'bg-brand-green-dark text-white border-brand-green-dark', badge: 'bg-white/20 text-white', icon: CheckCircle2 },
  gate: { box: 'bg-amber-50 border-brand-gold text-amber-950', badge: 'bg-brand-gold/20 text-amber-800', icon: ShieldCheck },
  decision: { box: 'bg-sky-50 border-sky-300 text-sky-950', badge: 'bg-sky-200/60 text-sky-800', icon: GitBranch },
  doc: { box: 'bg-slate-50 border-slate-300 text-slate-700', badge: 'bg-slate-200 text-slate-600', icon: FileText },
  step: { box: 'bg-white border-border text-foreground', badge: 'bg-brand-green/10 text-brand-green', icon: CircleDot },
}

const kindNames: Record<string, string> = {
  start: 'بداية',
  step: 'خطوة',
  gate: 'بوابة اعتماد',
  decision: 'قرار / تفرع',
  doc: 'مستند / سجل',
  end: 'نهاية',
}

function FlowStepCard({ step, index }: { step: FlowStep; index: number }) {
  const style = kindStyles[step.kind ?? 'step']
  const Icon = style.icon
  return (
    <div className={`rounded-xl border-2 px-4 py-3 shadow-sm ${style.box}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${style.badge}`}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold leading-relaxed">{step.label}</p>
            {step.kind && step.kind !== 'step' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold">
                <Icon className="h-3 w-3" />
                {kindNames[step.kind]}
              </span>
            )}
          </div>
          {step.note && <p className="mt-1 text-sm leading-relaxed opacity-80">{step.note}</p>}
        </div>
      </div>
    </div>
  )
}

export function FlowDiagram({ steps, title }: { steps: FlowStep[]; title?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
      {title && (
        <p className="mb-4 flex items-center gap-2 text-sm font-black text-brand-green">
          <ListChecks className="h-4 w-4 text-brand-gold" />
          {title}
        </p>
      )}
      <div className="mx-auto max-w-2xl">
        {steps.map((step, i) => (
          <div key={i}>
            <FlowStepCard step={step} index={i} />
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-5 w-5 text-brand-gold" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- بطاقة قرار ----------
function DecisionCard({ block }: { block: Extract<Block, { type: 'decision' }> }) {
  const anchor = 'd-' + block.id.replace(/\s+/g, '').toLowerCase()
  const rows = [
    { label: 'القاعدة المعتمدة', value: block.rule },
    { label: 'المسار التشغيلي', value: block.path },
    { label: 'الضوابط الرقابية', value: block.controls },
  ].filter((r) => r.value)
  return (
    <div id={anchor} className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-brand-green/5 px-4 py-3 sm:px-6">
        <span className="rounded-lg bg-brand-green px-2.5 py-1 text-sm font-black text-white">{block.id}</span>
        <h3 className="font-black text-brand-green">{block.title}</h3>
      </div>
      <div className="divide-y divide-border/60">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:px-6">
            <span className="text-xs font-black text-brand-gold">{row.label}</span>
            <p className="text-sm leading-relaxed text-foreground/90">{row.value}</p>
          </div>
        ))}
        {block.erpnext && (
          <div className="grid gap-1 bg-sky-50/60 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:px-6">
            <span className="flex items-center gap-1 text-xs font-black text-sky-700">
              <Info className="h-3.5 w-3.5" />
              ترجمة ERPNext
            </span>
            <p className="text-sm leading-relaxed text-sky-950">{block.erpnext}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- جدول Fit-Gap ----------
function FitGapTable({ block }: { block: Extract<Block, { type: 'fitgap' }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {block.title && (
        <p className="border-b border-border bg-brand-green/5 px-4 py-3 font-black text-brand-green sm:px-6">{block.title}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="bg-brand-green text-white">
              <th className="px-4 py-2.5 text-right font-bold">احتياج أريج</th>
              <th className="px-4 py-2.5 text-right font-bold">ERPNext القياسي</th>
              <th className="px-4 py-2.5 text-right font-bold">Custom / تكامل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {block.rows.map((row, i) => (
              <tr key={i} className="align-top odd:bg-muted/30">
                <td className="px-4 py-3 font-bold text-foreground">{row.need}</td>
                <td className="px-4 py-3 leading-relaxed text-foreground/80">{row.standard}</td>
                <td className="px-4 py-3 leading-relaxed text-foreground/80">{row.custom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------- عارض الكتل ----------
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'intro':
      return <p className="text-base font-medium leading-loose text-foreground/90 sm:text-lg">{block.text}</p>

    case 'heading':
      return (
        <div id={block.anchor} className="scroll-mt-28 border-r-4 border-brand-gold pr-4">
          <h2 className="text-xl font-black text-brand-green sm:text-2xl">{block.text}</h2>
          {block.sub && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{block.sub}</p>}
        </div>
      )

    case 'bullets': {
      const tone = block.tone ?? 'check'
      const Icon = tone === 'warn' ? AlertTriangle : tone === 'info' ? Info : CheckCircle2
      const color = tone === 'warn' ? 'text-amber-600' : tone === 'info' ? 'text-sky-600' : 'text-emerald-600'
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-3">
              <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${color}`} />
              <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      )
    }

    case 'rules':
      return (
        <div className="grid gap-3">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 font-black text-brand-green">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-black text-brand-gold">
                  {i + 1}
                </span>
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.text}</p>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {block.caption && (
            <p className="border-b border-border bg-muted/50 px-4 py-2.5 text-sm font-black text-brand-green sm:px-6">
              {block.caption}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-right font-black text-brand-green">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {block.rows.map((row, i) => (
                  <tr key={i} className="align-top odd:bg-muted/20">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3 leading-relaxed ${j === 0 ? 'font-bold text-foreground' : 'text-foreground/80'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'flow':
      return <FlowDiagram steps={block.steps} title={block.title} />

    case 'fitgap':
      return <FitGapTable block={block} />

    case 'formula':
      return (
        <div className="overflow-hidden rounded-2xl border border-brand-green/30 bg-brand-green-dark text-white shadow-sm">
          {block.title && (
            <p className="flex items-center gap-2 border-b border-white/10 px-4 py-3 font-black text-brand-gold sm:px-6">
              <Sigma className="h-4 w-4" />
              {block.title}
            </p>
          )}
          <div className="space-y-2 px-4 py-4 sm:px-6">
            {block.lines.map((line, i) => (
              <p key={i} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold leading-relaxed sm:text-base">
                {line}
              </p>
            ))}
            {block.note && <p className="pt-1 text-xs leading-relaxed text-white/70">{block.note}</p>}
          </div>
        </div>
      )

    case 'callout': {
      const tones = {
        info: { box: 'border-sky-300 bg-sky-50 text-sky-950', icon: Info, iconColor: 'text-sky-600' },
        warn: { box: 'border-amber-300 bg-amber-50 text-amber-950', icon: AlertTriangle, iconColor: 'text-amber-600' },
        success: { box: 'border-emerald-300 bg-emerald-50 text-emerald-950', icon: CheckCircle2, iconColor: 'text-emerald-600' },
      }
      const tone = tones[block.tone]
      const Icon = tone.icon
      return (
        <div className={`rounded-xl border-2 p-4 sm:p-5 ${tone.box}`}>
          <div className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconColor}`} />
            <div>
              {block.title && <p className="mb-1 font-black">{block.title}</p>}
              <p className="text-sm leading-relaxed">{block.text}</p>
            </div>
          </div>
        </div>
      )
    }

    case 'decision':
      return <DecisionCard block={block} />

    default:
      return null
  }
}

export function BlockList({ blocks }: { blocks: Block[] }) {
  let flowOrdinal = 0
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === 'flow') {
          const anchor = `flow-${flowOrdinal++}`
          return (
            <div key={i} id={anchor} className="scroll-mt-28">
              <BlockRenderer block={block} />
            </div>
          )
        }
        return <BlockRenderer key={i} block={block} />
      })}
    </div>
  )
}

export { ChevronLeft }
