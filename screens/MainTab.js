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

const Tab = createBottomTabNavigator();
const InventoryStack = createNativeStackNavigator();

function InventoryStackScreen() {
  return (
    <InventoryStack.Navigator>
      <InventoryStack.Screen
        name="InventoryMain"
        component={InventoryScreen}
        options={{
          headerTitle: () => <Text>재고관리</Text>,
        }}
      />
      <InventoryStack.Screen
        name="Purchase"
        component={InventoryScreen}
        options={({navigation}) => ({
          headerTitle: () => <Text style={styles.headerTitle}>구매관리</Text>,
          headerLeft: null,
          headerBackVisible: false,
          // 부모 헤더 숨기기 (재고관리)
          headerShown: true,
        })}
      />
      <InventoryStack.Screen
        name="Product"
        component={ProductScreen}
        options={({navigation}) => ({
          headerTitle: () => <Text style={styles.headerTitle}>상품관리</Text>,
          headerLeft: null,
          headerBackVisible: false,
          headerShown: true,
        })}
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
        onPress={() => onSelect('Purchase')}>
        <Text style={styles.selectorText}>구매관리</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => onSelect('Product')}>
        <Text style={styles.selectorText}>상품관리</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function MainTab({navigation}) {
  const [showPopup, setShowPopup] = useState(false);

  const handleInventorySelect = screen => {
    setShowPopup(false);
    // 부모 헤더를 숨기기
    navigation.navigate('InventoryStack', {
      screen: screen,
      params: {},
    });
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#00569A',
          headerStyle: styles.header,
        }}
        screenListeners={{
          // 모든 탭의 tabPress 이벤트를 감지하여 팝업을 닫음
          tabPress: () => {
            setShowPopup(false);
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: ({color}) => (
              <Text style={[styles.tabLabel, {color}]}>홈</Text>
            ),
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={size} color={color} />
            ),
            headerTitle: () => <Text style={styles.headerTitle}>홈</Text>,
          }}
        />
        <Tab.Screen
          name="InventoryStack"
          component={InventoryStackScreen}
          options={{
            tabBarLabel: ({color}) => (
              <Text style={[styles.tabLabel, {color}]}>재고관리</Text>
            ),
            tabBarIcon: ({color, size}) => (
              <Icon name="inventory" size={size} color={color} />
            ),
            headerTitle: () => <Text style={styles.headerTitle}>재고관리</Text>,
            // 하위 스크린에서 부모 헤더 숨기기
            headerShown: false,
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setShowPopup(!showPopup);
            },
          }}
        />
        <Tab.Screen
          name="Contract"
          component={ContractScreen}
          options={{
            tabBarLabel: ({color}) => (
              <Text style={[styles.tabLabel, {color}]}>계약관리</Text>
            ),
            tabBarIcon: ({color, size}) => (
              <Icon name="description" size={size} color={color} />
            ),
            headerTitle: () => <Text style={styles.headerTitle}>계약관리</Text>,
          }}
        />
        <Tab.Screen
          name="Sales"
          component={SalesScreen}
          options={{
            tabBarLabel: ({color}) => (
              <Text style={[styles.tabLabel, {color}]}>판매관리</Text>
            ),
            tabBarIcon: ({color, size}) => (
              <Icon name="sell" size={size} color={color} />
            ),
            headerTitle: () => <Text style={styles.headerTitle}>판매관리</Text>,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
  },
});

export default MainTab;
