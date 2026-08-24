import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function StateView({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <ThemedText type="smallBold">{actionLabel}</ThemedText>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.four,
    padding: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
