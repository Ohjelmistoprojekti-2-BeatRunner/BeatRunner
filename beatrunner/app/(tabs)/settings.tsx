import { auth, db } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleLogout = async () => {
    try {

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

  const handleChangeUsername = async () => {
    // Check input
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Please enter a new username.');
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      await updateProfile(user, {
        displayName: newUsername.trim(),
      });

      await user.reload();

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { username: newUsername.trim() });

      Alert.alert('Success', 'Username changed successfully.');
      setNewUsername('');

    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to change username. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match.');
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'New password is too weak.');
      } else if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Please log in again before changing your password.');
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }
      console.error(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={globalStyles.sectionTitle}>Change Password</Text>

      <TextInput style={globalStyles.input} placeholder="Enter current password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword}/>
      <TextInput style={globalStyles.input} placeholder="Enter new password" placeholderTextColor="#888" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
      <TextInput style={globalStyles.input} placeholder="Re-enter new password" placeholderTextColor="#888" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={globalStyles.smallButton} onPress={handleChangePassword}>
        <Text style={globalStyles.buttonText}>Apply</Text>
      </TouchableOpacity>
      <Text style={globalStyles.sectionTitle}>Change Username</Text>
      <TextInput style={globalStyles.input} placeholder="Enter new username" placeholderTextColor="#888" value={newUsername} onChangeText={setNewUsername}
      />
      <TouchableOpacity style={globalStyles.smallButton} onPress={handleChangeUsername}>
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