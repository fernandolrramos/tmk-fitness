import type { ActivityEvent, Challenge, Localized } from '@/types'

/** The demo member's gym buddies (subset of memberRecords). */
export const buddyIds = ['m-jonas', 'm-ingrid', 'm-erik', 'm-thea', 'm-henrik', 'm-ole']

/** What real metric a badge tracks. Progress/earned are computed live. */
export type BadgeMetric = 'firstSession' | 'sessions' | 'streak' | 'morning' | 'spin' | 'cheers'

export interface BadgeDef {
  id: string
  name: Localized
  description: Localized
  /** lucide icon name. */
  icon: string
  metric: BadgeMetric
  target: number
}

/** The live gym-wide challenge everyone contributes to. */
export const challenge: Challenge = {
  id: 'ch-july',
  title: {
    no: 'Sammen mot 500 økter',
    en: 'Together to 500 sessions',
  },
  description: {
    no: 'Hele TMK-familien samler økter denne måneden. Hver time teller!',
    en: 'The whole TMK family stacks up sessions this month. Every class counts!',
  },
  unit: { no: 'økter', en: 'sessions' },
  goal: 500,
  current: 342,
  endsInDays: 12,
  // Note: the demo member is added dynamically when they tap "Join".
  participantIds: [
    'm-jonas',
    'm-ingrid',
    'm-erik',
    'm-thea',
    'm-henrik',
    'm-ole',
    'm-lars',
    'm-daniel',
    'm-selma',
  ],
}

/**
 * Achievement badge definitions. `earned`/`progress` are computed live in
 * EngagementContext from real data (check-ins, streak, cheers given).
 */
export const badgeDefs: BadgeDef[] = [
  {
    id: 'b-first',
    name: { no: 'Første økt', en: 'First session' },
    description: { no: 'Du er i gang!', en: "You're underway!" },
    icon: 'Sparkles',
    metric: 'firstSession',
    target: 1,
  },
  {
    id: 'b-early',
    name: { no: 'Tidligfugl', en: 'Early bird' },
    description: { no: '5 morgentimer', en: '5 morning classes' },
    icon: 'Sunrise',
    metric: 'morning',
    target: 5,
  },
  {
    id: 'b-streak',
    name: { no: 'Trofast', en: 'Consistent' },
    description: { no: '3 uker på rad', en: '3 weeks in a row' },
    icon: 'Flame',
    metric: 'streak',
    target: 3,
  },
  {
    id: 'b-social',
    name: { no: 'Heiagjeng', en: 'Cheerleader' },
    description: { no: 'Heiet på 5 venner', en: 'Cheered 5 friends' },
    icon: 'HandHeart',
    metric: 'cheers',
    target: 5,
  },
  {
    id: 'b-25',
    name: { no: '25 økter', en: '25 sessions' },
    description: { no: 'Kvart hundre unnagjort', en: 'A quarter-century done' },
    icon: 'Medal',
    metric: 'sessions',
    target: 25,
  },
  {
    id: 'b-spin',
    name: { no: 'Spinnkonge', en: 'Spin royalty' },
    description: { no: '15 spinningtimer', en: '15 spin classes' },
    icon: 'Bike',
    metric: 'spin',
    target: 15,
  },
]

/**
 * Seed activity feed. `minutesAgo` is used to render relative timestamps.
 * Ordered newest-first.
 */
export const activityFeed: ActivityEvent[] = [
  {
    id: 'a1',
    memberId: 'm-jonas',
    type: 'booked',
    classId: 'spinning',
    minutesAgo: 18,
    cheers: 4,
  },
  {
    id: 'a2',
    memberId: 'm-ingrid',
    type: 'milestone',
    detail: { no: 'nådde 18 økter denne måneden', en: 'hit 18 sessions this month' },
    minutesAgo: 55,
    cheers: 11,
  },
  {
    id: 'a3',
    memberId: 'm-erik',
    type: 'checkin',
    classId: 'spinning',
    minutesAgo: 130,
    cheers: 6,
  },
  {
    id: 'a4',
    memberId: 'm-henrik',
    type: 'streak',
    detail: { no: 'er på en 7-ukers streak', en: 'is on a 7-week streak' },
    minutesAgo: 240,
    cheers: 9,
  },
  {
    id: 'a5',
    memberId: 'm-thea',
    type: 'checkin',
    classId: 'senior',
    minutesAgo: 300,
    cheers: 3,
  },
  {
    id: 'a6',
    memberId: 'm-ole',
    type: 'pr',
    detail: {
      no: 'satte ny personlig rekord i markløft',
      en: 'set a new deadlift PR',
    },
    minutesAgo: 420,
    cheers: 14,
  },
  {
    id: 'a7',
    memberId: 'm-jonas',
    type: 'challenge',
    detail: {
      no: 'ble med i «Sammen mot 500 økter»',
      en: 'joined “Together to 500 sessions”',
    },
    minutesAgo: 600,
    cheers: 5,
  },
]

/** A simple referral code for the demo member. */
export const referralCode = 'SARA-TMK'
