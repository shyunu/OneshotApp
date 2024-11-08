import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import MainTab from './MainTab';
import InventoryScreen from './inventory/InventoryScreen';
import InventoryWriteScreen from './inventory/InventoryWriteScreen';
import ProductScreen from './product/ProductScreen';
import ProductWriteScreen from './product/ProductWriteScreen';
import ContractWriteScreen from './contract/ContractWriteScreen';
import SalesWriteScreen from './sales/SalesWriteScreen';
import SalesScreen from './sales/SalesScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InventoryWrite"
        component={InventoryWriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductWrite"
        component={ProductWriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContractWrite"
        component={ContractWriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SalesWrite"
        component={SalesWriteScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
