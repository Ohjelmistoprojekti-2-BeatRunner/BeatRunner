import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';
import { getAuth, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { router } from 'expo-router';

export default function SettingsScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert('Logged out', 'You have been successfully logged out.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      const credential = EmailAuthProvider.credential(email, password);

      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      Alert.alert('Account Deleted', 'Your account has been successfully removed.');
      router.replace('/login');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'User not found.');
      } else if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Please log in again before deleting your account.');
      } else {
        Alert.alert('Error', 'Failed to delete account. Please try again.');
      }
      console.error(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={globalStyles.sectionTitle}>Change Password</Text>

      <TextInput style={globalStyles.input} placeholder="Enter current password" placeholderTextColor="#888" />
      <TextInput style={globalStyles.input} placeholder="Enter new password" placeholderTextColor="#888" />
      <TextInput style={globalStyles.input} placeholder="Re-enter new password" placeholderTextColor="#888" />

      <TouchableOpacity style={globalStyles.smallButton} onPress={() => { /* TODO: Add functionality */ }}>
        <Text style={globalStyles.buttonText}>Apply</Text>
      </TouchableOpacity>

      <Text style={globalStyles.sectionTitle}>Remove Account</Text>
      <TextInput style={globalStyles.input} placeholder="Enter email" placeholderTextColor="#888" value={email} onChangeText={setEmail}
      />

      <TextInput style={globalStyles.input} placeholder="Enter password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword}
      />

      <TouchableOpacity style={globalStyles.smallButton} onPress={handleDeleteAccount}>
        <Text style={globalStyles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.logoutButton} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}