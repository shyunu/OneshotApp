import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo-white.png')} style={styles.logo} />
      <Text style={styles.title}>ONE SHOT</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00569A',
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginRight: 6,
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain', 
  },
});

export default SplashScreen;
