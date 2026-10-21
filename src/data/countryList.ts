import { PricingRule } from "@/lib/countryPricing";

/**
 * Countries in the Same-As-India / Domestic Parity Tier:
 * India, China, Bangladesh, Sri Lanka, Nepal, Bhutan.
 * These countries receive domestic base pricing without the international $5.00 USD clamp.
 */
export const SAME_AS_INDIA_COUNTRIES = ["IN", "CN", "BD", "LK", "NP", "BT"];

export interface CountryDef {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number; // Multiplier from INR base price
  minPrice: number; // 0 for domestic/same-as-India tier, or minimum in local currency
  isSameAsIndia?: boolean;
}

/**
 * Comprehensive 170+ Country Database with official ISO codes, currencies, symbols,
 * and regional pricing rules.
 */
export const WORLD_COUNTRIES: CountryDef[] = [
  // --- South Asia & Same-As-India Tier (Exempt from US$5 international floor) ---
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹", rate: 1.0, minPrice: 0, isSameAsIndia: true },
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY", symbol: "¥", rate: 0.086, minPrice: 0, isSameAsIndia: true },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", symbol: "৳", rate: 1.40, minPrice: 0, isSameAsIndia: true },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", symbol: "Rs.", rate: 3.55, minPrice: 0, isSameAsIndia: true },
  { code: "NP", name: "Nepal", flag: "🇳🇵", currency: "NPR", symbol: "Rs.", rate: 1.60, minPrice: 0, isSameAsIndia: true },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", currency: "BTN", symbol: "Nu.", rate: 1.0, minPrice: 0, isSameAsIndia: true },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR", symbol: "Rs.", rate: 3.33, minPrice: 0 },

  // --- Major International Economies (US$5 floor or equivalent) ---
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£", rate: 0.038, minPrice: 4.0 },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "CA$", rate: 0.062, minPrice: 7.0 },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$", rate: 0.068, minPrice: 8.0 },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", currency: "NZD", symbol: "NZ$", rate: 0.075, minPrice: 8.5 },

  // --- Eurozone & Western / Northern Europe ---
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "BE", name: "Belgium", flag: "🇧🇪", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "AT", name: "Austria", flag: "🇦🇹", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "IE", name: "Ireland", flag: "🇮🇪", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "PT", name: "Portugal", flag: "🇵🇹", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "GR", name: "Greece", flag: "🇬🇷", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "FI", name: "Finland", flag: "🇫🇮", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "MT", name: "Malta", flag: "🇲🇹", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "EE", name: "Estonia", flag: "🇪🇪", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "LV", name: "Latvia", flag: "🇱🇻", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "HR", name: "Croatia", flag: "🇭🇷", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", currency: "CHF", symbol: "CHF", rate: 0.040, minPrice: 4.5 },
  { code: "SE", name: "Sweden", flag: "🇸🇪", currency: "SEK", symbol: "kr", rate: 0.48, minPrice: 55 },
  { code: "NO", name: "Norway", flag: "🇳🇴", currency: "NOK", symbol: "kr", rate: 0.49, minPrice: 55 },
  { code: "DK", name: "Denmark", flag: "🇩🇰", currency: "DKK", symbol: "kr", rate: 0.31, minPrice: 35 },
  { code: "IS", name: "Iceland", flag: "🇮🇸", currency: "ISK", symbol: "kr", rate: 6.2, minPrice: 700 },
  { code: "PL", name: "Poland", flag: "🇵🇱", currency: "PLN", symbol: "zł", rate: 0.18, minPrice: 20 },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", currency: "CZK", symbol: "Kč", rate: 1.05, minPrice: 120 },
  { code: "HU", name: "Hungary", flag: "🇭🇺", currency: "HUF", symbol: "Ft", rate: 16.5, minPrice: 1800 },
  { code: "RO", name: "Romania", flag: "🇷🇴", currency: "RON", symbol: "lei", rate: 0.21, minPrice: 23 },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", currency: "BGN", symbol: "лв", rate: 0.082, minPrice: 9.0 },

  // --- Middle East & Gulf (GCC) ---
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", symbol: "AED", rate: 0.165, minPrice: 18.0 },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", symbol: "SAR", rate: 0.170, minPrice: 19.0 },
  { code: "QA", name: "Qatar", flag: "🇶🇦", currency: "QAR", symbol: "QAR", rate: 0.164, minPrice: 18.0 },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD", symbol: "KD", rate: 0.014, minPrice: 1.5 },
  { code: "OM", name: "Oman", flag: "🇴🇲", currency: "OMR", symbol: "OMR", rate: 0.017, minPrice: 2.0 },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", currency: "BHD", symbol: "BD", rate: 0.017, minPrice: 2.0 },
  { code: "IL", name: "Israel", flag: "🇮🇱", currency: "ILS", symbol: "₪", rate: 0.16, minPrice: 18.0 },
  { code: "TR", name: "Turkey", flag: "🇹🇷", currency: "TRY", symbol: "₺", rate: 1.50, minPrice: 170 },
  { code: "JO", name: "Jordan", flag: "🇯🇴", currency: "JOD", symbol: "JD", rate: 0.032, minPrice: 3.5 },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "YE", name: "Yemen", flag: "🇾🇪", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },

  // --- East, Southeast & Central Asia ---
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", symbol: "¥", rate: 6.8, minPrice: 750 },
  { code: "KR", name: "South Korea", flag: "🇰🇷", currency: "KRW", symbol: "₩", rate: 62.0, minPrice: 6800 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", symbol: "S$", rate: 0.060, minPrice: 6.8 },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR", symbol: "RM", rate: 0.20, minPrice: 22 },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", currency: "IDR", symbol: "Rp", rate: 720, minPrice: 80000 },
  { code: "TH", name: "Thailand", flag: "🇹🇭", currency: "THB", symbol: "฿", rate: 1.55, minPrice: 175 },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", currency: "VND", symbol: "₫", rate: 1150, minPrice: 125000 },
  { code: "PH", name: "Philippines", flag: "🇵🇭", currency: "PHP", symbol: "₱", rate: 2.6, minPrice: 280 },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", currency: "HKD", symbol: "HK$", rate: 0.35, minPrice: 39 },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", currency: "TWD", symbol: "NT$", rate: 1.45, minPrice: 160 },
  { code: "MO", name: "Macau", flag: "🇲🇴", currency: "MOP", symbol: "MOP$", rate: 0.36, minPrice: 40 },
  { code: "BN", name: "Brunei", flag: "🇧🇳", currency: "BND", symbol: "B$", rate: 0.060, minPrice: 6.8 },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "LA", name: "Laos", flag: "🇱🇦", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", currency: "MMK", symbol: "K", rate: 95.0, minPrice: 10500 },
  { code: "MN", name: "Mongolia", flag: "🇲🇳", currency: "MNT", symbol: "₮", rate: 155, minPrice: 17000 },
  { code: "MV", name: "Maldives", flag: "🇲🇻", currency: "MVR", symbol: "Rf", rate: 0.69, minPrice: 75 },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", currency: "KZT", symbol: "₸", rate: 22.0, minPrice: 2400 },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", currency: "UZS", symbol: "soʻm", rate: 580, minPrice: 64000 },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", currency: "KGS", symbol: "сом", rate: 3.9, minPrice: 430 },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", currency: "TJS", symbol: "SM", rate: 0.48, minPrice: 53 },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", currency: "TMT", symbol: "T", rate: 0.16, minPrice: 18 },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", currency: "AZN", symbol: "₼", rate: 0.076, minPrice: 8.5 },
  { code: "GE", name: "Georgia", flag: "🇬🇪", currency: "GEL", symbol: "₾", rate: 0.12, minPrice: 13.5 },
  { code: "AM", name: "Armenia", flag: "🇦🇲", currency: "AMD", symbol: "֏", rate: 17.5, minPrice: 1950 },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },

  // --- Latin America & Caribbean ---
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", symbol: "R$", rate: 0.25, minPrice: 28 },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN", symbol: "MX$", rate: 0.88, minPrice: 98 },
  { code: "AR", name: "Argentina", flag: "🇦🇷", currency: "ARS", symbol: "$", rate: 45.0, minPrice: 5000 },
  { code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", symbol: "$", rate: 185, minPrice: 20000 },
  { code: "CL", name: "Chile", flag: "🇨🇱", currency: "CLP", symbol: "$", rate: 42.0, minPrice: 4700 },
  { code: "PE", name: "Peru", flag: "🇵🇪", currency: "PEN", symbol: "S/", rate: 0.17, minPrice: 19 },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", currency: "UYU", symbol: "$U", rate: 1.85, minPrice: 200 },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", currency: "PYG", symbol: "₲", rate: 350, minPrice: 38000 },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", currency: "BOB", symbol: "Bs.", rate: 0.31, minPrice: 35 },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", currency: "CRC", symbol: "₡", rate: 23.0, minPrice: 2500 },
  { code: "PA", name: "Panama", flag: "🇵🇦", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", currency: "DOP", symbol: "RD$", rate: 2.7, minPrice: 300 },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", currency: "GTQ", symbol: "Q", rate: 0.35, minPrice: 39 },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "HN", name: "Honduras", flag: "🇭🇳", currency: "HNL", symbol: "L", rate: 1.1, minPrice: 125 },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", currency: "NIO", symbol: "C$", rate: 1.65, minPrice: 180 },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", currency: "JMD", symbol: "J$", rate: 7.0, minPrice: 780 },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", currency: "TTD", symbol: "TT$", rate: 0.30, minPrice: 34 },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", currency: "BSD", symbol: "B$", rate: 0.045, minPrice: 5.0 },
  { code: "BB", name: "Barbados", flag: "🇧🇧", currency: "BBD", symbol: "Bds$", rate: 0.090, minPrice: 10.0 },
  { code: "BZ", name: "Belize", flag: "🇧🇿", currency: "BZD", symbol: "BZ$", rate: 0.090, minPrice: 10.0 },
  { code: "GY", name: "Guyana", flag: "🇬🇾", currency: "GYD", symbol: "G$", rate: 9.4, minPrice: 1050 },
  { code: "SR", name: "Suriname", flag: "🇸🇷", currency: "SRD", symbol: "$", rate: 1.6, minPrice: 175 },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "HT", name: "Haiti", flag: "🇭🇹", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },

  // --- Africa ---
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", symbol: "R", rate: 0.80, minPrice: 90 },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", symbol: "₦", rate: 68.0, minPrice: 7500 },
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP", symbol: "E£", rate: 2.2, minPrice: 245 },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", symbol: "KSh", rate: 5.8, minPrice: 650 },
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS", symbol: "GH₵", rate: 0.68, minPrice: 75 },
  { code: "MA", name: "Morocco", flag: "🇲🇦", currency: "MAD", symbol: "DH", rate: 0.44, minPrice: 50 },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", currency: "DZD", symbol: "DA", rate: 6.0, minPrice: 670 },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", currency: "TND", symbol: "DT", rate: 0.14, minPrice: 15.5 },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", currency: "ETB", symbol: "Br", rate: 5.4, minPrice: 600 },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", currency: "TZS", symbol: "TSh", rate: 118, minPrice: 13000 },
  { code: "UG", name: "Uganda", flag: "🇺🇬", currency: "UGX", symbol: "USh", rate: 165, minPrice: 18500 },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", currency: "RWF", symbol: "RF", rate: 61, minPrice: 6800 },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", currency: "MUR", symbol: "Rs", rate: 2.1, minPrice: 230 },
  { code: "SN", name: "Senegal", flag: "🇸🇳", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", currency: "XAF", symbol: "FCFA", rate: 27.5, minPrice: 3000 },
  { code: "AO", name: "Angola", flag: "🇦🇴", currency: "AOA", symbol: "Kz", rate: 41, minPrice: 4600 },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", currency: "MZN", symbol: "MT", rate: 2.9, minPrice: 320 },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", currency: "ZMW", symbol: "K", rate: 1.25, minPrice: 140 },
  { code: "BW", name: "Botswana", flag: "🇧🇼", currency: "BWP", symbol: "P", rate: 0.61, minPrice: 68 },
  { code: "NA", name: "Namibia", flag: "🇳🇦", currency: "NAD", symbol: "N$", rate: 0.80, minPrice: 90 },
  { code: "SD", name: "Sudan", flag: "🇸🇩", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "LY", name: "Libya", flag: "🇱🇾", currency: "LYD", symbol: "LD", rate: 0.22, minPrice: 24 },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", currency: "MGA", symbol: "Ar", rate: 205, minPrice: 23000 },
  { code: "CD", name: "DR Congo", flag: "🇨🇩", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "CG", name: "Republic of the Congo", flag: "🇨🇬", currency: "XAF", symbol: "FCFA", rate: 27.5, minPrice: 3000 },
  { code: "GA", name: "Gabon", flag: "🇬🇦", currency: "XAF", symbol: "FCFA", rate: 27.5, minPrice: 3000 },
  { code: "GN", name: "Guinea", flag: "🇬🇳", currency: "GNF", symbol: "FG", rate: 385, minPrice: 43000 },
  { code: "ML", name: "Mali", flag: "🇲🇱", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "BJ", name: "Benin", flag: "🇧🇯", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "TG", name: "Togo", flag: "🇹🇬", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "NE", name: "Niger", flag: "🇳🇪", currency: "XOF", symbol: "CFA", rate: 27.5, minPrice: 3000 },
  { code: "MW", name: "Malawi", flag: "🇲🇼", currency: "MWK", symbol: "MK", rate: 78, minPrice: 8700 },
  { code: "SO", name: "Somalia", flag: "🇸🇴", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", currency: "SLE", symbol: "Le", rate: 1.0, minPrice: 110 },
  { code: "LR", name: "Liberia", flag: "🇱🇷", currency: "LRD", symbol: "L$", rate: 8.8, minPrice: 980 },
  { code: "GM", name: "Gambia", flag: "🇬🇲", currency: "GMD", symbol: "D", rate: 3.1, minPrice: 350 },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", currency: "SCR", symbol: "SR", rate: 0.63, minPrice: 70 },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻", currency: "CVE", symbol: "Esc", rate: 4.6, minPrice: 510 },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", currency: "SZL", symbol: "E", rate: 0.80, minPrice: 90 },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", currency: "LSL", symbol: "M", rate: 0.80, minPrice: 90 },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", currency: "MRU", symbol: "UM", rate: 1.8, minPrice: 200 },

  // --- Oceania & Pacific ---
  { code: "FJ", name: "Fiji", flag: "🇫🇯", currency: "FJD", symbol: "FJ$", rate: 0.10, minPrice: 11.5 },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", currency: "PGK", symbol: "K", rate: 0.18, minPrice: 20.0 },
  { code: "WS", name: "Samoa", flag: "🇼🇸", currency: "WST", symbol: "WS$", rate: 0.12, minPrice: 14.0 },
  { code: "TO", name: "Tonga", flag: "🇹🇴", currency: "TOP", symbol: "T$", rate: 0.11, minPrice: 12.0 },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", currency: "VUV", symbol: "VT", rate: 5.4, minPrice: 600 },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧", currency: "SBD", symbol: "SI$", rate: 0.38, minPrice: 42 },
  { code: "NC", name: "New Caledonia", flag: "🇳🇨", currency: "XPF", symbol: "F", rate: 5.0, minPrice: 550 },
  { code: "PF", name: "French Polynesia", flag: "🇵🇫", currency: "XPF", symbol: "F", rate: 5.0, minPrice: 550 },
  { code: "GU", name: "Guam", flag: "🇬🇺", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },

  // --- Eastern Europe & Other European Nations ---
  { code: "AL", name: "Albania", flag: "🇦🇱", currency: "ALL", symbol: "L", rate: 4.1, minPrice: 460 },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", currency: "BAM", symbol: "KM", rate: 0.082, minPrice: 9.0 },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰", currency: "MKD", symbol: "ден", rate: 2.6, minPrice: 290 },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", currency: "EUR", symbol: "€", rate: 0.042, minPrice: 4.5 },
  { code: "RS", name: "Serbia", flag: "🇷🇸", currency: "RSD", symbol: "din.", rate: 4.9, minPrice: 550 },
  { code: "MD", name: "Moldova", flag: "🇲🇩", currency: "MDL", symbol: "L", rate: 0.80, minPrice: 90 },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", currency: "UAH", symbol: "₴", rate: 1.85, minPrice: 210 },
  { code: "BY", name: "Belarus", flag: "🇧🇾", currency: "BYN", symbol: "Br", rate: 0.15, minPrice: 16.5 },
  { code: "RU", name: "Russia", flag: "🇷🇺", currency: "RUB", symbol: "₽", rate: 4.2, minPrice: 470 },

  // --- Default International Fallback ---
  { code: "DEFAULT_INTL", name: "Rest of the World (International)", flag: "🌍", currency: "USD", symbol: "$", rate: 0.045, minPrice: 5.0 },
];

/**
 * Generate full PricingRule array for all 170+ countries
 */
export const generateWorldPricingRules = (): PricingRule[] => {
  return WORLD_COUNTRIES.map((c) => ({
    id: `rule-${c.code.toLowerCase()}`,
    countryCode: c.code,
    countryName: c.name,
    flag: c.flag,
    currency: c.currency,
    currencySymbol: c.symbol,
    minPrice: c.minPrice,
    fixedRateFromINR: c.rate,
    isInternational: !c.isSameAsIndia && c.code !== "IN",
    isEnabled: true,
  }));
};
