import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import {
  PhoneInput,
  Text,
  formatE164,
  findCountry,
  isValidNationalNumber,
  splitPhoneNumber,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

export default function PhoneInputScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'PhoneInput' }} />
      <PhoneInputBody />
    </ScrollView>
  );
}

export function PhoneInputBody() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('FR');
  const [stored, setStored] = useState('+212650112233');

  const parsed = splitPhoneNumber(stored, 'MA');
  const isValid = isValidNationalNumber(findCountry(country), phone);

  return (
    <>
      <View style={styles.section}>
        <Text variant="subtitle">Basic PhoneInput</Text>
        <Text variant="body" tone="secondary">
          International phone input with country selector. The field holds the national
          number; the country is separate.
        </Text>
        <PhoneInput
          label="Phone number"
          placeholder="6 12 34 56 78"
          value={phone}
          onChangeText={setPhone}
          countryCode={country}
          onCountryChange={setCountry}
          error={isValid ? undefined : 'Invalid phone number'}
        />
        <Text variant="caption" tone="brand">
          E.164: {formatE164(findCountry(country), phone) || '—'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Single stored value</Text>
        <Text variant="body" tone="secondary">
          Backends usually store one string. Split it on the way in, join it on the way out.
        </Text>
        <PhoneInput
          label="Phone number"
          value={parsed.nationalNumber}
          countryCode={parsed.country?.code}
          onChangeText={(next) => setStored(formatE164(parsed.country, next))}
          onCountryChange={(code) => setStored(formatE164(findCountry(code), parsed.nationalNumber))}
        />
        <Text variant="caption" tone="secondary">
          Stored: {stored || '—'} · {parsed.country?.name ?? 'unknown country'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Default country</Text>
        <PhoneInput label="US phone" defaultCountry="US" value={phone} onChangeText={setPhone} />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Pinned countries</Text>
        <Text variant="body" tone="secondary">
          `favorites` controls what sits above the full list in the picker.
        </Text>
        <PhoneInput
          label="Phone number"
          defaultCountry="MA"
          favorites={['MA', 'FR', 'ES']}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <PhoneInput label="Disabled" disabled value="0612345678" />
        <PhoneInput label="With error" error="Invalid phone number" value="123" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: spacing[4],
    gap: spacing[6],
  },
  section: {
    gap: spacing[2],
  },
});
