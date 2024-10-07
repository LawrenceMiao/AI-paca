import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const Splash = ({ navigation }) => {
  useEffect(() => {
      setTimeout(() => {
        try {
          SplashScreen.hide();
        } catch (error) {
          console.log("Error hiding splash screen: ", error);
        }
        navigation.replace('CameraView');
      }, 3000);
    }, []);
   
return (
  <View style={styles.container}>
    <Image
      source={require('../src/aipaca.gif')}
      style={styles.gif}
    />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  gif: {
    width: 200,
    height: 100,
  },
});

export default Splash;