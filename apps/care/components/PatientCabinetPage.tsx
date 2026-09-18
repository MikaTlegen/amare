'use client'

import { useState } from 'react'
import { CabinetShell, DemoNotice, ChatPanel, type Tab } from '@amare/ui'
import { TodayPlan } from './TodayPlan'
import { ProgressPanel } from './ProgressPanel'
import { DiaryPanel } from './DiaryPanel'
import { MedsPanel } from './MedsPanel'
import { MaterialsPanel } from './MaterialsPanel'
import { DocsPanel } from './DocsPanel'
import { SosButton } from './SosButton'
import { useAuth, ROLE_LABEL } from '@/auth/AuthContext'
import { getMessages, sendMessage } from '@/lib/mock'

/**
 * Порядок вкладок — это порядок важности за день, а не структура данных.
 * Сначала то, что нужно сделать (план, дневник, лекарства), потом то,
 * на что смотрят (прогресс, материалы, документы), и в конце связь.
 */
const TABS: Tab[] = [
  { id: 'plan', label: 'Сегодня' },
  { id: 'diary', label: 'Дневник' },
  { id: 'meds', label: 'Лекарства' },
  { id: 'progress', label: 'Мой прогресс' },
  { id: 'materials', label: 'Материалы' },
  { id: 'docs', label: 'Документы и доступ' },
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
    <>
      <CabinetShell
        title="Кабинет пациента"
        subtitle="Курс реабилитации · куратор Индира Жумабекова"
        tabs={TABS}
        active={tab}
        onTabChange={setTab}
        userName={user?.name ?? ''}
        roleLabel={ROLE_LABEL.patient}
    homeHref={process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}
        onSignOut={signOut}
      >
        <DemoNotice />
        {tab === 'plan' && <TodayPlan />}
        {tab === 'diary' && <DiaryPanel />}
        {tab === 'meds' && <MedsPanel />}
        {tab === 'progress' && <ProgressPanel />}
        {tab === 'materials' && <MaterialsPanel />}
        {tab === 'docs' && <DocsPanel />}
        {tab === 'chat' && <ChatPanel api={CHAT_API} />}
      </CabinetShell>

      {/* SOS доступен с любой вкладки — это требование P-06, а не украшение */}
      <SosButton />
    </>
  )
}
