import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './screens/RootStack';
import SplashScreen from './screens/SplashScreen';
import { Text } from 'react-native';

// 글로벌 폰트 설정
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'establish Retrosans' };

function App() {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // 2초 후 로딩 상태 변경
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen /> : <RootStack />}
    </NavigationContainer>
  );
}

export default App;
