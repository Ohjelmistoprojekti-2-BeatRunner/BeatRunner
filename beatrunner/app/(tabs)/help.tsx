import { helpStyles } from '@/styles/helpStyles';
import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper'
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  return (
    <Swiper style={{backgroundColor: 'black'}}>

    <View style={helpStyles.slide}>
        <Text style={helpStyles.slideHeader}>How to get started</Text>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/levelsonphone.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Choose a Level</Text>
            <Text style={helpStyles.slideText}>Your goal is to match your steps to the beat of the music. The more accurate your steps are, the more points you earn. Each level has a different difficulty — some are great for walking, while others require running to keep up with the beat. You can check the difficulty by tapping on a level.</Text>
          </View>
        </View>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/phoneinpocket.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Put your phone in your pocket</Text>
            <Text style={helpStyles.slideText}>Step detection works best when your phone is in your pants pocket while you're playing. If the steps don't feel accurate, you can adjust the step sensitivity in the settings.</Text>
          </View>
        </View>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/running.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Start running</Text>
            <Text style={helpStyles.slideText}>Head outside and get ready to move! Start a level by pressing the Start button. For the best experience, we recommend using headphones. Most importantly — have fun while getting active!</Text>
          </View>
        </View>
      </View>

      <View style={helpStyles.slide}>
        <Text style={helpStyles.slideHeader}>During the game</Text>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/steps.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Stepping to the beat</Text>
            <Text style={helpStyles.slideText}>While completing a level, your goal is to match your steps to the beat of the music. You can enable or disable step sounds in the settings. It's recommended to test your step accuracy in the test level and make adjustments if needed before starting a full run.</Text>
          </View>
        </View>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/trophy.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Scoring points</Text>
            <Text style={helpStyles.slideText}>You earn the most points by stepping in time with the music. Maintaining a streak of well-timed steps gives you bonus points.</Text>
          </View>
        </View>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/finish.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Ending the game</Text>
            <Text style={helpStyles.slideText}>The game ends automatically when the level is finished. If you want to stop before the level ends, you can tap the "End Level" button. Your score will be saved even if you don’t complete the full level.</Text>
          </View>
        </View>

      </View>

      <View style={helpStyles.slide}>
        <Text style={helpStyles.slideHeader}>Account & Highscores</Text>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/trophy.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Highscores</Text>
            <Text style={helpStyles.slideText}>You can view both your personal and global highscores in the "Highscores" tab. Want to check how your friends are doing? Just search for their username to see their results!</Text>
          </View>
        </View>

        <View style={helpStyles.slideRow}>
          <Image style={helpStyles.slideIcon} source={require('../../assets/images/account.png')} />
          <View style={helpStyles.textContainer}>
            <Text style={helpStyles.slideHeader2}>Account</Text>
            <Text style={helpStyles.slideText}>Manage your account in the "Settings" tab. There, you can update your username or password, or delete your account if needed.</Text>
          </View>
        </View>

      </View>
    </Swiper>
  );
}
