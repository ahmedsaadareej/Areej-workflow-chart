import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BookOpenText, Menu, X } from 'lucide-react';

const links = [
  { href: '#map', label: 'الخريطة الرئيسية' },
  { href: '#decisions', label: 'القرارات المعتمدة' },
  { href: '#principles', label: 'المبادئ الحاكمة' },
  { href: '#roles', label: 'المسؤوليات' },
  { href: '#glossary', label: 'المسرد' },
  { href: '#tests', label: 'حزم الاختبار' },
  { href: '#future', label: 'الموضوعات المستقبلية' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-green-dark/95 backdrop-blur shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.png" alt="شعار أريج" className="w-11 h-11 rounded-full ring-2 ring-brand-gold/70 object-cover bg-white" />
          <div className="leading-tight">
            <div className="text-white font-extrabold text-lg">أريج</div>
            <div className="text-brand-gold text-xs font-semibold">دورة العمل العامة V 1.1</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-brand-gold text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/details"
            className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-brand-gold px-3.5 py-2 text-sm font-black text-brand-green-dark transition-colors hover:bg-brand-gold/90"
          >
            <BookOpenText className="w-4 h-4" />
            الدليل التفصيلي
          </Link>
        </nav>

        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden bg-brand-green-dark/98 backdrop-blur border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-brand-gold font-semibold px-3 py-2.5 rounded-lg hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/details"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gold px-3 py-2.5 font-black text-brand-green-dark"
          >
            <BookOpenText className="w-4 h-4" />
            الدليل التفصيلي
          </Link>
        </nav>
      )}
    </header>
  );
}
