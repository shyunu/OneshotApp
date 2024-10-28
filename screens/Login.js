import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

function Login() {
  const navigation = useNavigation();
  function onLogin() {
    navigation.navigate('MainTab');
  }
  return (
    <SafeAreaView style={styles.block}>
      <Image source={require('../assets/logo-long.png')} style={styles.logo} />
      <Text style={styles.title}>ERP시스템 이용을 위해 로그인해주세요</Text>
      {/* <Text syle={styles.title}>LOGIN</Text> */}
      <TextInput style={styles.input} placeholder="아이디를 입력하세요" />
      <TextInput style={styles.input} placeholder="비밀번호를 입력하세요" />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.buttonText} onPress={onLogin}>
          로그인
        </Text>
      </TouchableOpacity>
      <Text style={{fontSize: 14, marginTop: 30}}>
        © 2024 All Rights Reserved.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginTop: 160,
  },
  title: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginRight: 6,
    marginTop: 10,
  },
  input: {
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    marginTop: 20,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
  loginButton: {
    padding: 12,
    marginHorizontal: 5,
    fontSize: 16,
    letterSpacing: 5,
    width: '100%',
    height: 40,
    borderRadius: 4,
    marginTop: 20,
    backgroundColor: '#00569A',
    TouchableOpacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Login;
