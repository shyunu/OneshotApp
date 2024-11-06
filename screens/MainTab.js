import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, View, StyleSheet} from 'react-native';
import HomeScreen from './home/HomeScreen';
import ContractScreen from './contract/ContractScreen';
import InventoryScreen from './inventory/InventoryScreen';
import SalesScreen from './sales/SalesScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00569A',
        headerStyle: styles.header,
      }}>
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
            </View>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="재고관리"
        component={InventoryScreen}
        options={{
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
            </View>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="inventory" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="계약관리"
        component={ContractScreen}
        options={{
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
            </View>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="description" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="판매관리"
        component={SalesScreen}
        options={{
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
            </View>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="sell" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 105,
  },
});

export default MainTab;
