import { slideStyles } from '@/styles/slideStyles';
import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper'
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  return (
    <Swiper>

    <View style={slideStyles.slide}>
        <Text style={slideStyles.slideHeader}>How to get started</Text>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/levelsonphone.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Choose a Level</Text>
            <Text style={slideStyles.slideText}>Your goal is to match your steps to the beat of the music. The more accurate your steps are, the more points you earn. Each level has a different difficulty — some are great for walking, while others require running to keep up with the beat. You can check the difficulty by tapping on a level.</Text>
          </View>
        </View>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/phoneinpocket.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Put your phone in your pocket</Text>
            <Text style={slideStyles.slideText}>Step detection works best when your phone is in your pants pocket while you're playing. If the steps don't feel accurate, you can adjust the step sensitivity in the settings.</Text>
          </View>
        </View>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/running.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Start running</Text>
            <Text style={slideStyles.slideText}>Head outside and get ready to move! Start a level by pressing the Start button. For the best experience, we recommend using headphones. Most importantly — have fun while getting active!</Text>
          </View>
        </View>
      </View>

      <View style={slideStyles.slide}>
        <Text style={slideStyles.slideHeader}>During the game</Text>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/steps.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Stepping to the beat</Text>
            <Text style={slideStyles.slideText}>While completing a level, you’ll hear this sound indicating when to step. If your steps are off-beat, the sound gets slightly louder to help you sync better with the rhythm.</Text>
            <TouchableOpacity style={slideStyles.slideButton}>
              <View style={slideStyles.slideButtonContent}>
                <Ionicons name="play" style={slideStyles.slideButtonIcon} />
                <Text style={slideStyles.slideButtonText}>Play sound</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/trophy.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Scoring points</Text>
            <Text style={slideStyles.slideText}>You earn the most points by stepping in time with the music. Maintaining a streak of well-timed steps gives you bonus points. You’ll hear this sound when you're on a streak.</Text>
            <TouchableOpacity style={slideStyles.slideButton}>
              <View style={slideStyles.slideButtonContent}>
                <Ionicons name="play" style={slideStyles.slideButtonIcon} />
                <Text style={slideStyles.slideButtonText}>Play sound</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/finish.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Ending the game</Text>
            <Text style={slideStyles.slideText}>The game ends automatically when the level is finished. If you want to stop before the level ends, you can tap the "End Level" button. Your score will be saved even if you don’t complete the full level.</Text>
          </View>
        </View>

      </View>

      <View style={slideStyles.slide}>
        <Text style={slideStyles.slideHeader}>Account & Highscores</Text>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/trophy.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Highscores</Text>
            <Text style={slideStyles.slideText}>You can view both your personal and global highscores in the "Highscores" tab. Want to check how your friends are doing? Just search for their username to see their results!</Text>
          </View>
        </View>

        <View style={slideStyles.slideRow}>
          <Image style={slideStyles.slideIcon} source={require('../../assets/images/account.png')} />
          <View style={slideStyles.textContainer}>
            <Text style={slideStyles.slideHeader2}>Account</Text>
            <Text style={slideStyles.slideText}>Manage your account in the "Settings" tab. There, you can update your username or password, or delete your account if needed.</Text>
          </View>
        </View>

      </View>
    </Swiper>
  );
}
