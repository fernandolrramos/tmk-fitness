import type { DialCode } from '@/types'

/** Searchable dial-code list for the phone field. Norway default. */
export const dialCodes: DialCode[] = [
  { code: '+47', country: 'Norge / Norway', flag: '🇳🇴', iso: 'NO' },
  { code: '+46', country: 'Sverige / Sweden', flag: '🇸🇪', iso: 'SE' },
  { code: '+45', country: 'Danmark / Denmark', flag: '🇩🇰', iso: 'DK' },
  { code: '+358', country: 'Finland', flag: '🇫🇮', iso: 'FI' },
  { code: '+354', country: 'Island / Iceland', flag: '🇮🇸', iso: 'IS' },
  { code: '+44', country: 'Storbritannia / UK', flag: '🇬🇧', iso: 'GB' },
  { code: '+49', country: 'Tyskland / Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', country: 'Frankrike / France', flag: '🇫🇷', iso: 'FR' },
  { code: '+34', country: 'Spania / Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+39', country: 'Italia / Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+31', country: 'Nederland / Netherlands', flag: '🇳🇱', iso: 'NL' },
  { code: '+48', country: 'Polen / Poland', flag: '🇵🇱', iso: 'PL' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', iso: 'PT' },
  { code: '+353', country: 'Irland / Ireland', flag: '🇮🇪', iso: 'IE' },
  { code: '+41', country: 'Sveits / Switzerland', flag: '🇨🇭', iso: 'CH' },
  { code: '+43', country: 'Østerrike / Austria', flag: '🇦🇹', iso: 'AT' },
  { code: '+32', country: 'Belgia / Belgium', flag: '🇧🇪', iso: 'BE' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+372', country: 'Estland / Estonia', flag: '🇪🇪', iso: 'EE' },
  { code: '+370', country: 'Litauen / Lithuania', flag: '🇱🇹', iso: 'LT' },
]

export const dialCodeByCode = (code: string): DialCode =>
  dialCodes.find((d) => d.code === code) ?? dialCodes[0]
