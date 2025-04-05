import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import { db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      setModalVisible(true);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
  
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address you entered is not valid. Please check and try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Your password is too weak. Please choose a stronger password.';
      }
  
      Alert.alert('Registration Failed', errorMessage, [{ text: 'OK' }]);
    }
  };
  
  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
  
    try {
      await setDoc(doc(db, 'users', userId), {
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
      });
  
      Alert.alert('Success', 'Account created!');
      setModalVisible(false);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error saving username', error.message);
    }
  };
  

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <View style={{ width: '80%', backgroundColor: 'black' }}>
            <Text style={[globalStyles.title, {padding: 10}]}>Choose a Username</Text>
            <TextInput
              style={globalStyles.input} placeholder="Username" placeholderTextColor="#888" onChangeText={setUsername}
            />
            <TouchableOpacity style={[globalStyles.smallButton, { width: '70%' }]} onPress={handleSaveUsername}>
              <Text style={globalStyles.buttonText}>Save Username</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Register</Text>
        <TextInput style={globalStyles.input} placeholder="Email" placeholderTextColor="#888" onChangeText={setEmail} />
        <TextInput style={globalStyles.input} placeholder="Password" secureTextEntry={true} onChangeText={setPassword}  placeholderTextColor="#888" />
        <TouchableOpacity style={globalStyles.smallButton} onPress={handleRegister}>
          <Text style={globalStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={globalStyles.link}>Already have an account? Login here!</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  
};
