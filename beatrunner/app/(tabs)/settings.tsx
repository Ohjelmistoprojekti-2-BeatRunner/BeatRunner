import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={globalStyles.sectionTitle}>Change Password</Text>

      <TextInput style={globalStyles.input} placeholder="Enter current password" placeholderTextColor="#888" />
      <TextInput style={globalStyles.input} placeholder="Enter new password" placeholderTextColor="#888" />
      <TextInput style={globalStyles.input} placeholder="Re-enter new password" placeholderTextColor="#888" />

      <TouchableOpacity style={globalStyles.smallButton} onPress={() => { /* TODO: Add functionality */ }}>
        <Text style={globalStyles.buttonText}>Apply</Text>
      </TouchableOpacity>
      
      <Text style={globalStyles.sectionTitle}>Remove Account</Text>
      <TextInput style={globalStyles.input} placeholder="Enter email" placeholderTextColor="#888" />
      <TextInput style={globalStyles.input} placeholder="Enter password" placeholderTextColor="#888" />

      <TouchableOpacity style={globalStyles.smallButton} onPress={() => { /* TODO: Add functionality */ }}>
        <Text style={globalStyles.buttonText}>Apply</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.logoutButton} onPress={() => { /* TODO: Add logout functionality */ }}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    padding: 10,
    color: 'white',
    marginTop: 5,
    width: '70%',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#8b0000', // red color for Logout
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end', // positioned on the right
    width: '30%',
  },
});