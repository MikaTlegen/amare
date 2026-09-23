'use client'

import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartHandshake,
  Info,
  MessageCircle,
  NotebookPen,
  Phone,
  Pill,
  TrendingUp,
  TriangleAlert,
  Video,
} from 'lucide-react'
import { CabinetShell, DemoNotice, ChatPanel, cn, useCabinetTab, type Tab, type TabGroup } from '@amare/ui'
import type { PatientCard } from '@amare/api-client'
import { TodayPlan } from './TodayPlan'
import { ProgressPanel } from './ProgressPanel'
import { DiaryPanel } from './DiaryPanel'
import { MedsPanel } from './MedsPanel'
import { CareLogPanel } from './CareLogPanel'
import { GuardianSchool } from './GuardianSchool'
import { SosButton } from './SosButton'
import { usePlural, useT } from '@amare/i18n/react'
import { useAuth, ROLE_KEY } from '@/auth/AuthContext'
import { getMessages, getPatientCard, sendMessage } from '@/lib/mock'
import { CLINIC_PHONE } from '@/lib/clinic'

const TAB_KEYS = [
  ['ward', 'tab.person', HeartHandshake],
  ['care', 'tab.care', ClipboardList],
  ['plan', 'tab.plan', CalendarCheck],
  ['diary', 'tab.diary', NotebookPen],
  ['meds', 'tab.meds', Pill],
  ['progress', 'tab.progress', TrendingUp],
  ['school', 'tab.school', GraduationCap],
  ['chat', 'tab.chat', MessageCircle],
] as const

const TAB_IDS = TAB_KEYS.map(([id]) => id)

/** Группы меню: всё о близком человеке, затем своё — учёба и связь. */
const GROUP_KEYS = [
  ['group.ward', ['ward', 'care', 'plan', 'diary', 'meds', 'progress']],
  ['group.guardian', ['school']],
  ['group.contact', ['chat']],
] as const

/** Нижняя панель на телефоне: сводка, свои отметки ухода и связь с куратором. */
const MOBILE_BAR = ['ward', 'care', 'chat']

// См. PatientCabinetPage.tsx — та же стабильная ссылка на api для ChatPanel.
const CHAT_API = { getMessages, sendMessage }

/**
 * Кабинет опекуна (модуль M6 ТЗ).
 *
 * Отличие от кабинета пациента принципиальное: опекун смотрит и
 * ухаживает, но не отчитывается за подопечного. Отметки выполнения
 * упражнений и приёма лекарств ставит пациент — это медицинские записи
 * о нём. А повороты, осмотр кожи и кормление делает и отмечает опекун:
 * это его работа, и куратору важно видеть именно её.
 */
export function GuardianCabinetPage() {
  const t = useT('cabinet')
  const { user, signOut } = useAuth()
  const [tab, setTab] = useCabinetTab(TAB_IDS, 'ward')

  const tabs: Tab[] = TAB_KEYS.map(([id, key, icon]) => ({ id, label: t(key), icon }))
  const groups: TabGroup[] = GROUP_KEYS.map(([key, ids]) => ({ label: t(key), ids }))
  const [card, setCard] = useState<PatientCard | null>(null)

  useEffect(() => {
    void getPatientCard().then(setCard)
  }, [])

  return (
    <CabinetShell
      title={t('guardian.title')}
      subtitle={card ? t('guardian.subtitle', { name: card.name }) : undefined}
      tabs={tabs}
      groups={groups}
      mobileBar={MOBILE_BAR}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={t(ROLE_KEY.guardian)}
      homeHref={process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}
      onSignOut={signOut}
      headerExtra={<SosButton />}
    >
      <DemoNotice />

      {tab === 'ward' && card && <WardSummary card={card} />}
      {tab === 'care' && <CareLogPanel />}
      {tab === 'plan' && <TodayPlan readOnly />}
      {tab === 'diary' && <DiaryPanel byGuardian />}
      {tab === 'meds' && <MedsPanel byGuardian />}
      {tab === 'progress' && <ProgressPanel />}
      {tab === 'school' && <GuardianSchool />}
      {tab === 'chat' && <ChatPanel api={CHAT_API} readOnly />}
    </CabinetShell>
  )
}

/**
 * Сводка по подопечному (G-02) вместе с алертами опекуну (G-04).
 *
 * Тревожные сигналы стоят выше карточки специально: опекун заходит
 * не «посмотреть, как дела», а понять, нужно ли что-то делать прямо
 * сейчас. Если сначала показать возраст и диагноз, предупреждение
 * о двух днях без активности он пролистает.
 */
function WardSummary({ card }: { card: PatientCard }) {
  const t = useT('cabinet')
  const plural = usePlural('cabinet')

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {card.alerts.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 lg:col-span-12">
          {card.alerts.map((alert) => (
            <li
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-2xl border px-5 py-4',
                alert.level === 'info' && 'border-line bg-surface',
                alert.level === 'warn' && 'border-accent bg-[rgb(253,238,237)]',
                alert.level === 'danger' && 'border-[rgb(179,38,30)] bg-[rgb(255,235,233)]',
              )}
            >
              {/* Справочное событие (плановая переоценка) — не тревога: красный
                  треугольник на каждом сообщении приучает не замечать настоящие */}
              {alert.level === 'info' ? (
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              ) : (
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              )}
              <span className="flex-1 text-base leading-relaxed">{alert.text}</span>
              <span className="shrink-0 text-sm text-muted">{alert.at}</span>
            </li>
          ))}
        </ul>
      )}

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-7">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          {plural('guardian.age', card.age, { name: card.name })}
        </h2>

        <dl className="m-0 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">{t('guardian.state')}</dt>
            <dd className="m-0 text-base font-medium">{card.diagnosis}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t('guardian.course')}</dt>
            <dd className="m-0 text-base font-medium">
              {t('guardian.courseDay', { day: card.courseDay, total: card.courseLength })}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t('guardian.curator')}</dt>
            <dd className="m-0 text-base font-medium">{card.curator}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t('guardian.nextReview')}</dt>
            <dd className="m-0 text-base font-medium">{t('guardian.reviewDay')}</dd>
          </div>
        </dl>

        <a
          href={CLINIC_PHONE.href}
          className="inline-flex min-h-[3rem] w-fit items-center gap-2 rounded-xl border-[1.5px] border-deep px-5 py-3 text-base font-semibold text-deep no-underline"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {t('guardian.call')}
        </a>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          {t('guardian.reports')}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
            <Video className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="flex-1 text-base">{t('guardian.reportVideo')}</span>
            <span className="text-sm text-muted">{t('guardian.yesterday')}</span>
          </li>
          <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
            <FileText className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="flex-1 text-base">{t('guardian.reportWeek')}</span>
            <span className="text-sm text-muted">{t('guardian.daysAgo', { count: 3 })}</span>
          </li>
          <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
            <Video className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="flex-1 text-base">{t('guardian.reportHomework')}</span>
            <span className="text-sm text-muted">{t('guardian.daysAgo', { count: 4 })}</span>
          </li>
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          {/* TODO BACKEND: выдача файлов только по подписанной ссылке с коротким сроком жизни */}
          {t('guardian.reportsNote')}
        </p>
      </section>
    </div>
  )
}

