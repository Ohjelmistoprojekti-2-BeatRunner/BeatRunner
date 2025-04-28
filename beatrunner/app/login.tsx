import { auth } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //prevents user from getting to the app without logging in first
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

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
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address you entered is not valid. Please check and try again.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Please ensure your email and password are correct.';
      }
      Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
    }
    setLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topContainer}>
        <Text style={globalStyles.title}>Login</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          onChangeText={setEmail}
          placeholderTextColor="#cfc0cf"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          placeholderTextColor="#cfc0cf"
        />

        <TouchableOpacity style={globalStyles.smallButton} onPress={handleLogin} disabled={loading}>
          <Text style={globalStyles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('./register')}>
          <Text style={globalStyles.link}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

;
