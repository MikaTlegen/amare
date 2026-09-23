import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { submitUpsellRequest } from './crm'

const FORM_URL = 'https://crm.example.test/api/public/forms/ru/'
const FORM_URL_KK = 'https://crm.example.test/api/public/forms/kk/'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_CRM_LEAD_FORM_URL_RU', FORM_URL)
  vi.stubEnv('NEXT_PUBLIC_CRM_LEAD_FORM_URL_KK', FORM_URL_KK)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function stubFetch(ok: boolean): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => ({ ok, status: ok ? 200 : 400 }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('submitUpsellRequest', () => {
  it('отправляет имя, телефон и название услуги в ту же лид-форму CRM, что и сайт', async () => {
    const fetchMock = stubFetch(true)

    const result = await submitUpsellRequest({
      offerTitle: 'Разовая консультация врача',
      patientName: 'Серик Абдуллаев',
      phone: '+7 700 000 00 00',
    })

    expect(result).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(FORM_URL)
    expect(init.method).toBe('POST')
    const body = JSON.parse(String(init.body))
    expect(body.standard_name).toBe('Серик Абдуллаев')
    expect(body.standard_phone).toBe('+7 700 000 00 00')
    expect(body.standard_message).toContain('Разовая консультация врача')
  })

  it('с казахской локалью шлёт в казахскую форму', async () => {
    const fetchMock = stubFetch(true)

    await submitUpsellRequest({
      offerTitle: 'Удалённая реабилитация',
      patientName: 'Серик Абдуллаев',
      phone: '+7 700 000 00 00',
      locale: 'kk',
    })

    expect(fetchMock.mock.calls[0]?.[0]).toBe(FORM_URL_KK)
  })

  it('возвращает ok: false, когда CRM отклонила заявку', async () => {
    stubFetch(false)

    const result = await submitUpsellRequest({
      offerTitle: 'Разовая консультация врача',
      patientName: 'Серик Абдуллаев',
      phone: '+7 700 000 00 00',
    })

    expect(result).toEqual({ ok: false })
  })

  it('возвращает ok: false, когда сеть недоступна', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Failed to fetch')
      }),
    )

    const result = await submitUpsellRequest({
      offerTitle: 'Разовая консультация врача',
      patientName: 'Серик Абдуллаев',
      phone: '+7 700 000 00 00',
    })

    expect(result).toEqual({ ok: false })
  })
})
