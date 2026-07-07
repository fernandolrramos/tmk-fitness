import { motion } from 'framer-motion'
import { useState } from 'react'
import { Flame, HandHeart, Share2, Trophy, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useEngagement, type FeedItem } from '@/context/EngagementContext'
import { ShareSheet } from '@/components/ShareSheet'
import { challenge, streak } from '@/data/social'
import { memberRecords } from '@/data/members'
import { classById } from '@/data/classes'
import { leaderboard } from '@/lib/social'
import { formatAgo } from '@/lib/dates'
import { Avatar, AvatarStack } from '@/components/ui/Avatar'

const memberById = (id: string) => memberRecords.find((m) => m.id === id)

export function Community() {
  const { t, tc, lang } = useLanguage()
  const { member: authMember } = useAuth()
  const {
    feed,
    cheer,
    challengeJoined,
    joinChallenge,
    yourContribution,
    challengeCurrent,
    challengeParticipants,
  } = useEngagement()

  const [shareOpen, setShareOpen] = useState(false)
  const shareText =
    lang === 'no'
      ? `Jeg er på en ${streak.current}-ukers treningsstreak hos TMK Fitness!`
      : `I'm on a ${streak.current}-week training streak at TMK Fitness!`

  const board = leaderboard()
  const you = board.find((r) => r.isYou)
  const topRows = board.slice(0, 5)
  const challengePct = Math.min(100, Math.round((challengeCurrent / challenge.goal) * 100))
  const remaining = Math.max(0, challenge.goal - challengeCurrent)
  const participants = challenge.participantIds
    .map(memberById)
    .filter((m): m is NonNullable<typeof m> => !!m)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <div>
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
          {t('community.title')}
        </h2>
        <p className="text-sm text-slate-500">{t('community.subtitle')}</p>
      </div>

      {/* Streak */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-accent-pink to-primary p-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
              {t('streak.title')}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-bold">{streak.current}</span>
              <span className="text-sm text-white/85">
                {t(streak.current === 1 ? 'streak.week' : 'streak.weeks')}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label={t('share.title')}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 transition-colors hover:bg-white/25"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Flame className="h-8 w-8" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {streak.week.map((active, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : 'bg-white/25'}`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">
            {t('streak.best')}: {streak.best}{' '}
            {t(streak.best === 1 ? 'streak.week' : 'streak.weeks')}
          </span>
        </div>
        <p className="mt-3 text-xs text-white/80">{t('streak.keepGoing')}</p>
      </section>

      {/* Monthly challenge */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Trophy className="h-4 w-4" />
          {t('challenge.section')}
        </h3>
        <div className="tmk-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading text-xl font-bold uppercase text-secondary">
                {tc(challenge.title)}
              </p>
              <p className="mt-1 text-sm text-slate-500">{tc(challenge.description)}</p>
            </div>
          </div>

          {/* Collective progress */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-primary">
                {challengeCurrent}
                <span className="text-sm font-medium text-slate-400">
                  {' '}
                  / {challenge.goal} {tc(challenge.unit)}
                </span>
              </span>
              <span className="text-xs font-medium text-accent-pink">
                {remaining} {t('challenge.toGoal')}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${challengePct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AvatarStack members={participants} max={4} />
              <span className="text-xs text-slate-500">
                {challengeParticipants} {t('challenge.participants')}
              </span>
            </div>
            {challengeJoined ? (
              <span className="tmk-chip bg-primary/10 text-primary">
                <HandHeart className="h-3.5 w-3.5" />
                {t('challenge.your')}: {yourContribution}
              </span>
            ) : (
              <button
                type="button"
                onClick={joinChallenge}
                className="rounded-xl bg-primary px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide text-white"
              >
                {t('challenge.join')}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Trophy className="h-4 w-4" />
          {t('leaderboard.title')}
        </h3>
        <div className="tmk-card divide-y divide-slate-100 p-1">
          {topRows.map((row) => (
            <div
              key={row.member.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                row.isYou ? 'bg-primary/5' : ''
              }`}
            >
              <span
                className={`w-6 text-center font-heading text-lg font-bold ${
                  row.rank === 1
                    ? 'text-accent-pink'
                    : row.rank <= 3
                      ? 'text-primary'
                      : 'text-slate-300'
                }`}
              >
                {row.rank}
              </span>
              <Avatar
                member={row.isYou ? { ...row.member, photo: authMember.photo } : row.member}
                size="sm"
              />
              <span className="min-w-0 flex-1 truncate font-medium text-secondary">
                {row.member.firstName} {row.member.lastName[0]}.
                {row.isYou && (
                  <span className="ml-1 text-xs text-primary">({t('leaderboard.you')})</span>
                )}
              </span>
              <span className="font-heading font-bold text-secondary">
                {row.member.sessionsThisMonth}
                <span className="ml-1 text-xs font-normal text-slate-400">
                  {t('leaderboard.sessions')}
                </span>
              </span>
            </div>
          ))}
          {you && you.rank > 5 && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-3 py-2.5">
              <span className="w-6 text-center font-heading text-lg font-bold text-primary">
                {you.rank}
              </span>
              <Avatar member={{ ...you.member, photo: authMember.photo }} size="sm" />
              <span className="min-w-0 flex-1 truncate font-medium text-secondary">
                {t('leaderboard.you')}
              </span>
              <span className="font-heading font-bold text-secondary">
                {you.member.sessionsThisMonth}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Activity feed */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Users className="h-4 w-4" />
          {t('feed.title')}
        </h3>
        <div className="space-y-2">
          {feed.map((item, i) => (
            <FeedRow key={item.id} item={item} index={i} onCheer={() => cheer(item.id)} />
          ))}
        </div>
      </section>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} text={shareText} />
    </motion.div>
  )
}

function FeedRow({
  item,
  index,
  onCheer,
}: {
  item: FeedItem
  index: number
  onCheer: () => void
}) {
  const { t, tc, lang } = useLanguage()
  const member = memberById(item.memberId)
  if (!member) return null

  let text = ''
  if (item.type === 'booked' && item.classId) {
    text = `${t('feed.booked')} ${tc(classById(item.classId).name)}`
  } else if (item.type === 'checkin' && item.classId) {
    text = `${t('feed.checkin')} ${tc(classById(item.classId).name)}`
  } else if (item.detail) {
    text = tc(item.detail)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="tmk-card flex items-center gap-3 p-3"
    >
      <Avatar member={member} size="md" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight text-secondary">
          <span className="font-semibold">{member.firstName}</span> {text}
        </p>
        <p className="text-xs text-slate-400">{formatAgo(item.minutesAgo, lang)}</p>
      </div>
      <button
        type="button"
        onClick={onCheer}
        aria-label={t('feed.cheer')}
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wide transition-colors ${
          item.cheeredByMe
            ? 'bg-accent-pink text-white'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        <Flame className={`h-3.5 w-3.5 ${item.cheeredByMe ? 'fill-current' : ''}`} />
        {item.cheers}
      </button>
    </motion.div>
  )
}
