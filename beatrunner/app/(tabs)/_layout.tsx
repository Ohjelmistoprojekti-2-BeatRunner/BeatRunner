import { auth, db } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { globalStyles } from '@/styles/globalStyles';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function DrawerTitleLogo(props: any) {
  const titleColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        console.log("currentuser: ", currentUser)
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUsername(docSnap.data()?.username || null);
          }
        });

        return () => {
          unsubscribeUserDoc();
        };
      } else {
        setUsername(null);
      }
    });

    return unsubscribeAuth;
  }, []);


  return (
    <DrawerContentScrollView {...props}>
      <Text style={[styles.title, { color: titleColor }]}>BeatRunner</Text>
      {user ? (
        <View>
          <Text style={[globalStyles.contentText, { color: titleColor }]}>Logged in as:</Text>
          <Text style={[globalStyles.contentText, { color: titleColor }]}>
            {username ? username : user.email} 
          </Text>
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
      <Drawer.Screen name="stepcounter" options={{ title: 'Steps' }} />
      <Drawer.Screen name="highscore" options={{ title: 'Highscore' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="help" options={{ title: 'Help' }} />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
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