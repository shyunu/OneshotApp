import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  function onLogin() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (id.trim() === '1' && pw.trim() === '010101') {
        Alert.alert('로그인 성공\n', '계정 정보가 일치합니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('MainTab');
            },
          },
        ]);
      } else {
        Alert.alert(
          '로그인 실패\n',
          '계정 정보가 일치하지 않습니다.\n다시 확인 후 입력해 주세요.\n',
        );
      }
    }, 1000); // 임의의 로그인 지연 추가
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.block}>
        <Image
          source={require('../assets/logo-long.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>ERP시스템 이용을 위해 로그인해주세요</Text>
        <TextInput
          onChangeText={setId}
          value={id}
          style={styles.input}
          placeholder="아이디를 입력하세요"
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={setPw}
          value={pw}
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>로그인</Text>
          )}
        </TouchableOpacity>
        <Text style={{fontSize: 14, marginTop: 30}}>
          © 2024 All Rights Reserved.
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Login;
