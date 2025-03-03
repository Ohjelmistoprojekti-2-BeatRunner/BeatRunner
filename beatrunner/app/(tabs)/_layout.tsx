import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { globalStyles } from '@/styles/globalStyles';

function DrawerTitleLogo(props: any) {
  const titleColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <Text style={[styles.title, { color: titleColor }]}>BeatRunner</Text>
      {user ? (
        <View>
          <Text style={[globalStyles.contentText, { color: titleColor }]}>Logged in as:</Text>
          <Text style={[globalStyles.contentText, { color: titleColor }]}>{user.email}</Text>
        </View>
      ) : (
        <Text style={[globalStyles.contentText, { color: titleColor }]}>Not logged in</Text>
      )}
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
      <Drawer.Screen name="register" options={{ title: 'Register' }} />
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