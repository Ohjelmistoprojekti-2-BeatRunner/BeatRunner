import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';

export default function SettingsScreen() {
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