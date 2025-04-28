import { auth, db } from '@/firebaseConfig';
import { globalStyles } from '@/styles/globalStyles';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  // Disable back button during registration
  useEffect(() => {
    const backAction = () => { return true; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Initialize a blank user document in Firestore with timestamp and null username

      await setDoc(doc(db, 'users', user.uid), {
        createdAt: serverTimestamp(),
        username: null,
      });

      // save user ID
      setUserId(user.uid);
      setModalVisible(true);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
      }

      Alert.alert('Registration Failed', errorMessage);
    }
  };

  const handleSaveUsername = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    const nameLowercase = trimmedUsername.toLowerCase()

    try {
      // Check if username is already taken
      const usernameQuery = query(
        collection(db, 'users'),
        where('usernameLowercase', '==', nameLowercase)
      );
      const existing = await getDocs(usernameQuery);

      if (!existing.empty) {
        Alert.alert('Username taken', 'Please choose a different one');
        return;
      }

      // Update user document with username
      await updateDoc(doc(db, 'users', userId), {
        username: trimmedUsername,
        usernameLowercase: nameLowercase,
      });

      Alert.alert('Success', 'Account created!');
      setModalVisible(false);

      // Redirect to home page
      router.replace('/');
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
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000dd' }}>
          <View style={{ width: '85%', backgroundColor: 'black', borderRadius: 10, padding: 20 }}>
            <Text style={[globalStyles.title, { paddingBottom: 10 }]}>Choose a Username</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              onChangeText={setUsername}
            />
            <TouchableOpacity style={[globalStyles.smallButton, { marginTop: 10 }]} onPress={handleSaveUsername}>
              <Text style={globalStyles.buttonText}>Save Username</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={globalStyles.container}>
        <View style={globalStyles.topContainer}>
          <Text style={globalStyles.title}>Register</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor="#cfc0cf"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Password"
            placeholderTextColor="#cfc0cf"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={globalStyles.smallButton} onPress={handleRegister}>
            <Text style={globalStyles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={globalStyles.link}>Already have an account? Login here!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
