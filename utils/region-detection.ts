import * as Localization from 'expo-localization';

export type Region = 'EU' | 'US_CA' | 'ZA' | 'OTHER';

export interface RegionInfo {
  region: Region;
  countryCode: string;
  countryName: string;
}

const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'UK'
];

export function detectRegion(): RegionInfo {
  try {
    const locales = Localization.getLocales();
    const primaryLocale = locales[0];
    const countryCode = primaryLocale?.regionCode?.toUpperCase() || 'US';

    let region: Region = 'OTHER';
    
    if (EU_COUNTRIES.includes(countryCode)) {
      region = 'EU';
    } else if (countryCode === 'US' || countryCode === 'CA') {
      region = 'US_CA';
    } else if (countryCode === 'ZA') {
      region = 'ZA';
    }

    console.log('[RegionDetection] Detected region:', { region, countryCode });

    return {
      region,
      countryCode,
      countryName: primaryLocale?.regionCode || 'Unknown',
    };
  } catch (error) {
    console.error('[RegionDetection] Error detecting region:', error);
    return {
      region: 'OTHER',
      countryCode: 'US',
      countryName: 'Unknown',
    };
  }
}

export function getRegionName(region: Region): string {
  switch (region) {
    case 'EU':
      return 'European Union';
    case 'US_CA':
      return 'United States / Canada';
    case 'ZA':
      return 'South Africa';
    default:
      return 'International';
  }
}
