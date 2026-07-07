import type { GymInfo } from '@/types'

/** Real TMK Fitness contact details (from tmkfitness.no). */
export const gymInfo: GymInfo = {
  name: 'TMK Fitness Senter',
  address: 'Helganesveien 34',
  postcode: '4262',
  city: 'Avaldsnes',
  phones: ['978 19 938', '957 95 420'],
  email: 'michel@tmkfitness.no',
  hours: [
    { day: { no: 'Man–Fre', en: 'Mon–Fri' }, hours: '05:00–23:00' },
    { day: { no: 'Lør–Søn', en: 'Sat–Sun' }, hours: '07:00–23:00' },
    { day: { no: 'Betjent (PT/behandling)', en: 'Staffed (PT/treatment)' }, hours: '10:00–18:00' },
  ],
  facebook: 'https://nb-no.facebook.com/tmkfitnesssenter/',
  instagram: 'https://www.instagram.com/tmkfitnesssenter/',
  mapQuery: 'TMK Fitness, Helganesveien 34, 4262 Avaldsnes',
}
