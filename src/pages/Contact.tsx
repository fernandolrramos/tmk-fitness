import { motion } from 'framer-motion'
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { gymInfo } from '@/data/gymInfo'

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  gymInfo.mapQuery,
)}`

export function Contact() {
  const { t, tc } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
        {t('contact.title')}
      </h2>

      {/* Address */}
      <section className="tmk-card p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <MapPin className="h-4 w-4" />
          {t('contact.address')}
        </h3>
        <p className="mt-1 font-heading text-lg font-semibold text-secondary">
          {gymInfo.name}
        </p>
        <p className="text-sm text-slate-600">{gymInfo.address}</p>
        <p className="text-sm text-slate-600">
          {gymInfo.postcode} {gymInfo.city}
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white"
        >
          <Navigation className="h-4 w-4" />
          {t('contact.directions')}
        </a>
      </section>

      {/* Phone */}
      <section className="tmk-card p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Phone className="h-4 w-4" />
          {t('contact.phone')}
        </h3>
        <div className="mt-2 space-y-1">
          {gymInfo.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="block font-heading text-lg font-semibold text-primary"
            >
              {phone}
            </a>
          ))}
        </div>
      </section>

      {/* Email */}
      <section className="tmk-card p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Mail className="h-4 w-4" />
          {t('contact.email')}
        </h3>
        <a
          href={`mailto:${gymInfo.email}`}
          className="mt-1 block font-heading text-lg font-semibold text-primary"
        >
          {gymInfo.email}
        </a>
      </section>

      {/* Opening hours */}
      <section className="tmk-card p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Clock className="h-4 w-4" />
          {t('contact.hours')}
        </h3>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {gymInfo.hours.map((row) => (
              <tr key={row.hours + tc(row.day)} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 text-slate-600">{tc(row.day)}</td>
                <td className="py-2 text-right font-medium tabular-nums text-secondary">
                  {row.hours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Follow */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('contact.follow')}
        </h3>
        <div className="flex gap-3">
          <a
            href={gymInfo.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-center font-heading text-sm font-semibold uppercase tracking-wide text-white"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
          <a
            href={gymInfo.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-pink to-primary py-3 text-center font-heading text-sm font-semibold uppercase tracking-wide text-white"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </section>
    </motion.div>
  )
}
