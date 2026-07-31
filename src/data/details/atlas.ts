import type { Block, DetailPageData, FlowStep } from './types'
import { detailPagesList } from './index'

// أطلس المخططات — مشتق من بيانات صفحات الدليل نفسها (مصدر واحد للحقيقة، بلا تكرار محتوى)

export interface AtlasFlow {
  flowIndex: number // ترتيب المخطط داخل صفحته — يطابق مرساة flow-N في صفحة الدليل
  page: DetailPageData
  title?: string
  steps: FlowStep[]
}

export const atlasFlows: AtlasFlow[] = detailPagesList.flatMap((page) => {
  let i = 0
  return page.blocks.flatMap((b) =>
    b.type === 'flow' ? [{ flowIndex: i++, page, title: b.title, steps: b.steps }] : [],
  )
})

export type FormulaBlock = Extract<Block, { type: 'formula' }>

export const atlasFormulas: { page: DetailPageData; block: FormulaBlock }[] = detailPagesList.flatMap((page) =>
  page.blocks.flatMap((b) => (b.type === 'formula' ? [{ page, block: b }] : [])),
)

// الأقسام التي تحتوي مخططات فعلاً — تظهر في شريط الفلاتر
export const atlasSections: { page: DetailPageData; count: number }[] = detailPagesList
  .map((page) => ({ page, count: page.blocks.filter((b) => b.type === 'flow').length }))
  .filter((s) => s.count > 0)
