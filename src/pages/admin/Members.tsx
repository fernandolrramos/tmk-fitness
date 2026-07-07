import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { planById, plans } from '@/data/plans'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Field, inputClass } from '@/components/ui/Field'
import type { MemberRecord, MemberStatus } from '@/types'

const STATUSES: MemberStatus[] = ['active', 'frozen', 'expired']

interface Draft {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  planId: string
  status: MemberStatus
}

function blankDraft(): Draft {
  return {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    planId: plans[0].id,
    status: 'active',
  }
}

export function AdminMembers() {
  const { t, tc, lang } = useLanguage()
  const { members, upsertMember, deleteMember } = useAdminData()

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all')
  const [editing, setEditing] = useState<Draft | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      if (!q) return true
      return (
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
      )
    })
  }, [members, query, statusFilter])

  function joinedLabel(iso: string): string {
    return new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
      year: 'numeric',
      month: 'short',
    }).format(new Date(iso))
  }

  function openEdit(m: MemberRecord) {
    setEditing({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone,
      planId: m.planId,
      status: m.status,
    })
  }

  function save() {
    if (!editing) return
    const existing = members.find((m) => m.id === editing.id)
    const record: MemberRecord = existing
      ? { ...existing, ...editing }
      : {
          ...editing,
          id: `m-${Date.now()}`,
          dialCode: '+47',
          joined: new Date().toISOString().slice(0, 10),
          sessionsThisMonth: 0,
          sessionsGoal: 12,
          avatar: 'from-primary to-accent-teal',
        }
    upsertMember(record)
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
            {t('admin.mb.title')}
          </h2>
          <p className="mt-1 text-slate-500">{t('admin.mb.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blankDraft())}
          className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white"
        >
          {t('admin.mb.add')}
        </button>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.mb.search')}
          className={inputClass}
        />
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {(['all', ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-xl px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 text-slate-500'
              }`}
            >
              {s === 'all' ? t('common.all') : t(`status.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-400">
        {filtered.length} {t('admin.mb.count')}
      </p>

      {/* Member list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="tmk-card p-6 text-center text-sm text-slate-400">
            {t('admin.mb.none')}
          </div>
        )}
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="tmk-card flex items-center gap-3 p-3"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${m.avatar} font-heading text-sm font-bold uppercase text-white`}
            >
              {m.firstName[0]}
              {m.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight text-secondary">
                {m.firstName} {m.lastName}
              </p>
              <p className="break-all text-xs leading-tight text-slate-400" title={m.email}>
                {m.email}
              </p>
              <div className="mt-1 flex items-center gap-2 sm:hidden">
                <StatusBadge status={m.status} />
                <span className="truncate text-xs text-slate-400">
                  {tc(planById(m.planId).name)}
                </span>
              </div>
            </div>
            <div className="hidden min-w-0 flex-1 sm:block">
              <p className="truncate text-sm text-secondary">
                {tc(planById(m.planId).name)}
              </p>
              <p className="text-xs text-slate-400">
                {t('admin.mb.joined')} {joinedLabel(m.joined)}
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <StatusBadge status={m.status} />
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => openEdit(m)}
                aria-label={t('admin.mb.edit')}
                title={t('admin.mb.edit')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteMember(m.id)}
                aria-label={t('admin.mb.delete')}
                title={t('admin.mb.delete')}
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
        title={editing?.id ? t('admin.mb.edit') : t('admin.mb.new')}
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
              className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white"
            >
              {t('common.save')}
            </button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('admin.mb.firstName')}>
                <input
                  className={inputClass}
                  value={editing.firstName}
                  onChange={(e) =>
                    setEditing({ ...editing, firstName: e.target.value })
                  }
                />
              </Field>
              <Field label={t('admin.mb.lastName')}>
                <input
                  className={inputClass}
                  value={editing.lastName}
                  onChange={(e) =>
                    setEditing({ ...editing, lastName: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label={t('admin.mb.email')}>
              <input
                type="email"
                className={inputClass}
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </Field>
            <Field label={t('admin.mb.phone')}>
              <input
                className={inputClass}
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
            </Field>
            <Field label={t('admin.mb.plan')}>
              <select
                className={inputClass}
                value={editing.planId}
                onChange={(e) => setEditing({ ...editing, planId: e.target.value })}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {tc(p.name)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.mb.status')}>
              <select
                className={inputClass}
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as MemberStatus })
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`status.${s}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
