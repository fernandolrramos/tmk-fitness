import type { ActivityEvent, Badge, Challenge, StreakInfo } from '@/types'

/** The demo member's gym buddies (subset of memberRecords). */
export const buddyIds = ['m-jonas', 'm-ingrid', 'm-erik', 'm-thea', 'm-henrik', 'm-ole']

/** Sara's current streak. */
export const streak: StreakInfo = {
  current: 3,
  best: 6,
  // Mon…Sun — trained Mon/Tue/Thu/Sat so far this week
  week: [true, true, false, true, false, true, false],
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

/** Achievement badges for the demo member. */
export const badges: Badge[] = [
  {
    id: 'b-first',
    name: { no: 'Første økt', en: 'First session' },
    description: { no: 'Du er i gang!', en: "You're underway!" },
    icon: 'Sparkles',
    earned: true,
  },
  {
    id: 'b-early',
    name: { no: 'Tidligfugl', en: 'Early bird' },
    description: {
      no: '5 morgentimer fullført',
      en: '5 morning classes completed',
    },
    icon: 'Sunrise',
    earned: true,
  },
  {
    id: 'b-streak',
    name: { no: 'Trofast', en: 'Consistent' },
    description: { no: '3 uker på rad', en: '3 weeks in a row' },
    icon: 'Flame',
    earned: true,
  },
  {
    id: 'b-social',
    name: { no: 'Heiagjeng', en: 'Cheerleader' },
    description: { no: 'Heiet på 10 venner', en: 'Cheered 10 friends' },
    icon: 'HandHeart',
    earned: true,
  },
  {
    id: 'b-25',
    name: { no: '25 økter', en: '25 sessions' },
    description: { no: 'Kvart hundre unnagjort', en: 'A quarter-century done' },
    icon: 'Medal',
    earned: false,
    progress: { value: 12, target: 25 },
  },
  {
    id: 'b-spin',
    name: { no: 'Spinnkonge', en: 'Spin royalty' },
    description: { no: '15 spinningtimer', en: '15 spin classes' },
    icon: 'Bike',
    earned: false,
    progress: { value: 8, target: 15 },
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
