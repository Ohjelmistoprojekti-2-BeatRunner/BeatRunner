import { auth, db } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleLogout = async () => {
    try {

      await signOut(auth);
      setTimeout(() => {
        Alert.alert('Logged out', 'You have been successfully logged out.');
        router.replace('/login');
    }, 300);
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
    const trimmedUsername = newUsername.trim();
    if (!trimmedUsername) {
      Alert.alert('Error', 'Please enter a new username.');
      return;
    }
  

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', trimmedUsername));
      const querySnapshot = await getDocs(q);

      const isTaken = querySnapshot.docs.some(doc => doc.id !== user.uid);
      if (isTaken) {
        Alert.alert('Error', 'Username is already taken.');
        return;
      }

      Alert.alert(
        'Confirm Username Change',
        `Are you sure you want to change your username to "${trimmedUsername}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await updateProfile(user, {
                  displayName: trimmedUsername,
                });
  
                await user.reload();
  
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, { username: trimmedUsername });
  
                Alert.alert('Success', 'Username changed successfully.');
                setNewUsername('');
              } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to change username.');
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to check username. Please try again.');
    }
  }

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
    <ScrollView style={globalStyles.container}>
      <View style={{paddingBottom: 50 }}>
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
    </ScrollView>
  );
}