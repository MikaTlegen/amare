'use client'

import {
  BookOpen,
  CalendarCheck,
  FileLock2,
  LayoutDashboard,
  MessageCircle,
  NotebookPen,
  Pill,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { CabinetShell, DemoNotice, ChatPanel, useCabinetTab, type Tab, type TabGroup } from '@amare/ui'
import { CareDashboard } from './CareDashboard'
import { TodayPlan } from './TodayPlan'
import { ProgressPanel } from './ProgressPanel'
import { DiaryPanel } from './DiaryPanel'
import { MedsPanel } from './MedsPanel'
import { MaterialsPanel } from './MaterialsPanel'
import { DocsPanel } from './DocsPanel'
import { UpsellPanel } from './UpsellPanel'
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
  ['home', 'tab.home', LayoutDashboard],
  ['plan', 'tab.today', CalendarCheck],
  ['diary', 'tab.diary', NotebookPen],
  ['meds', 'tab.meds', Pill],
  ['progress', 'tab.myProgress', TrendingUp],
  ['materials', 'tab.materials', BookOpen],
  ['docs', 'tab.docsAccess', FileLock2],
  ['more', 'tab.more', Sparkles],
  ['chat', 'tab.chat', MessageCircle],
] as const

const TAB_IDS = TAB_KEYS.map(([id]) => id)

/**
 * Группы бокового меню — те же три смысла, что и порядок вкладок:
 * что сделать сегодня, как идут дела, с кем связаться. Документы и
 * доп. услуги — отдельно и последними: туда заходят редко.
 */
const GROUP_KEYS = [
  ['group.today', ['home', 'plan', 'diary', 'meds']],
  ['group.progress', ['progress', 'materials']],
  ['group.contact', ['chat']],
  ['group.docs', ['docs', 'more']],
] as const

/**
 * Нижняя панель на телефоне: сводка, план дня и куратор. Дневник ушёл
 * в «Ещё», но с главной до него одно нажатие — карточка «Давление».
 */
const MOBILE_BAR = ['home', 'plan', 'chat']

// Модульная константа: getMessages/sendMessage стабильны, ChatPanel не перезапрашивает
// сообщения на каждый ре-рендер родителя (объект-литерал внутри JSX пересоздавался бы).
const CHAT_API = { getMessages, sendMessage }

// TODO CRM: имя куратора придёт из карточки пациента вместе с бэкендом
const CURATOR_NAME = 'Индира Жумабекова'

/** Кабинет пациента (модуль M5 ТЗ). */
export function PatientCabinetPage() {
  const t = useT('cabinet')
  const { user, signOut } = useAuth()
  const [tab, setTab] = useCabinetTab(TAB_IDS, 'home')

  const tabs: Tab[] = TAB_KEYS.map(([id, key, icon]) => ({ id, label: t(key), icon }))
  const groups: TabGroup[] = GROUP_KEYS.map(([key, ids]) => ({ label: t(key), ids }))

  return (
    <CabinetShell
      title={t('patient.title')}
      subtitle={t('patient.subtitle', { curator: CURATOR_NAME })}
      tabs={tabs}
      groups={groups}
      mobileBar={MOBILE_BAR}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={t(ROLE_KEY.patient)}
      homeHref={process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}
      onSignOut={signOut}
      // SOS доступен с любой вкладки (P-06) — иконка в шапке, а не плавающая кнопка
      headerExtra={<SosButton />}
    >
      <DemoNotice />
      {tab === 'home' && <CareDashboard role="patient" onOpen={setTab} />}
      {tab === 'plan' && <TodayPlan />}
      {tab === 'diary' && <DiaryPanel />}
      {tab === 'meds' && <MedsPanel />}
      {tab === 'progress' && <ProgressPanel />}
      {tab === 'materials' && <MaterialsPanel />}
      {tab === 'docs' && <DocsPanel />}
      {tab === 'more' && <UpsellPanel />}
      {tab === 'chat' && <ChatPanel api={CHAT_API} />}
    </CabinetShell>
  )
}
