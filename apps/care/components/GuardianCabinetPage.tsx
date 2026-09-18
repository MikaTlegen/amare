'use client'

import { useEffect, useState } from 'react'
import { Phone, FileText, Video } from 'lucide-react'
import { CabinetShell, DemoNotice, ChatPanel, type Tab } from '@amare/ui'
import type { PatientCard } from '@amare/api-client'
import { TodayPlan } from './TodayPlan'
import { ProgressPanel } from './ProgressPanel'
import { useAuth, ROLE_LABEL } from '@/auth/AuthContext'
import { getMessages, getPatientCard, sendMessage } from '@/lib/mock'
import { CLINIC_PHONE } from '@/lib/clinic'

const TABS: Tab[] = [
  { id: 'ward', label: 'Близкий человек' },
  { id: 'plan', label: 'План дня' },
  { id: 'progress', label: 'Прогресс' },
  { id: 'chat', label: 'Куратор' },
]

// См. PatientCabinetPage.tsx — та же стабильная ссылка на api для ChatPanel.
const CHAT_API = { getMessages, sendMessage }

/**
 * Кабинет опекуна (модуль M6 ТЗ).
 *
 * Отличие от кабинета пациента принципиальное: опекун смотрит, но не
 * действует за подопечного. Он видит состояние, отчёты и может написать
 * куратору — этого достаточно, чтобы перестать звонить в регистратуру
 * каждый день, а именно на это жалуются в отзывах.
 */
export function GuardianCabinetPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('ward')
  const [card, setCard] = useState<PatientCard | null>(null)

  useEffect(() => {
    void getPatientCard().then(setCard)
  }, [])

  return (
    <CabinetShell
      title="Кабинет опекуна"
      subtitle={card ? `Вы смотрите за: ${card.name}` : undefined}
      tabs={TABS}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={ROLE_LABEL.guardian}
      onSignOut={signOut}
    >
      <DemoNotice />

      {tab === 'ward' && card && (
        <div className="grid gap-5 lg:grid-cols-12">
          <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-7">
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
              {card.name}, {card.age} года
            </h2>

            <dl className="m-0 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Состояние</dt>
                <dd className="m-0 text-base font-medium">{card.diagnosis}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Курс</dt>
                <dd className="m-0 text-base font-medium">
                  День {card.courseDay} из {card.courseLength}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Куратор</dt>
                <dd className="m-0 text-base font-medium">{card.curator}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Следующая переоценка</dt>
                <dd className="m-0 text-base font-medium">15-й день курса</dd>
              </div>
            </dl>

            <a
              href={CLINIC_PHONE.href}
              className="inline-flex min-h-[3rem] w-fit items-center gap-2 rounded-xl border-[1.5px] border-deep px-5 py-3 text-base font-semibold text-deep no-underline"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Позвонить в клинику
            </a>
          </section>

          <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
              Отчёты с занятий
            </h2>

            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
                <Video className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span className="flex-1 text-base">Видео с занятия ЛФК</span>
                <span className="text-sm text-muted">вчера</span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
                <FileText className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span className="flex-1 text-base">Заключение за первую неделю</span>
                <span className="text-sm text-muted">3 дня назад</span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3.5">
                <Video className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span className="flex-1 text-base">Разбор домашнего задания</span>
                <span className="text-sm text-muted">4 дня назад</span>
              </li>
            </ul>

            <p className="m-0 text-base leading-relaxed text-muted">
              {/* TODO BACKEND: выдача файлов только по подписанной ссылке с коротким сроком жизни */}
              Материалы доступны только вам и лечащей команде.
            </p>
          </section>
        </div>
      )}

      {tab === 'plan' && <TodayPlan readOnly />}
      {tab === 'progress' && <ProgressPanel />}
      {tab === 'chat' && <ChatPanel api={CHAT_API} readOnly />}
    </CabinetShell>
  )
}
