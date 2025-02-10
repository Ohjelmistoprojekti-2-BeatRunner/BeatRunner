import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

function DrawerTitleLogo(props: any) {
  const titleColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
  return (
    <DrawerContentScrollView {...props}>
      <Text style={[styles.title, { color: titleColor }]}>BeatRunner</Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerTitleLogo {...props} />}>
      <Drawer.Screen name="index" options={{ title: 'Start Running' }} />
      <Drawer.Screen name="highscore" options={{ title: 'Highscore' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="help" options={{ title: 'Help' }} />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
      <Drawer.Screen name="login" options={{ title: 'Login' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});