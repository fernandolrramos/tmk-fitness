import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { classById, classes } from '@/data/classes'
import { Modal } from '@/components/ui/Modal'
import { Field, inputClass } from '@/components/ui/Field'
import { formatWeekdayShort, upcomingDays } from '@/lib/dates'
import type { Session } from '@/types'

const INSTRUCTORS = ['Knut Martin', 'Michel', 'Jeanett']

/** Map our weekday (0=Mon..6=Sun) to a representative Date for label formatting. */
function weekdayLabels(lang: 'no' | 'en'): { weekday: number; label: string }[] {
  const days = upcomingDays(7)
  const out: { weekday: number; label: string }[] = []
  for (let weekday = 0; weekday < 7; weekday++) {
    const jsDay = (weekday + 1) % 7
    const date = days.find((d) => d.getDay() === jsDay) ?? days[0]
    out.push({ weekday, label: formatWeekdayShort(date, lang) })
  }
  return out
}

interface Draft {
  id: string
  classId: string
  weekday: number
  start: string
  end: string
  instructor: string
  capacity: number
  freeForMembers: boolean
}

function blankDraft(weekday: number): Draft {
  return {
    id: '',
    classId: '', // force an explicit choice — no pre-filled class
    weekday,
    start: '18:00',
    end: '19:00',
    instructor: '', // force an explicit choice — no pre-filled instructor
    capacity: 20,
    freeForMembers: false,
  }
}

export function AdminTimetable() {
  const { t, tc, lang } = useLanguage()
  const { sessions, upsertSession, deleteSession } = useAdminData()

  const todayWeekday = (new Date().getDay() + 6) % 7
  const [selected, setSelected] = useState(todayWeekday)
  const [editing, setEditing] = useState<Draft | null>(null)

  const labels = useMemo(() => weekdayLabels(lang), [lang])

  const rows = useMemo(
    () =>
      sessions
        .filter((s) => s.weekday === selected)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [sessions, selected],
  )

  function openNew() {
    setEditing(blankDraft(selected))
  }

  function openEdit(s: Session) {
    setEditing({
      id: s.id,
      classId: s.classId,
      weekday: s.weekday,
      start: s.start,
      end: s.end,
      instructor: s.instructor,
      capacity: s.capacity,
      freeForMembers: !!s.freeForMembers,
    })
  }

  function save() {
    if (!editing || !editing.classId || !editing.instructor) return
    const id = editing.id || `s-${Date.now()}`
    const existing = sessions.find((s) => s.id === id)
    const session: Session = {
      id,
      classId: editing.classId,
      weekday: editing.weekday,
      start: editing.start,
      end: editing.end,
      instructor: editing.instructor,
      capacity: editing.capacity,
      spotsLeft: existing ? existing.spotsLeft : editing.capacity,
      freeForMembers: editing.freeForMembers,
    }
    upsertSession(session)
    setEditing(null)
    setSelected(editing.weekday)
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
            {t('admin.tt.title')}
          </h2>
          <p className="mt-1 text-slate-500">{t('admin.tt.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white"
        >
          {t('admin.tt.add')}
        </button>
      </div>

      {/* Weekday selector */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {labels.map((d) => (
          <button
            key={d.weekday}
            type="button"
            onClick={() => setSelected(d.weekday)}
            className={`shrink-0 rounded-xl px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
              selected === d.weekday
                ? 'bg-primary text-white'
                : 'border border-slate-200 text-slate-500'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Sessions */}
      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="tmk-card p-6 text-center text-sm text-slate-400">
            {t('admin.tt.empty')}
          </div>
        )}
        {rows.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="tmk-card flex items-center gap-3 p-4"
          >
            <div className="w-14 shrink-0 font-heading text-lg font-bold leading-tight text-secondary">
              {s.start}
              <span className="block text-xs font-normal text-slate-400">{s.end}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight text-secondary">
                {tc(classById(s.classId).name)}
              </p>
              <p className="truncate text-xs text-slate-400">
                {s.instructor} · {s.capacity} {t('admin.tt.capacity').toLowerCase()}
              </p>
              {s.freeForMembers && (
                <span className="tmk-chip mt-1 bg-accent-teal/15 text-primary">
                  {t('admin.tt.free')}
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => openEdit(s)}
                aria-label={t('admin.tt.edit')}
                title={t('admin.tt.edit')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteSession(s.id)}
                aria-label={t('admin.tt.delete')}
                title={t('admin.tt.delete')}
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
        title={editing?.id ? t('admin.tt.edit') : t('admin.tt.new')}
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
              disabled={!editing?.classId || !editing?.instructor}
              className="rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold uppercase tracking-wide text-white transition-opacity disabled:opacity-40"
            >
              {t('common.save')}
            </button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <Field label={t('admin.tt.class')}>
              <select
                className={inputClass}
                value={editing.classId}
                onChange={(e) => setEditing({ ...editing, classId: e.target.value })}
              >
                <option value="" disabled>
                  {t('admin.tt.chooseClass')}
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {tc(c.name)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.tt.day')}>
              <select
                className={inputClass}
                value={editing.weekday}
                onChange={(e) =>
                  setEditing({ ...editing, weekday: Number(e.target.value) })
                }
              >
                {labels.map((d) => (
                  <option key={d.weekday} value={d.weekday}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('admin.tt.start')}>
                <input
                  type="time"
                  className={inputClass}
                  value={editing.start}
                  onChange={(e) => setEditing({ ...editing, start: e.target.value })}
                />
              </Field>
              <Field label={t('admin.tt.end')}>
                <input
                  type="time"
                  className={inputClass}
                  value={editing.end}
                  onChange={(e) => setEditing({ ...editing, end: e.target.value })}
                />
              </Field>
            </div>
            <Field label={t('admin.tt.instructor')}>
              <select
                className={inputClass}
                value={editing.instructor}
                onChange={(e) =>
                  setEditing({ ...editing, instructor: e.target.value })
                }
              >
                <option value="" disabled>
                  {t('admin.tt.chooseInstructor')}
                </option>
                {INSTRUCTORS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.tt.capacity')}>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={editing.capacity}
                onChange={(e) =>
                  setEditing({ ...editing, capacity: Number(e.target.value) })
                }
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-secondary">
              <input
                type="checkbox"
                checked={editing.freeForMembers}
                onChange={(e) =>
                  setEditing({ ...editing, freeForMembers: e.target.checked })
                }
              />
              {t('admin.tt.free')}
            </label>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
