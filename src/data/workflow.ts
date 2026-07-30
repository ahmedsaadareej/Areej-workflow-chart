// بيانات مستند «دورة العمل العامة والمتكاملة — V 1.1»
// شركة أريج لماكينات وخدمات الطباعة — 30 يوليو 2026

export interface Decision {
  id: string;
  title: string;
  chapter: string;
  categoryId: string;
  rule: string;
  path: string;
  controls: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  decisions: string[];
}

export interface Principle {
  title: string;
  desc: string;
}

export interface GlossaryTerm {
  term: string;
  meaning: string;
}

export interface WorkflowStep {
  n: number;
  title: string;
  desc: string;
}

export interface TestPackage {
  code: string;
  name: string;
  refs: string;
}

export interface FutureTopic {
  id: string;
  topic: string;
  priority: string;
}

export interface Role {
  role: string;
  duties: string;
}

export const meta = {
  company: 'شركة أريج لماكينات وخدمات الطباعة',
  docName: 'دليل دورة العمل العامة والمتكاملة',
  docCode: 'Areej General Business Workflow',
  version: 'V 1.1',
  date: '30 يوليو 2026',
  scope: 'جميع القرارات المعتمدة D 01 – D 36، مع تسجيل الموضوعات المتبقية D 37 – D 58 دون اعتمادها',
  status: 'Approved through D 36 — Technology Neutral',
};

export const principles: Principle[] = [
  {
    title: 'مصدر واحد للحقيقة',
    desc: 'لكل عميل وطلب وصنف وحركة معدة وملف إنتاج هوية واحدة قابلة للتتبع؛ لا تُنشأ سجلات موازية متعارضة.',
  },
  {
    title: 'فصل الإنشاء عن الاعتماد',
    desc: 'إنشاء مستند أو طلب لا يعني اعتماد أثره؛ الاعتماد يثبت كل أثر مالي أو مخزني في العمليات الحساسة.',
  },
  {
    title: 'لا حذف للتاريخ',
    desc: 'التعديل المؤثر ينشئ نسخة أو حركة عكسية أو إلغاءً موثقاً؛ يُكتب فوق النسخة المعتمدة ولا يُحذف الأثر السابق.',
  },
  {
    title: 'الاستثناء الموثق',
    desc: 'أي تجاوز للسعر أو الموعد أو الحجز أو الائتمان أو أولوية التسليم يحتاج صلاحية وسبباً وتاريخاً.',
  },
  {
    title: 'المسؤولية بالأدلة',
    desc: 'لا يُحمَّل موظف أو مورد أو عميل مسؤولية خسارة قبل حفظ الأدلة وإعادة العد أو الفحص والتحقق والاعتماد.',
  },
  {
    title: 'قابلية النقل',
    desc: 'يمكن تنفيذ الدورة على أي برنامج أو فرع جديد ما دامت تحفظ المستندات والبوابات والصلاحيات والأثر المحاسبي والمخزني.',
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'استفسار / عميل محتمل', meaning: 'أي تواصل وارد قبل وجود التزام تجاري، مبدئياً أو مؤكداً.' },
  { term: 'فرصة بيع', meaning: 'احتياج جاد ومحدد يستحق عرضاً ومتابعة.' },
  { term: 'عرض سعر', meaning: 'عرض رسمي للأسعار والشروط دون أن يعني حجزاً أو تسليماً.' },
  { term: 'أمر بيع / التزام عميل', meaning: 'طلب مؤكد يحتاج تنفيذاً أو توريداً أو تسليماً مستقبلياً.' },
  { term: 'حجز', meaning: 'تخصيص صريح لكمية أو وحدة أو سيريال للعميل، مستقل عن الطلب.' },
  { term: 'فاتورة', meaning: 'إثبات مالي للمبلغ المستحق؛ لا تُستخدم وحدها لإثبات خروج المخزون.' },
  { term: 'إذن تسليم', meaning: 'إثبات خروج البضاعة أو تسليمها فعلياً للعميل أو الناقل.' },
  { term: 'أمر شغل', meaning: 'مظلة تنفيذ خدمة أو إنتاج تربط المواد والعمليات والملفات والكميات والجودة.' },
  { term: 'بطاقة تشغيل', meaning: 'تكلفة عملية محددة لعاملة أو ماكينة مع وقت وكمية ونتيجة.' },
  { term: 'فحص جودة', meaning: 'قرار قبول أو رفض أو إعادة تشغيل مع دليل وكمية وسبب.' },
  { term: 'عهدة', meaning: 'أصل أو نقد أو خامة أو قطعة تُسلَّم لشخص دون انتقال ملكية الشركة الخارجية.' },
];

export const workflowSteps: WorkflowStep[] = [
  { n: 1, title: 'استفسار', desc: 'تسجيل كل تواصل وارد من أي قناة كعميل محتمل (D 03)' },
  { n: 2, title: 'فرصة بيع', desc: 'اهتمام جاد ومحدد يستحق عرضاً ومتابعة (D 06)' },
  { n: 3, title: 'عرض سعر', desc: 'عرض رسمي بالأسعار والشروط، إلزامي للماكينات والتقسيط (D 07)' },
  { n: 4, title: 'أمر بيع', desc: 'التزام مؤكد بعد قبول العرض أو دفع مقدم (D 06 – D 07)' },
  { n: 5, title: 'حجز', desc: 'قرار مستقل صريح — لا حجز تلقائي من العرض أو الأمر (D 12)' },
  { n: 6, title: 'فاتورة', desc: 'تسجّل الجانب المالي فقط ولا تخصم المخزون (D 10 – D 11)' },
  { n: 7, title: 'إذن تسليم', desc: 'إثبات الخروج الفعلي من المخزون بالسيريال والوحدة (D 11)' },
  { n: 8, title: 'تحصيل وائتمان', desc: 'تخصيص الدفعات وسياسات الائتمان والشيكات (D 17 – D 19)' },
  { n: 9, title: 'ما بعد البيع', desc: 'ضمان وصيانة ومرتجعات وعمولات (D 14 – D 16)' },
];

export const designRule =
  'إنشاء المستند لا يعني بالضرورة حجز المخزون أو خصمه؛ لكل أثر مستند واعتماد مستقل: الطلب يسجّل الاحتياج، الحجز قرار مستقل، الفاتورة تسجّل الجانب المالي، وإذن التسليم يسجّل الخروج الفعلي من المخزون.';

export const categories: Category[] = [
  { id: 'gov', name: 'الحوكمة والمالية', icon: '⚖️', decisions: ['D 01', 'D 02', 'D 19', 'D 20', 'D 26', 'D 27', 'D 28'] },
  { id: 'crm', name: 'العملاء والمبيعات', icon: '🤝', decisions: ['D 03', 'D 04', 'D 05', 'D 06', 'D 07', 'D 08', 'D 09', 'D 10', 'D 10A'] },
  { id: 'after', name: 'التسليم والضمان والمرتجعات', icon: '📦', decisions: ['D 11', 'D 12', 'D 13', 'D 14', 'D 15'] },
  { id: 'credit', name: 'العمولات والائتمان والتحصيل', icon: '💰', decisions: ['D 16', 'D 17', 'D 18'] },
  { id: 'supply', name: 'المشتريات والمخازن', icon: '🏬', decisions: ['D 21', 'D 22', 'D 23', 'D 24', 'D 25'] },
  { id: 'hr', name: 'الموارد البشرية', icon: '👥', decisions: ['D 29'] },
  { id: 'prod', name: 'التصنيع والإنتاج', icon: '🖨️', decisions: ['D 30', 'D 31', 'D 32', 'D 33', 'D 34'] },
  { id: 'design', name: 'التصميم والتجهيز الفني', icon: '🎨', decisions: ['D 35'] },
  { id: 'plan', name: 'التخطيط والجدولة', icon: '🗓️', decisions: ['D 36'] },
];
