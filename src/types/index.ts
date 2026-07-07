/**
 * Shared domain types for the TMK Fitness prototype.
 * The whole app is driven by in-memory seed data of these shapes.
 */

export type Lang = 'no' | 'en'

/** A bilingual string — every piece of seed content carries both languages. */
export interface Localized {
  no: string
  en: string
}

export type ClassCategory =
  | 'spinning'
  | 'treatment'
  | 'solarium'
  | 'pt'
  | 'senior'

/** A class *type* offered by the gym (the catalogue, not a scheduled session). */
export interface GymClass {
  id: string
  category: ClassCategory
  name: Localized
  description: Localized
  /** Tailwind gradient classes used for the card accent. */
  accent: string
}

/** A concrete session on the weekly timetable. */
export interface Session {
  id: string
  classId: string
  /** 0 = Monday … 6 = Sunday (matches getDay()-shifted week we build). */
  weekday: number
  /** "HH:MM" 24h local. */
  start: string
  /** "HH:MM" 24h local. */
  end: string
  instructor: string
  capacity: number
  spotsLeft: number
  freeForMembers?: boolean
}

/** A session materialised onto a real date — what the UI actually books. */
export interface DatedSession extends Session {
  /** ISO date-time of the session start. */
  date: string
}

export interface MembershipPlan {
  id: string
  name: Localized
  price: Localized
  /** Short binding / commitment note. */
  terms: Localized
  featured?: boolean
}

export interface Trainer {
  id: string
  name: string
  role: Localized
  specialties: Localized
  bio: Localized
  /** Initials shown in the avatar placeholder. */
  initials: string
  /** Tailwind gradient for the avatar / chat bubble. */
  avatar: string
  /** Whether members can message this trainer directly. */
  contactable?: boolean
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  /** Optional profile photo as a data URL (uploaded by the member). */
  photo?: string
  phone: string
  /** Dial code stored separately so the picker can round-trip it. */
  dialCode: string
  planId: string
  sessionsThisMonth: number
  sessionsGoal: number
}

/** A booking = the id of a dated session the member has confirmed. */
export interface Booking {
  sessionId: string
  /** ISO date-time of the booked session start. */
  date: string
}

export interface DialCode {
  code: string
  country: string
  flag: string
  iso: string
}

// ---- Roles / auth ---------------------------------------------------------

export type Role = 'member' | 'admin'

export type MemberStatus = 'active' | 'frozen' | 'expired'

/** A member as seen in the admin CRM list. */
export interface MemberRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dialCode: string
  planId: string
  status: MemberStatus
  /** ISO date the member joined. */
  joined: string
  sessionsThisMonth: number
  sessionsGoal: number
  /** Tailwind gradient for the avatar. */
  avatar: string
}

// ---- Treatments / PT (1:1 booking) ---------------------------------------

export type TreatmentKind = 'massage' | 'cupping' | 'stretch' | 'pt'

export interface Treatment {
  id: string
  kind: TreatmentKind
  name: Localized
  description: Localized
  /** Duration in minutes. */
  duration: number
  provider: string
  price: Localized
  accent: string
}

/** A bookable 1:1 slot for a treatment/PT session. */
export interface TreatmentSlot {
  id: string
  treatmentId: string
  weekday: number
  start: string
  provider: string
}

// ---- Admin: bookings / attendance ----------------------------------------

/** A booking made by any member (admin roster view). */
export interface AdminBooking {
  id: string
  memberId: string
  sessionId: string
  /** ISO date-time of the session. */
  date: string
  checkedIn: boolean
}

// ---- Gym info -------------------------------------------------------------

// ---- Engagement / social --------------------------------------------------

export type ActivityType =
  | 'checkin'
  | 'booked'
  | 'milestone'
  | 'streak'
  | 'challenge'
  | 'pr'

/** An item in the community activity feed. */
export interface ActivityEvent {
  id: string
  memberId: string
  type: ActivityType
  /** Class involved, when relevant. */
  classId?: string
  /** Free-text detail for milestones / PRs. */
  detail?: Localized
  /** How long ago it happened, in minutes (rendered via RelativeTime). */
  minutesAgo: number
  cheers: number
}

/** A gym-wide collective challenge everyone contributes to. */
export interface Challenge {
  id: string
  title: Localized
  description: Localized
  unit: Localized
  goal: number
  /** Collective progress so far. */
  current: number
  endsInDays: number
  participantIds: string[]
}

/** An achievement badge. */
export interface Badge {
  id: string
  name: Localized
  description: Localized
  /** lucide icon name used to render it. */
  icon: string
  earned: boolean
  /** Progress toward earning it, when not yet earned. */
  progress?: { value: number; target: number }
}

/** Personal streak information. */
export interface StreakInfo {
  /** Consecutive active weeks. */
  current: number
  best: number
  /** Whether each of the last 7 days had activity (Mon…Sun). */
  week: boolean[]
}

// ---- Messaging (two-sided member ⇄ staff chat) ---------------------------

export type ChatParty = 'member' | 'staff'

export interface ChatMessage {
  id: string
  party: ChatParty
  text: string
  /** Name of the staff member who replied (staff messages only). */
  senderName?: string
  /** Epoch ms when sent. */
  at: number
}

/**
 * A conversation between one member and a recipient — either a specific
 * trainer (by id) or the shared general inbox that any staff can answer.
 * Id is deterministic: `${memberId}__${recipient}`.
 */
export interface Conversation {
  id: string
  memberId: string
  /** Denormalised member name for the staff inbox list. */
  memberName: string
  /** Trainer id, or 'general' for the shared TMK Fitness inbox. */
  recipient: string
  messages: ChatMessage[]
  /** Unread staff replies, from the member's perspective. */
  memberUnread: number
  /** Unread member messages, from the staff's perspective. */
  staffUnread: number
}

export interface GymInfo {
  name: string
  address: string
  postcode: string
  city: string
  phones: string[]
  email: string
  hours: { day: Localized; hours: string }[]
  facebook: string
  instagram: string
  mapQuery: string
}
