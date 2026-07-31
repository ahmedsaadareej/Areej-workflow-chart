import type { DetailPageData } from './types'
import { businessMapPage, rulesPage, govPage } from './core'
import { crmPage, afterPage, creditPage } from './sales'
import { supplyPage, hrPage, rolesPage } from './ops'
import { prodPage, designPage, planPage } from './production'
import { uatPage, backlogPage } from './impl'

export type { DetailPageData, Block, FlowStep } from './types'

// ترتيب العرض في صفحة الدليل والتنقل بين الصفحات
export const detailPagesList: DetailPageData[] = [
  businessMapPage,
  rulesPage,
  govPage,
  crmPage,
  afterPage,
  creditPage,
  supplyPage,
  hrPage,
  prodPage,
  designPage,
  planPage,
  rolesPage,
  uatPage,
  backlogPage,
]

export const detailPagesBySlug: Record<string, DetailPageData> = Object.fromEntries(
  detailPagesList.map((p) => [p.slug, p]),
)
