import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './home/HomeScreen';
import ContractScreen from './contract/ContractScreen';
import InventoryScreen from './inventory/InventoryScreen';
import ProductScreen from './product/ProductScreen';
import SalesScreen from './sales/SalesScreen';

// 스택 네비게이터 생성
const Tab = createBottomTabNavigator();
const InventoryStack = createNativeStackNavigator();

function InventoryStackScreen() {
  return (
    <InventoryStack.Navigator screenOptions={{headerTitle: '재고관리'}}>
      <InventoryStack.Screen
        name="재고관리"
        component={InventoryScreen}
        options={{headerTitle: '재고관리'}}
      />
      <InventoryStack.Screen
        name="구매관리"
        component={InventoryScreen}
        options={{
          headerTitle: '구매관리',
          headerLeft: null, // 뒤로 가기 버튼 제거
          headerBackVisible: false, // 뒤로 가기 버튼 제거
        }}
      />
      <InventoryStack.Screen
        name="상품관리"
        component={ProductScreen}
        options={{
          headerTitle: '상품관리',
          headerLeft: null,
          headerBackVisible: false,
        }}
      />
    </InventoryStack.Navigator>
  );
}

function TabPopupMenu({visible, onSelect, style}) {
  const [fadeIn] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeIn]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        {
          opacity: fadeIn,
          transform: [
            {
              translateY: fadeIn.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
        style,
      ]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => onSelect('구매관리')}>
        <Text style={styles.selectorText}>구매관리</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => onSelect('상품관리')}>
        <Text style={styles.selectorText}>상품관리</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function MainTab({navigation}) {
  const [showPopup, setShowPopup] = useState(false);

  const handleInventorySelect = screen => {
    setShowPopup(false);

    // InventoryStack 내에서 네비게이션
    if (screen === '구매관리') {
      navigation.navigate('재고관리', {screen: '구매관리'});
    } else if (screen === '상품관리') {
      navigation.navigate('재고관리', {screen: '상품관리'});
    }
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#00569A',
          headerStyle: styles.header,
        }}>
        <Tab.Screen
          name="홈"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="재고관리"
          component={InventoryStackScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="inventory" size={size} color={color} />
            ),
            headerTitle: '재고관리',
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setShowPopup(!showPopup);
            },
          }}
        />
        <Tab.Screen
          name="계약관리"
          component={ContractScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="description" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="판매관리"
          component={SalesScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="sell" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <TabPopupMenu
        visible={showPopup}
        onSelect={handleInventorySelect}
        style={styles.popup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 80,
    left: '20%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 5,
    width: '35%',
    alignItems: 'center',
  },
  selectorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 15,
    color: '#333',
  },
});

export default MainTab;
