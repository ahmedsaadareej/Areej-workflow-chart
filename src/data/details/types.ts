// أنواع بيانات صفحات «الدليل التفصيلي» — مستند Business Requirements & Operational Blueprint V 1.0

export type FlowKind = 'start' | 'step' | 'gate' | 'decision' | 'doc' | 'end'

export interface FlowStep {
  label: string
  note?: string
  kind?: FlowKind
}

export type Block =
  | { type: 'intro'; text: string }
  | { type: 'heading'; text: string; sub?: string; anchor?: string }
  | { type: 'bullets'; items: string[]; tone?: 'check' | 'warn' | 'info' }
  | { type: 'rules'; items: { title: string; text: string }[] }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'flow'; title?: string; steps: FlowStep[] }
  | { type: 'fitgap'; title?: string; rows: { need: string; standard: string; custom: string }[] }
  | { type: 'formula'; title?: string; lines: string[]; note?: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; title?: string; text: string }
  | {
      type: 'decision'
      id: string // مثل: D 01
      title: string
      rule?: string
      path?: string
      controls?: string
      erpnext?: string
    }

export interface DetailPageData {
  slug: string
  icon: string
  title: string
  subtitle: string
  docRefs: string[]
  decisions?: string[]
  toc: { id: string; label: string }[]
  blocks: Block[]
}
