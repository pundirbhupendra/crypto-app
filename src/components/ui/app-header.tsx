import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle ? (
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
    paddingBottom: Spacing.three,
  },
  subtitle: {
    maxWidth: 520,
  },
});
