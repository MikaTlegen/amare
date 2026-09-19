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
import { useT } from '@amare/i18n/react'
import { useAuth, ROLE_KEY } from '@/auth/AuthContext'
import { getMessages, sendMessage } from '@/lib/mock'

/**
 * Порядок вкладок — это порядок важности за день, а не структура данных.
 * Сначала то, что нужно сделать (план, дневник, лекарства), потом то,
 * на что смотрят (прогресс, материалы, документы), и в конце связь.
 */
const TAB_KEYS = [
  ['plan', 'tab.today'],
  ['diary', 'tab.diary'],
  ['meds', 'tab.meds'],
  ['progress', 'tab.myProgress'],
  ['materials', 'tab.materials'],
  ['docs', 'tab.docsAccess'],
  ['chat', 'tab.chat'],
] as const

// Модульная константа: getMessages/sendMessage стабильны, ChatPanel не перезапрашивает
// сообщения на каждый ре-рендер родителя (объект-литерал внутри JSX пересоздавался бы).
const CHAT_API = { getMessages, sendMessage }

// TODO CRM: имя куратора придёт из карточки пациента вместе с бэкендом
const CURATOR_NAME = 'Индира Жумабекова'

/** Кабинет пациента (модуль M5 ТЗ). */
export function PatientCabinetPage() {
  const t = useT('cabinet')
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('plan')

  const tabs: Tab[] = TAB_KEYS.map(([id, key]) => ({ id, label: t(key) }))

  return (
    <>
      <CabinetShell
        title={t('patient.title')}
        subtitle={t('patient.subtitle', { curator: CURATOR_NAME })}
        tabs={tabs}
        active={tab}
        onTabChange={setTab}
        userName={user?.name ?? ''}
        roleLabel={t(ROLE_KEY.patient)}
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
