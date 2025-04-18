import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, updateDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { globalStyles } from '@/styles/globalStyles';

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

      // Alusta käyttäjädokumentti ilman usernamea
      await setDoc(doc(db, 'users', user.uid), {
        createdAt: serverTimestamp(),
        username: null,
      });

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
      // Tarkistetaan, onko käyttäjänimi jo käytössä
      const usernameQuery = query(
        collection(db, 'users'),
        where('usernameLowercase', '==', nameLowercase) // firestore is case-sensitive: usernameLowercase for username comparisons.
      );
      const existing = await getDocs(usernameQuery);

      if (!existing.empty) {
        Alert.alert('Username taken', 'Please choose a different one');
        return;
      }

      // Päivitetään username olemassa olevaan dokumenttiin
      await updateDoc(doc(db, 'users', userId), {
        username: trimmedUsername,
        usernameLowercase: nameLowercase,
      });

      Alert.alert('Success', 'Account created!');
      setModalVisible(false);

      // Siirrytään suoraan etusivulle (sisäänkirjautuneena)
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error saving username', error.message);
    }
  };

  return (
    <>
      {/* Username Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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

      {/* Registration Form */}
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Register</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          placeholderTextColor="#888"
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
    </>
  );
}
