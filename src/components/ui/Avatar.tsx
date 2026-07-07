const SIZES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
} as const

interface AvatarMember {
  firstName: string
  lastName: string
  avatar: string
  /** Optional profile photo (data URL / URL). */
  photo?: string
}

/** Initials avatar on the member's brand gradient, or a photo if provided. */
export function Avatar({
  member,
  size = 'md',
  ring,
}: {
  member: AvatarMember
  size?: keyof typeof SIZES
  ring?: boolean
}) {
  const ringCls = ring ? 'ring-2 ring-white' : ''
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={`${member.firstName} ${member.lastName}`}
        className={`shrink-0 rounded-full object-cover ${SIZES[size]} ${ringCls}`}
      />
    )
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${member.avatar} font-heading font-bold uppercase text-white ${SIZES[size]} ${ringCls}`}
    >
      {member.firstName[0]}
      {member.lastName[0]}
    </div>
  )
}

/** Overlapping stack of avatars (e.g. "friends going"). */
export function AvatarStack({
  members,
  max = 3,
  size = 'xs',
}: {
  members: AvatarMember[]
  max?: number
  size?: keyof typeof SIZES
}) {
  const shown = members.slice(0, max)
  return (
    <div className="flex -space-x-2">
      {shown.map((m, i) => (
        <Avatar key={i} member={m} size={size} ring />
      ))}
    </div>
  )
}
