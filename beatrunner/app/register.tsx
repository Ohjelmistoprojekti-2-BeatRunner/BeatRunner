import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';


export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Register</Text>
      <TextInput style={globalStyles.input} placeholder="Email" placeholderTextColor="#888" onChangeText={setEmail} />
      <TextInput style={globalStyles.input} placeholder="Password" secureTextEntry={true} onChangeText={setPassword}  placeholderTextColor="#888"  />
      <TouchableOpacity style={globalStyles.smallButton} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={globalStyles.link}>Already have an account? Login here!</Text>
      </TouchableOpacity>
    </View>
  );
}
;
