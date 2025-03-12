import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';
import StepDetector from '@/components/StepDetector';

export default function StepCounter() {
  const handleStepDetected = (count: number, tempo: number) => {
    console.log(`Step detected! Count: ${count}, Tempo: ${tempo} SPM`);
    
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Step Counter</Text>
      <StepDetector onStepDetected={handleStepDetected} />
    </View>
  );
}