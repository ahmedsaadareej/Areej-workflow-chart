import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'

export default function MoreButton({ to, label = 'اعرف المزيد', dark = false }: { to: string; label?: string; dark?: boolean }) {
  return (
    <div className="mt-10 text-center">
      <Link
        to={to}
        className={`inline-flex items-center gap-2 rounded-xl px-7 py-3 font-black transition-all hover:-translate-y-0.5 hover:shadow-lg ${
          dark
            ? 'bg-brand-gold text-brand-green-dark hover:bg-brand-gold/90'
            : 'bg-brand-green text-white hover:bg-brand-green-dark'
        }`}
      >
        {label}
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </div>
  )
}
