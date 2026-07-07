import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { convId } from '@/data/messages'
import { toConversation } from '@/lib/mappers'
import type { Database } from '@/types/supabase'
import type { ChatMessage, Conversation } from '@/types'

type MessageRow = Database['public']['Tables']['messages']['Row']

interface MessagesValue {
  ready: boolean
  conversations: Conversation[]
  byId: (id: string) => Conversation | undefined
  forMember: (memberId: string) => Conversation[]
  /** Get-or-create a member↔recipient conversation, returns its id. */
  ensure: (memberId: string, memberName: string, recipient: string) => string
  sendAsMember: (id: string) => (text: string) => void
  sendAsStaff: (id: string, senderName: string) => (text: string) => void
  markMemberRead: (id: string) => void
  markStaffRead: (id: string) => void
  memberUnreadTotal: (memberId: string) => number
  staffUnreadTotal: number
}

const MessagesContext = createContext<MessagesValue | null>(null)

const lastAt = (c: Conversation) =>
  c.messages.length ? c.messages[c.messages.length - 1].at : 0

const newId = (party: ChatParty) =>
  `${party === 'member' ? 'me' : 'st'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

type ChatParty = 'member' | 'staff'

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [ready, setReady] = useState(false)
  // Latest conversations snapshot for handlers that need current state.
  const convRef = useRef<Conversation[]>([])
  convRef.current = conversations

  const refetch = useCallback(async () => {
    const [convR, msgR] = await Promise.all([
      supabase.from('conversations').select('*'),
      supabase.from('messages').select('*'),
    ])
    const byConv = new Map<string, MessageRow[]>()
    for (const m of msgR.data ?? []) {
      const arr = byConv.get(m.conversation_id) ?? []
      arr.push(m)
      byConv.set(m.conversation_id, arr)
    }
    setConversations((convR.data ?? []).map((c) => toConversation(c, byConv.get(c.id) ?? [])))
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    let active = true
    ;(async () => {
      await refetch()
      if (active) setReady(true)
    })()
    const channel = supabase
      .channel('messages-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () =>
        void refetch(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () =>
        void refetch(),
      )
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [isAuthed, refetch])

  const byId = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations],
  )

  const forMember = useCallback(
    (memberId: string) =>
      conversations
        .filter((c) => c.memberId === memberId)
        .sort((a, b) => lastAt(b) - lastAt(a)),
    [conversations],
  )

  const ensure = useCallback(
    (memberId: string, memberName: string, recipient: string) => {
      const id = convId(memberId, recipient)
      if (!convRef.current.some((c) => c.id === id)) {
        setConversations((prev) =>
          prev.some((c) => c.id === id)
            ? prev
            : [
                ...prev,
                { id, memberId, memberName, recipient, messages: [], memberUnread: 0, staffUnread: 0 },
              ],
        )
        void supabase
          .from('conversations')
          .upsert(
            { id, member_id: memberId, member_name: memberName, recipient },
            { onConflict: 'id', ignoreDuplicates: true },
          )
          .then(({ error }) => error && console.error('ensure', error.message))
      }
      return id
    },
    [],
  )

  const append = useCallback((id: string, msg: ChatMessage, side: ChatParty) => {
    // Optimistic local update; the DB trigger bumps the other side's unread,
    // which reconciles on the next realtime refetch.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [...c.messages, msg],
              staffUnread: side === 'member' ? c.staffUnread + 1 : c.staffUnread,
              memberUnread: side === 'staff' ? c.memberUnread + 1 : c.memberUnread,
            }
          : c,
      ),
    )
    void supabase
      .from('messages')
      .insert({
        id: msg.id,
        conversation_id: id,
        party: side,
        text: msg.text,
        sender_name: msg.senderName ?? null,
        at: msg.at,
      })
      .then(({ error }) => error && console.error('send', error.message))
  }, [])

  const sendAsMember = useCallback(
    (id: string) => (text: string) => {
      const t = text.trim()
      if (!t) return
      append(id, { id: newId('member'), party: 'member', text: t, at: Date.now() }, 'member')
    },
    [append],
  )

  const sendAsStaff = useCallback(
    (id: string, senderName: string) => (text: string) => {
      const t = text.trim()
      if (!t) return
      append(
        id,
        { id: newId('staff'), party: 'staff', text: t, senderName, at: Date.now() },
        'staff',
      )
    },
    [append],
  )

  const markMemberRead = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, memberUnread: 0 } : c)))
    void supabase
      .from('conversations')
      .update({ member_unread: 0 })
      .eq('id', id)
      .then(({ error }) => error && console.error('markMemberRead', error.message))
  }, [])

  const markStaffRead = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, staffUnread: 0 } : c)))
    void supabase
      .from('conversations')
      .update({ staff_unread: 0 })
      .eq('id', id)
      .then(({ error }) => error && console.error('markStaffRead', error.message))
  }, [])

  const memberUnreadTotal = useCallback(
    (memberId: string) =>
      conversations
        .filter((c) => c.memberId === memberId)
        .reduce((n, c) => n + c.memberUnread, 0),
    [conversations],
  )

  const staffUnreadTotal = useMemo(
    () => conversations.reduce((n, c) => n + c.staffUnread, 0),
    [conversations],
  )

  const value = useMemo<MessagesValue>(
    () => ({
      ready,
      conversations: [...conversations].sort((a, b) => lastAt(b) - lastAt(a)),
      byId,
      forMember,
      ensure,
      sendAsMember,
      sendAsStaff,
      markMemberRead,
      markStaffRead,
      memberUnreadTotal,
      staffUnreadTotal,
    }),
    [
      ready,
      conversations,
      byId,
      forMember,
      ensure,
      sendAsMember,
      sendAsStaff,
      markMemberRead,
      markStaffRead,
      memberUnreadTotal,
      staffUnreadTotal,
    ],
  )

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMessages(): MessagesValue {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages must be used within a MessagesProvider')
  return ctx
}
