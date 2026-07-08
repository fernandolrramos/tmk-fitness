import type { Database } from '@/types/supabase'
import type {
  AdminBooking,
  Booking,
  ChatMessage,
  Conversation,
  GymClass,
  Localized,
  Member,
  MemberRecord,
  MembershipPlan,
  Session,
  Trainer,
  Treatment,
  TreatmentSlot,
} from '@/types'
import type { FeedItem } from '@/context/EngagementContext'

type T = Database['public']['Tables']
type Row<K extends keyof T> = T[K]['Row']
type Ins<K extends keyof T> = T[K]['Insert']

const loc = (j: unknown): Localized => j as Localized

// ---- DB row -> app type ---------------------------------------------------

export const toPlan = (r: Row<'plans'>): MembershipPlan => ({
  id: r.id,
  name: loc(r.name),
  price: loc(r.price),
  terms: loc(r.terms),
  featured: r.featured,
})

export const toClass = (r: Row<'classes'>): GymClass => ({
  id: r.id,
  category: r.category as GymClass['category'],
  name: loc(r.name),
  description: loc(r.description),
  accent: r.accent,
})

export const toTrainer = (r: Row<'trainers'>): Trainer => ({
  id: r.id,
  name: r.name,
  role: loc(r.role),
  specialties: loc(r.specialties),
  bio: loc(r.bio),
  initials: r.initials,
  avatar: r.avatar,
  contactable: r.contactable,
})

export const toSession = (r: Row<'sessions'>): Session => ({
  id: r.id,
  classId: r.class_id,
  weekday: r.weekday,
  start: r.start,
  end: r.end,
  instructor: r.instructor,
  capacity: r.capacity,
  spotsLeft: r.spots_left,
  freeForMembers: r.free_for_members,
})

export const toTreatment = (r: Row<'treatments'>): Treatment => ({
  id: r.id,
  kind: r.kind as Treatment['kind'],
  name: loc(r.name),
  description: loc(r.description),
  duration: r.duration,
  provider: r.provider,
  price: loc(r.price),
  accent: r.accent,
})

export const toTreatmentSlot = (r: Row<'treatment_slots'>): TreatmentSlot => ({
  id: r.id,
  treatmentId: r.treatment_id,
  weekday: r.weekday,
  start: r.start,
  provider: r.provider,
})

export const toMemberRecord = (r: Row<'members'>): MemberRecord => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  dialCode: r.dial_code,
  planId: r.plan_id,
  status: r.status as MemberRecord['status'],
  joined: r.joined,
  sessionsThisMonth: r.sessions_this_month,
  sessionsGoal: r.sessions_goal,
  avatar: r.avatar,
})

export const toMember = (r: Row<'members'>): Member => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  photo: r.photo ?? undefined,
  phone: r.phone,
  dialCode: r.dial_code,
  planId: r.plan_id,
  sessionsThisMonth: r.sessions_this_month,
  sessionsGoal: r.sessions_goal,
  streakCurrent: r.streak_current,
  streakBest: r.streak_best,
})

export const toBooking = (r: Row<'bookings'>): Booking => ({
  sessionId: r.session_id,
  date: r.date,
})

export const toAdminBooking = (r: Row<'bookings'>): AdminBooking => ({
  id: r.id,
  memberId: r.member_id,
  sessionId: r.session_id,
  date: r.date,
  checkedIn: r.checked_in,
})

export const toChatMessage = (r: Row<'messages'>): ChatMessage => ({
  id: r.id,
  party: r.party as ChatMessage['party'],
  text: r.text,
  senderName: r.sender_name ?? undefined,
  at: r.at,
})

export const toConversation = (
  c: Row<'conversations'>,
  msgs: Row<'messages'>[],
): Conversation => ({
  id: c.id,
  memberId: c.member_id,
  memberName: c.member_name,
  recipient: c.recipient,
  memberUnread: c.member_unread,
  staffUnread: c.staff_unread,
  messages: msgs.map(toChatMessage).sort((a, b) => a.at - b.at),
})

type FeedRow = Database['public']['Views']['activity_feed_view']['Row']
export const toFeedItem = (r: FeedRow): FeedItem => ({
  id: r.id as string,
  memberId: r.member_id as string,
  type: r.type as FeedItem['type'],
  classId: r.class_id ?? undefined,
  detail: (r.detail as Localized | null) ?? undefined,
  minutesAgo: r.minutes_ago ?? 0,
  cheers: r.cheers ?? 0,
  cheeredByMe: r.cheered_by_me ?? false,
})

// ---- app type -> DB insert row --------------------------------------------

export const memberRecordToRow = (m: MemberRecord): Ins<'members'> => ({
  id: m.id,
  first_name: m.firstName,
  last_name: m.lastName,
  email: m.email,
  phone: m.phone,
  dial_code: m.dialCode,
  plan_id: m.planId,
  status: m.status,
  joined: m.joined,
  sessions_this_month: m.sessionsThisMonth,
  sessions_goal: m.sessionsGoal,
  avatar: m.avatar,
})

export const sessionToRow = (s: Session): Ins<'sessions'> => ({
  id: s.id,
  class_id: s.classId,
  weekday: s.weekday,
  start: s.start,
  end: s.end,
  instructor: s.instructor,
  capacity: s.capacity,
  spots_left: s.spotsLeft,
  free_for_members: s.freeForMembers ?? false,
})

export const trainerToRow = (t: Trainer): Ins<'trainers'> => ({
  id: t.id,
  name: t.name,
  role: t.role as unknown as Database['public']['Tables']['trainers']['Insert']['role'],
  specialties: t.specialties as unknown as Ins<'trainers'>['specialties'],
  bio: t.bio as unknown as Ins<'trainers'>['bio'],
  initials: t.initials,
  avatar: t.avatar,
  contactable: t.contactable ?? false,
})
