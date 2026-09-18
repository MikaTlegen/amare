'use client'

import { useState } from 'react'
import { CabinetShell, DemoNotice, ChatPanel, type Tab } from '@amare/ui'
import { TodayPlan } from './TodayPlan'
import { ProgressPanel } from './ProgressPanel'
import { useAuth, ROLE_LABEL } from '@/auth/AuthContext'
import { getMessages, sendMessage } from '@/lib/mock'

const TABS: Tab[] = [
  { id: 'plan', label: 'План на сегодня' },
  { id: 'progress', label: 'Мой прогресс' },
  { id: 'chat', label: 'Куратор' },
]

// Модульная константа: getMessages/sendMessage стабильны, ChatPanel не перезапрашивает
// сообщения на каждый ре-рендер родителя (объект-литерал внутри JSX пересоздавался бы).
const CHAT_API = { getMessages, sendMessage }

/** Кабинет пациента (модуль M5 ТЗ). */
export function PatientCabinetPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('plan')

  return (
    <CabinetShell
      title="Кабинет пациента"
      subtitle="Курс реабилитации · куратор Индира Жумабекова"
      tabs={TABS}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={ROLE_LABEL.patient}
      onSignOut={signOut}
    >
      <DemoNotice />
      {tab === 'plan' && <TodayPlan />}
      {tab === 'progress' && <ProgressPanel />}
      {tab === 'chat' && <ChatPanel api={CHAT_API} />}
    </CabinetShell>
  )
}
