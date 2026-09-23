'use client'

import { useEffect, useState } from 'react'
import type { ProgramTemplate, StaffMember, StaffRole } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { getEditableTemplates, getStaffMembers } from '@/lib/mock'

/**
 * Команда курсов: кто из кураторов и модераторов на скольких курсах.
 *
 * Только просмотр — назначают на курс в конструкторе, рядом с самим
 * курсом, чтобы не было двух мест, где одно и то же меняется по-разному.
 */
export function TeamPanel() {
  const t = useT('staff')
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [courses, setCourses] = useState<ProgramTemplate[]>([])

  useEffect(() => {
    void getStaffMembers().then(setStaff)
    void getEditableTemplates().then(setCourses)
  }, [])

  const courseCount = (member: StaffMember) =>
    courses.filter((course) =>
      (member.staffRole === 'curator' ? course.curatorIds : course.moderatorIds)?.includes(member.id),
    ).length

  const group = (role: StaffRole, title: string) => (
    <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{title}</h3>
      <ul className="m-0 flex list-none flex-col p-0">
        {staff
          .filter((member) => member.staffRole === role)
          .map((member) => (
            <li key={member.id} className="flex items-center gap-3 border-t border-line py-4 first:border-t-0 first:pt-0">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint font-display text-base font-semibold text-deep"
              >
                {member.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-base font-semibold">{member.name}</span>
                <span className="text-base text-muted">{member.speciality}</span>
              </div>
              <span className="shrink-0 text-base tabular-nums text-muted">
                {t('team.courses', { count: courseCount(member) })}
              </span>
            </li>
          ))}
      </ul>
    </section>
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="m-0 font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{t('tab.team')}</h2>
      <div className="grid gap-4 xl:grid-cols-2">
        {group('curator', t('team.curators'))}
        {group('moderator', t('team.moderators'))}
      </div>
      <p className="m-0 text-base text-muted">{t('team.note')}</p>
    </div>
  )
}
