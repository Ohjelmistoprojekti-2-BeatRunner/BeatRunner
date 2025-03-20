import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }

    await AsyncStorage.setItem('userToken', 'yourToken');

    setLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={globalStyles.smallButton} onPress={handleLogin} disabled={loading}>
        <Text style={globalStyles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('./register')}>
        <Text style={globalStyles.link}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

;
