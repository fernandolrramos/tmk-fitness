import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useAdminData } from '@/context/AdminDataContext'
import { useMessages } from '@/context/MessagesContext'
import { GENERAL, GENERAL_AVATAR } from '@/data/messages'
import { ChatConversation } from '@/components/ChatConversation'

/** Member-side conversation thread (with a coach or the general inbox). */
export function MessageThread() {
  const { convId } = useParams()
  const { t } = useLanguage()
  const { member } = useAuth()
  const { trainers } = useAdminData()
  const { byId, ensure, sendAsMember, markMemberRead } = useMessages()
  const navigate = useNavigate()

  // Derive the recipient from the id and make sure the conversation exists.
  const recipient = (convId ?? '').split('__')[1] ?? GENERAL

  useEffect(() => {
    ensure(member.id, `${member.firstName} ${member.lastName}`, recipient)
    if (convId) markMemberRead(convId)
  }, [convId, recipient, member.id, member.firstName, member.lastName, ensure, markMemberRead])

  const conv = byId(convId!)
  const coach = trainers.find((tr) => tr.id === recipient)

  const avatar =
    recipient === GENERAL || !coach
      ? { firstName: 'TMK', lastName: 'Fitness', avatar: GENERAL_AVATAR }
      : {
          firstName: coach.name.split(' ')[0],
          lastName: coach.name.split(' ').slice(-1)[0],
          avatar: coach.avatar,
        }

  return (
    <ChatConversation
      onBack={() => navigate('/messages')}
      avatar={avatar}
      title={recipient === GENERAL || !coach ? 'TMK Fitness' : coach.name}
      subtitle={t('messages.reply')}
      messages={conv?.messages ?? []}
      viewer="member"
      onSend={sendAsMember(convId!)}
    />
  )
}
