import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { Modal } from '@/components/ui/Modal'
import { Field, inputClass } from '@/components/ui/Field'
import { Avatar } from '@/components/ui/Avatar'
import type { Trainer } from '@/types'

const GRADIENTS = [
  'from-primary to-accent-teal',
  'from-accent-pink to-primary',
  'from-accent-teal to-accent-pink',
  'from-secondary to-primary',
  'from-primary-light to-accent-teal',
]

interface Draft {
  id: string
  name: string
  role: string
  specialties: string
  bio: string
  contactable: boolean
}

function blankDraft(): Draft {
  return { id: '', name: '', role: '', specialties: '', bio: '', contactable: true }
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

export function AdminTrainers() {
  const { t, tc } = useLanguage()
  const { trainers, upsertTrainer, deleteTrainer } = useAdminData()
  const [editing, setEditing] = useState<Draft | null>(null)

  const openEdit = (tr: Trainer) =>
    setEditing({
      id: tr.id,
      name: tr.name,
      role: tc(tr.role),
      specialties: tc(tr.specialties),
      bio: tc(tr.bio),
      contactable: tr.contactable !== false,
    })

  const save = () => {
    if (!editing || !editing.name.trim()) return
    const existing = trainers.find((tr) => tr.id === editing.id)
    const record: Trainer = {
      id: editing.id || `tr-${Date.now()}`,
      name: editing.name.trim(),
      initials: initialsOf(editing.name),
      role: { no: editing.role, en: editing.role },
      specialties: { no: editing.specialties, en: editing.specialties },
      bio: { no: editing.bio, en: editing.bio },
      avatar: existing?.avatar ?? GRADIENTS[trainers.length % GRADIENTS.length],
      contactable: editing.contactable,
    }
    upsertTrainer(record)
    setEditing(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-secondary md:text-3xl">
            {t('admin.tr.title')}
          </h2>
          <p className="mt-1 text-slate-500">{t('admin.tr.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blankDraft())}
          className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white"
        >
          {t('admin.tr.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {trainers.map((tr, i) => (
          <motion.div
            key={tr.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="tmk-card flex items-center gap-3 p-4"
          >
            <Avatar
              member={{
                firstName: tr.name.split(' ')[0] || '?',
                lastName: tr.name.split(' ').slice(-1)[0] || '',
                avatar: tr.avatar,
              }}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="font-heading font-semibold uppercase leading-tight tracking-wide text-secondary">
                {tr.name}
              </p>
              <p className="truncate text-xs text-slate-500">{tc(tr.role)}</p>
              {tr.contactable === false && (
                <span className="tmk-chip mt-1 bg-slate-200 text-slate-500">
                  {t('admin.tr.notContactable')}
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => openEdit(tr)}
                aria-label={t('admin.tr.edit')}
                title={t('admin.tr.edit')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteTrainer(tr.id)}
                aria-label={t('admin.tr.delete')}
                title={t('admin.tr.delete')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-accent-pink"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? t('admin.tr.edit') : t('admin.tr.new')}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-slate-600"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!editing?.name.trim()}
              className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white transition-opacity disabled:opacity-40"
            >
              {t('common.save')}
            </button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <Field label={t('admin.tr.name')}>
              <input
                className={inputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label={t('admin.tr.role')}>
              <input
                className={inputClass}
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              />
            </Field>
            <Field label={t('admin.tr.specialties')}>
              <input
                className={inputClass}
                value={editing.specialties}
                onChange={(e) => setEditing({ ...editing, specialties: e.target.value })}
              />
            </Field>
            <Field label={t('admin.tr.bio')}>
              <textarea
                rows={3}
                className={inputClass}
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-secondary">
              <input
                type="checkbox"
                checked={editing.contactable}
                onChange={(e) => setEditing({ ...editing, contactable: e.target.checked })}
              />
              {t('admin.tr.contactable')}
            </label>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
