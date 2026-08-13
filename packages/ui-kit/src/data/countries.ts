/**
 * Country metadata for PhoneInput — ISO code, display name, emoji flag, E.164
 * calling code, and the expected national-number format.
 *
 * `pattern` is an anchored regex for the national number only: no calling code,
 * digits only. Countries that share a calling code (+1, +44, +7…) each keep
 * their own pattern, so validation follows the country the user picked.
 */

export type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  pattern?: string;
};

export const COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93', pattern: '^[7]\\d{8}$' },
  { code: 'AX', name: 'Åland Islands', flag: '🇦🇽', dialCode: '+35818', pattern: '^[1-9]\\d{5,7}$' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355', pattern: '^[6-9]\\d{7}$' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', pattern: '^[5-7]\\d{8}$' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸', dialCode: '+1684', pattern: '^\\d{7}$' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', dialCode: '+376', pattern: '^\\d{6}$' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', pattern: '^[9]\\d{8}$' },
  { code: 'AI', name: 'Anguilla', flag: '🇦🇮', dialCode: '+1264', pattern: '^\\d{7}$' },
  { code: 'AG', name: 'Antigua & Barbuda', flag: '🇦🇬', dialCode: '+1268', pattern: '^\\d{7}$' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', pattern: '^\\d{10}$' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374', pattern: '^[7-9]\\d{7}$' },
  { code: 'AW', name: 'Aruba', flag: '🇦🇼', dialCode: '+297', pattern: '^[5-9]\\d{6}$' },
  { code: 'AC', name: 'Ascension Island', flag: '🇦🇨', dialCode: '+247', pattern: '^\\d{7}$' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', pattern: '^(4\\d{8}|[2378]\\d{8,9})$' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', pattern: '^[1-9]\\d{7,12}$' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', pattern: '^[4-7]\\d{8}$' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', dialCode: '+1242', pattern: '^\\d{7}$' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', pattern: '^\\d{8}$' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', pattern: '^[1-9]\\d{9}$' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', dialCode: '+1246', pattern: '^\\d{7}$' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375', pattern: '^[1-9]\\d{8}$' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', pattern: '^[1-9]\\d{8}$' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', dialCode: '+501', pattern: '^[6]\\d{6}$' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229', pattern: '^[9]\\d{7}$' },
  { code: 'BM', name: 'Bermuda', flag: '🇧🇲', dialCode: '+1441', pattern: '^\\d{7}$' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975', pattern: '^[1-8]\\d{6}$' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591', pattern: '^[6-7]\\d{7}$' },
  { code: 'BA', name: 'Bosnia & Herzegovina', flag: '🇧🇦', dialCode: '+387', pattern: '^[6]\\d{7}$' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', pattern: '^[7]\\d{7}$' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', pattern: '^\\d{10,11}$' },
  { code: 'IO', name: 'British Indian Ocean Territory', flag: '🇮🇴', dialCode: '+246', pattern: '^\\d{7}$' },
  { code: 'VG', name: 'British Virgin Islands', flag: '🇻🇬', dialCode: '+1284', pattern: '^\\d{7}$' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673', pattern: '^[7-8]\\d{6}$' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359', pattern: '^[8-9]\\d{7}$' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', pattern: '^[7]\\d{7}$' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', pattern: '^[7-8]\\d{7}$' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', dialCode: '+855', pattern: '^[1-9]\\d{7,8}$' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', pattern: '^[6-9]\\d{8}$' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', pattern: '^\\d{10}$' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238', pattern: '^[9]\\d{6}$' },
  { code: 'BQ', name: 'Caribbean Netherlands', flag: '🇧🇶', dialCode: '+599', pattern: '^[3-7]\\d{6}$' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾', dialCode: '+1345', pattern: '^\\d{7}$' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236', pattern: '^[7]\\d{7}$' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235', pattern: '^[6-9]\\d{7}$' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', pattern: '^[9]\\d{8}$' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', pattern: '^1\\d{10}$' },
  { code: 'CX', name: 'Christmas Island', flag: '🇨🇽', dialCode: '+61', pattern: '^(4\\d{8}|[2378]\\d{8,9})$' },
  { code: 'CC', name: 'Cocos (Keeling) Islands', flag: '🇨🇨', dialCode: '+61', pattern: '^(4\\d{8}|[2378]\\d{8,9})$' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', pattern: '^[3]\\d{9}$' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269', pattern: '^[7]\\d{6}$' },
  { code: 'CG', name: 'Congo - Brazzaville', flag: '🇨🇬', dialCode: '+242', pattern: '^[0]\\d{8}$' },
  { code: 'CD', name: 'Congo - Kinshasa', flag: '🇨🇩', dialCode: '+243', pattern: '^[8-9]\\d{8}$' },
  { code: 'CK', name: 'Cook Islands', flag: '🇨🇰', dialCode: '+682', pattern: '^[3-7]\\d{4}$' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', pattern: '^[5-8]\\d{7}$' },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', dialCode: '+225', pattern: '^[0-9]\\d{7}$' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385', pattern: '^[9]\\d{8}$' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', dialCode: '+53', pattern: '^[5]\\d{7}$' },
  { code: 'CW', name: 'Curaçao', flag: '🇨🇼', dialCode: '+599', pattern: '^9\\d{7}$' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357', pattern: '^[9]\\d{7}$' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿', dialCode: '+420', pattern: '^[1-9]\\d{8}$' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', pattern: '^[1-9]\\d{7}$' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', pattern: '^[7-8]\\d{7}$' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', dialCode: '+1767', pattern: '^\\d{7}$' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', dialCode: '+1809', pattern: '^\\d{7}$' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593', pattern: '^[9]\\d{8}$' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', pattern: '^[1-9]\\d{8,9}$' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503', pattern: '^[6-7]\\d{7}$' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240', pattern: '^[9]\\d{8}$' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291', pattern: '^[1-8]\\d{6}$' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372', pattern: '^[5-8]\\d{7}$' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268', pattern: '^[7]\\d{7}$' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', pattern: '^[9]\\d{8}$' },
  { code: 'FK', name: 'Falkland Islands', flag: '🇫🇰', dialCode: '+500', pattern: '^\\d{5}$' },
  { code: 'FO', name: 'Faroe Islands', flag: '🇫🇴', dialCode: '+298', pattern: '^\\d{6}$' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679', pattern: '^[3-9]\\d{6}$' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', pattern: '^[1-9]\\d{8}$' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', pattern: '^[1-9]\\d{8}$' },
  { code: 'GF', name: 'French Guiana', flag: '🇬🇫', dialCode: '+594', pattern: '^[6-7]\\d{8}$' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫', dialCode: '+689', pattern: '^[8]\\d{7}$' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', pattern: '^[0-7]\\d{7}$' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', pattern: '^[3-9]\\d{6}$' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995', pattern: '^[5]\\d{8}$' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', pattern: '^[1-9]\\d{7,11}$' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', pattern: '^[2-5]\\d{8}$' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮', dialCode: '+350', pattern: '^[5-6]\\d{7}$' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', pattern: '^[6-9]\\d{9}$' },
  { code: 'GL', name: 'Greenland', flag: '🇬🇱', dialCode: '+299', pattern: '^\\d{6}$' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', dialCode: '+1473', pattern: '^\\d{7}$' },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵', dialCode: '+590', pattern: '^[6-7]\\d{8}$' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺', dialCode: '+1671', pattern: '^\\d{7}$' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502', pattern: '^[2-7]\\d{7}$' },
  { code: 'GG', name: 'Guernsey', flag: '🇬🇬', dialCode: '+44', pattern: '^7\\d{9}$' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', pattern: '^[6-7]\\d{7}$' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245', pattern: '^[9]\\d{6}$' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', dialCode: '+592', pattern: '^[2-7]\\d{6}$' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', dialCode: '+509', pattern: '^[3-4]\\d{7}$' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504', pattern: '^[3-9]\\d{7}$' },
  { code: 'HK', name: 'Hong Kong SAR China', flag: '🇭🇰', dialCode: '+852', pattern: '^[2-9]\\d{7}$' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', pattern: '^[2-7]\\d{8}$' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', pattern: '^[6-8]\\d{6}$' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', pattern: '^[6-9]\\d{9}$' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', pattern: '^[8]\\d{9,11}$' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', pattern: '^[9]\\d{9}$' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964', pattern: '^[7]\\d{8}$' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', pattern: '^[8]\\d{8}$' },
  { code: 'IM', name: 'Isle of Man', flag: '🇮🇲', dialCode: '+44', pattern: '^7\\d{9}$' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', pattern: '^[5-7]\\d{8}$' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', pattern: '^[3]\\d{8,9}$' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', dialCode: '+1876', pattern: '^\\d{7}$' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', pattern: '^[1-9]\\d{8,9}$' },
  { code: 'JE', name: 'Jersey', flag: '🇯🇪', dialCode: '+44', pattern: '^7\\d{9}$' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', pattern: '^[7]\\d{8}$' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', pattern: '^\\d{10}$' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', pattern: '^[7]\\d{8}$' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', dialCode: '+686', pattern: '^\\d{5}$' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', pattern: '^[5-9]\\d{7}$' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996', pattern: '^[5-9]\\d{8}$' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856', pattern: '^[2]\\d{7,8}$' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371', pattern: '^[2-6]\\d{7}$' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', pattern: '^[7]\\d{7}$' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', pattern: '^[5-6]\\d{7}$' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', pattern: '^[7]\\d{7}$' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218', pattern: '^[9]\\d{8}$' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', dialCode: '+423', pattern: '^\\d{7}$' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370', pattern: '^[6]\\d{7}$' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', pattern: '^[6-9]\\d{7}$' },
  { code: 'MO', name: 'Macao SAR China', flag: '🇲🇴', dialCode: '+853', pattern: '^[6]\\d{7}$' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', pattern: '^[3]\\d{8}$' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', pattern: '^[7-9]\\d{8}$' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', pattern: '^[1]\\d{8,9}$' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960', pattern: '^[7-9]\\d{6}$' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', pattern: '^[6-9]\\d{7}$' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356', pattern: '^[7-9]\\d{7}$' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', dialCode: '+692', pattern: '^\\d{7}$' },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶', dialCode: '+596', pattern: '^[6-7]\\d{8}$' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', pattern: '^[2-4]\\d{7}$' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', pattern: '^[5]\\d{7}$' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹', dialCode: '+262', pattern: '^[67]\\d{8}$' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', pattern: '^\\d{10}$' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', dialCode: '+691', pattern: '^\\d{7}$' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373', pattern: '^[6-7]\\d{7}$' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377', pattern: '^[6]\\d{7}$' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976', pattern: '^[8-9]\\d{7}$' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382', pattern: '^[6-7]\\d{7}$' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸', dialCode: '+1664', pattern: '^\\d{7}$' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', pattern: '^[5-7]\\d{8}$' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', pattern: '^[8]\\d{8}$' },
  { code: 'MM', name: 'Myanmar (Burma)', flag: '🇲🇲', dialCode: '+95', pattern: '^[9]\\d{7,9}$' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', pattern: '^[8]\\d{8}$' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', dialCode: '+674', pattern: '^[5-6]\\d{6}$' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', pattern: '^[9]\\d{9}$' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', pattern: '^[6]\\d{8}$' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', dialCode: '+687', pattern: '^\\d{6}$' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', pattern: '^[2-9]\\d{7,9}$' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505', pattern: '^[8]\\d{7}$' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', pattern: '^[8-9]\\d{7}$' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', pattern: '^[7-9]\\d{9}$' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺', dialCode: '+683', pattern: '^\\d{4}$' },
  { code: 'NF', name: 'Norfolk Island', flag: '🇳🇫', dialCode: '+672', pattern: '^[1-3]\\d{5}$' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵', dialCode: '+850', pattern: '^[1-9]\\d{7,8}$' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', dialCode: '+389', pattern: '^[7]\\d{7}$' },
  { code: 'MP', name: 'Northern Mariana Islands', flag: '🇲🇵', dialCode: '+1670', pattern: '^\\d{7}$' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', pattern: '^[4-9]\\d{7}$' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', pattern: '^[9]\\d{7}$' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', pattern: '^[3]\\d{9}$' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', dialCode: '+680', pattern: '^\\d{7}$' },
  { code: 'PS', name: 'Palestinian Territories', flag: '🇵🇸', dialCode: '+970', pattern: '^[5-9]\\d{8}$' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507', pattern: '^[6-7]\\d{7}$' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675', pattern: '^[7]\\d{7}$' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595', pattern: '^[9]\\d{8}$' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', pattern: '^[9]\\d{8}$' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', pattern: '^[9]\\d{9}$' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', pattern: '^[5-8]\\d{8}$' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', pattern: '^[9]\\d{8}$' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', dialCode: '+1787', pattern: '^\\d{7}$' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', pattern: '^[3-7]\\d{7}$' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪', dialCode: '+262', pattern: '^[6-7]\\d{8}$' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', pattern: '^[7]\\d{8}$' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', pattern: '^\\d{10}$' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', pattern: '^[7]\\d{8}$' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', dialCode: '+685', pattern: '^\\d{5,7}$' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', dialCode: '+378', pattern: '^[3-5]\\d{7}$' },
  { code: 'ST', name: 'São Tomé & Príncipe', flag: '🇸🇹', dialCode: '+239', pattern: '^[9]\\d{6}$' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', pattern: '^[5]\\d{8}$' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', pattern: '^[7]\\d{8}$' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381', pattern: '^[6]\\d{8}$' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', pattern: '^[4]\\d{6}$' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', pattern: '^[7-8]\\d{7}$' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', pattern: '^[8-9]\\d{7}$' },
  { code: 'SX', name: 'Sint Maarten', flag: '🇸🇽', dialCode: '+1721', pattern: '^\\d{7}$' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421', pattern: '^[9]\\d{8}$' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386', pattern: '^[3-7]\\d{7}$' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', dialCode: '+677', pattern: '^[7-9]\\d{6}$' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252', pattern: '^[6-7]\\d{7,8}$' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', pattern: '^[1-8]\\d{8}$' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', pattern: '^[1]\\d{8,9}$' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211', pattern: '^9\\d{8}$' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', pattern: '^[6-9]\\d{8}$' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', pattern: '^[7]\\d{8}$' },
  { code: 'BL', name: 'St. Barthélemy', flag: '🇧🇱', dialCode: '+590', pattern: '^[6-7]\\d{8}$' },
  { code: 'SH', name: 'St. Helena', flag: '🇸🇭', dialCode: '+290', pattern: '^\\d{4}$' },
  { code: 'KN', name: 'St. Kitts & Nevis', flag: '🇰🇳', dialCode: '+1869', pattern: '^\\d{7}$' },
  { code: 'LC', name: 'St. Lucia', flag: '🇱🇨', dialCode: '+1758', pattern: '^\\d{7}$' },
  { code: 'MF', name: 'St. Martin', flag: '🇲🇫', dialCode: '+590', pattern: '^[6-7]\\d{8}$' },
  { code: 'PM', name: 'St. Pierre & Miquelon', flag: '🇵🇲', dialCode: '+508', pattern: '^[4-5]\\d{5}$' },
  { code: 'VC', name: 'St. Vincent & Grenadines', flag: '🇻🇨', dialCode: '+1784', pattern: '^\\d{7}$' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249', pattern: '^[9]\\d{8}$' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', dialCode: '+597', pattern: '^[6-8]\\d{6}$' },
  { code: 'SJ', name: 'Svalbard & Jan Mayen', flag: '🇸🇯', dialCode: '+47', pattern: '^[4-9]\\d{7}$' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', pattern: '^[7]\\d{8}$' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', pattern: '^[7-9]\\d{8}$' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963', pattern: '^[9]\\d{8}$' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', pattern: '^[9]\\d{8}$' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992', pattern: '^[9]\\d{8}$' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', pattern: '^[6-7]\\d{8}$' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', pattern: '^[8-9]\\d{8}$' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱', dialCode: '+670', pattern: '^[7]\\d{7}$' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', pattern: '^[9]\\d{7}$' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰', dialCode: '+690', pattern: '^\\d{4}$' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', dialCode: '+676', pattern: '^\\d{5}$' },
  { code: 'TT', name: 'Trinidad & Tobago', flag: '🇹🇹', dialCode: '+1868', pattern: '^\\d{7}$' },
  { code: 'TA', name: 'Tristan da Cunha', flag: '🇹🇦', dialCode: '+290', pattern: '^\\d{4}$' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', pattern: '^[2-9]\\d{7}$' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷', dialCode: '+90', pattern: '^[1-9]\\d{9}$' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993', pattern: '^[6]\\d{7}$' },
  { code: 'TC', name: 'Turks & Caicos Islands', flag: '🇹🇨', dialCode: '+1649', pattern: '^\\d{7}$' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', dialCode: '+688', pattern: '^\\d{5}$' },
  { code: 'VI', name: 'U.S. Virgin Islands', flag: '🇻🇮', dialCode: '+1340', pattern: '^\\d{7}$' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', pattern: '^[7]\\d{8}$' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', pattern: '^[3-9]\\d{8}$' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', pattern: '^[5]\\d{8}$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', pattern: '^7\\d{9}$' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', pattern: '^\\d{10}$' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', pattern: '^[2-9]\\d{7}$' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998', pattern: '^[3-9]\\d{8}$' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', dialCode: '+678', pattern: '^\\d{5,7}$' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦', dialCode: '+39', pattern: '^3\\d{8,9}$' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58', pattern: '^[24]\\d{9}$' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', pattern: '^\\d{9,10}$' },
  { code: 'WF', name: 'Wallis & Futuna', flag: '🇼🇫', dialCode: '+681', pattern: '^\\d{6}$' },
  { code: 'EH', name: 'Western Sahara', flag: '🇪🇭', dialCode: '+212', pattern: '^[5-7]\\d{8}$' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967', pattern: '^7\\d{8}$' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', pattern: '^[79]\\d{8}$' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', pattern: '^7\\d{8}$' },
];

/** Codes surfaced above the full list in PhoneInput's picker. */
export const DEFAULT_FAVORITES = ['FR', 'MA', 'TN', 'DZ', 'BE', 'ES', 'GB', 'DE', 'US'];

const MIN_NATIONAL_DIGITS = 6;
const MAX_NATIONAL_DIGITS = 15;

/** Dial codes longest-first, so `+35818` wins over `+358` when splitting. */
const BY_DIAL_CODE_LENGTH = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

export function digitsOnly(value: string | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

export function findCountry(code: string | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code);
}

/**
 * Resolves a calling code to a country. Several countries share one code, so
 * favorites win the tie (`+1` → United States, not the first match alphabetically).
 */
export function findCountryByDialCode(dialCode: string | undefined): Country | undefined {
  if (!dialCode) return undefined;
  const normalized = dialCode.startsWith('+') ? dialCode : `+${digitsOnly(dialCode)}`;
  const matches = COUNTRIES.filter((c) => c.dialCode === normalized);
  if (matches.length === 0) return undefined;
  return matches.find((c) => DEFAULT_FAVORITES.includes(c.code)) ?? matches[0];
}

/**
 * Splits a stored phone string into the country it belongs to and the national
 * number. Accepts E.164 (`+212650112233`), loosely formatted input
 * (`+212 650-11-22-33`), and bare national numbers, which fall back to
 * `fallbackCountryCode`.
 */
export function splitPhoneNumber(
  value: string | undefined,
  fallbackCountryCode?: string,
): { country: Country | undefined; nationalNumber: string } {
  const fallback = findCountry(fallbackCountryCode);
  if (!value) return { country: fallback, nationalNumber: '' };

  const normalized = value.trim().startsWith('+')
    ? `+${digitsOnly(value)}`
    : digitsOnly(value);

  if (!normalized.startsWith('+')) {
    return { country: fallback, nationalNumber: normalized };
  }

  const match = BY_DIAL_CODE_LENGTH.find((c) => normalized.startsWith(c.dialCode));
  if (!match) return { country: fallback, nationalNumber: normalized.slice(1) };

  const sameCode = findCountryByDialCode(match.dialCode) ?? match;
  return { country: sameCode, nationalNumber: normalized.slice(match.dialCode.length) };
}

/** Joins a country and a national number back into an E.164 string. */
export function formatE164(country: Country | undefined, nationalNumber: string): string {
  return `${country?.dialCode ?? ''}${digitsOnly(nationalNumber)}`;
}

/**
 * Checks a national number against its country's expected format. An empty
 * number is treated as valid — emptiness is a `required` concern, not a format one.
 */
export function isValidNationalNumber(
  country: Country | undefined,
  nationalNumber: string,
): boolean {
  const digits = digitsOnly(nationalNumber);
  if (!digits) return true;

  if (country?.pattern) {
    try {
      return new RegExp(country.pattern).test(digits);
    } catch {
      return true;
    }
  }

  return digits.length >= MIN_NATIONAL_DIGITS && digits.length <= MAX_NATIONAL_DIGITS;
}
