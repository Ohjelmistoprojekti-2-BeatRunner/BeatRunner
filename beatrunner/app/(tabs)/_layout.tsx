import { useUserContext } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { globalStyles } from '@/styles/globalStyles';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function DrawerTitleLogo(props: any) {
    const titleColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
    const { user, userData, loading } = useUserContext();



    if (loading) {
        return null;
    }

    //shows how is logged in if logged in
    return (
        <DrawerContentScrollView {...props}>
            <Text style={[styles.title, { color: titleColor }]}>BeatRunner</Text>
            {user ? (
                <View>
                    <Text style={[globalStyles.contentText,{ color: titleColor }]}>Logged in as:</Text>
                    <Text style={[globalStyles.contentText,{ color: titleColor }]}>
                        {userData?.username || user.email}
                    </Text>
                </View>
            ) : (
                <Text style={[globalStyles.contentText,{ color: titleColor }]}>Not logged in</Text>
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