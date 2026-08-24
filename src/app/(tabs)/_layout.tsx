import { Tabs } from 'expo-router';
import { Image, useColorScheme, type ColorValue } from 'react-native';

import { Colors } from '@/constants/theme';

function TabIcon({ source, color }: { source: number; color: ColorValue }) {
  return <Image source={source} style={{ height: 24, tintColor: color, width: 24 }} />;
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color }) => (
            <TabIcon source={require('@/assets/images/tabIcons/home.png')} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <TabIcon source={require('@/assets/images/tabIcons/explore.png')} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color }) => (
            <TabIcon source={require('@/assets/images/tabIcons/home.png')} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
