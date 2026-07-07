import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { useMessages } from '@/context/MessagesContext'
import { ADMIN_NAME, GENERAL, GENERAL_AVATAR } from '@/data/messages'
import { ChatConversation } from '@/components/ChatConversation'

/** Staff-side conversation thread inside the admin inbox. */
export function AdminInboxThread() {
  const { convId } = useParams()
  const { t } = useLanguage()
  const { members, trainers } = useAdminData()
  const { byId, sendAsStaff, markStaffRead } = useMessages()
  const navigate = useNavigate()

  useEffect(() => {
    if (convId) markStaffRead(convId)
  }, [convId, markStaffRead])

  const conv = byId(convId!)
  if (!conv) return null

  const record = members.find((m) => m.id === conv.memberId)
  const recipientLabel =
    conv.recipient === GENERAL
      ? t('messages.general')
      : (trainers.find((tr) => tr.id === conv.recipient)?.name ?? conv.recipient)

  const avatar = record
    ? { firstName: record.firstName, lastName: record.lastName, avatar: record.avatar }
    : { firstName: 'TMK', lastName: 'Fitness', avatar: GENERAL_AVATAR }

  return (
    <ChatConversation
      onBack={() => navigate('/admin/inbox')}
      avatar={avatar}
      title={conv.memberName}
      subtitle={`${t('inbox.re')} ${recipientLabel}`}
      messages={conv.messages}
      viewer="staff"
      onSend={sendAsStaff(convId!, ADMIN_NAME)}
    />
  )
}
