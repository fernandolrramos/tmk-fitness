import type { Conversation } from '@/types'

const MIN = 60_000

/** The shared front-desk inbox recipient id. */
export const GENERAL = 'general'

/** Name attributed to staff replies from the admin console. */
export const ADMIN_NAME = 'Michel Møller'

/** Gradient for the general / TMK Fitness inbox avatar. */
export const GENERAL_AVATAR = 'from-secondary to-primary'

export const convId = (memberId: string, recipient: string): string =>
  `${memberId}__${recipient}`

/**
 * Seed conversations across several members so the staff inbox is populated.
 * The demo member is "m-sara"; the rest drive the admin inbox.
 */
export function seedConversations(now = Date.now()): Conversation[] {
  return [
    // Sara ⇄ Michel (has one unread staff reply for the member)
    {
      id: convId('m-sara', 'michel'),
      memberId: 'm-sara',
      memberName: 'Sara Vikingstad',
      recipient: 'michel',
      memberUnread: 1,
      staffUnread: 0,
      messages: [
        { id: 'm1', party: 'member', text: 'Hei Michel! Skal vi fokusere på rygg på torsdag?', at: now - 180 * MIN },
        {
          id: 'm2',
          party: 'staff',
          senderName: 'Michel Møller',
          text: 'Hei Sara! Ja, vi tar rygg og kjerne. Husk å spise godt før økta.',
          at: now - 20 * MIN,
        },
      ],
    },
    // Sara ⇄ Knut Martin
    {
      id: convId('m-sara', 'knut-martin'),
      memberId: 'm-sara',
      memberName: 'Sara Vikingstad',
      recipient: 'knut-martin',
      memberUnread: 0,
      staffUnread: 0,
      messages: [
        {
          id: 'k1',
          party: 'staff',
          senderName: 'Knut Martin Haraldsen',
          text: 'God innsats på styrketrening i går! Hvordan føles skuldra?',
          at: now - 26 * 60 * MIN,
        },
        { id: 'k2', party: 'member', text: 'Mye bedre, takk! Øvelsene hjelper.', at: now - 25 * 60 * MIN },
      ],
    },
    // Jonas → general inbox (awaiting a staff reply)
    {
      id: convId('m-jonas', GENERAL),
      memberId: 'm-jonas',
      memberName: 'Jonas Håland',
      recipient: GENERAL,
      memberUnread: 0,
      staffUnread: 1,
      messages: [
        {
          id: 'j1',
          party: 'member',
          text: 'Hei! Kan jeg fryse medlemskapet mitt i august?',
          at: now - 45 * MIN,
        },
      ],
    },
    // Ingrid → Michel (awaiting reply)
    {
      id: convId('m-ingrid', 'michel'),
      memberId: 'm-ingrid',
      memberName: 'Ingrid Sørbø',
      recipient: 'michel',
      memberUnread: 0,
      staffUnread: 1,
      messages: [
        {
          id: 'i1',
          party: 'member',
          text: 'Har du ledig PT-time neste uke?',
          at: now - 90 * MIN,
        },
      ],
    },
    // Nora → general inbox (awaiting reply)
    {
      id: convId('m-nora', GENERAL),
      memberId: 'm-nora',
      memberName: 'Nora Vea',
      recipient: GENERAL,
      memberUnread: 0,
      staffUnread: 1,
      messages: [
        {
          id: 'n1',
          party: 'member',
          text: 'Hva er åpningstidene i påsken?',
          at: now - 5 * 60 * MIN,
        },
      ],
    },
  ]
}
