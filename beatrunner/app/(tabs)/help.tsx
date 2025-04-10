import { globalStyles } from '@/styles/globalStyles';
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper'

export default function HelpScreen() {
    return (
        <Swiper  >

            <View style={styles.slide}>
                <Text style={styles.slideHeader}>How to get started</Text>

                <View style={styles.row}>
                <Image style={styles.slideIcon} source={require('../../assets/images/levelsonphone.png')} />
                <View style={styles.textContainer}>
                <Text style={styles.slideHeader2}>Choose a Level</Text>
                <Text style={styles.slideText}>Your goal is to match your steps to the beat of the music. The more accurate your steps are, the more points you earn. Each level has a different difficulty — some are great for walking, while others require running to keep up with the beat. You can check the difficulty by tapping on a level.</Text>
                </View>
                </View>

                <View style={styles.row}>
                <Image style={styles.slideIcon} source={require('../../assets/images/phoneinpocket.png')} />
                <View style={styles.textContainer}>
                <Text style={styles.slideHeader2}>Put your phone in your pocket</Text>
                <Text style={styles.slideText}>Step detection works best when your phone is in your pants pocket while you're playing. If the steps don't feel accurate, you can adjust the step sensitivity in the settings.</Text>
                </View>
                </View>
                
                <View style={styles.row}>
                <Image style={styles.slideIcon} source={require('../../assets/images/running.png')} />
                <View style={styles.textContainer}>
                <Text style={styles.slideHeader2}>Start running</Text>
                <Text style={styles.slideText}>Head outside and get ready to move! Start a level by pressing the Start button. For the best experience, we recommend using headphones. Most importantly — have fun while getting active!</Text>
                </View>
                </View>
            
            </View>
            <View style={styles.slide}>
                <Text style={styles.slideHeader}>During game</Text>
            </View>
            <View style={styles.slide}>
                <Text style={styles.slideHeader}>Account</Text>
            </View>
        </Swiper>
    );
}

const styles = StyleSheet.create({
    slide: {
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      marginTop: 15
    },
    slideIcon: {
      width: 75,
      height: 75,
      marginRight: 10,
      marginTop: 10,
      resizeMode: 'contain',
    },
    textContainer: {
      flex: 1,
    },
    slideHeader: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white',
      textAlign: 'center'
    },
    slideHeader2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'white',
    },
    slideText: {
      fontSize: 16,
      color: 'white',
    },
  });