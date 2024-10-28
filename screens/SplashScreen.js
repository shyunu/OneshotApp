import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-white.png')} style={styles.logo} />
      <Text style={styles.title}>ONE SHOT</Text>
    </View>
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
    width: 100, // 로고의 너비
    height: 100, // 로고의 높이
    resizeMode: 'contain', // 이미지가 상자에 맞게 조정되도록 설정
  },
});

export default SplashScreen;
