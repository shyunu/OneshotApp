import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import SalesTransparentCircleButton from './SalesTransparentCircleButton';
import {SafeAreaView} from 'react-native-safe-area-context';

function SalesWriteHeader() {
  const navigation = useNavigation();
  const onGoBack = () => {
    console.log('Hi1');
    if (navigation.canGoBack()) {
      console.log(navigation.canGoBack());
      navigation.pop();
    }
  };

  return (
    <View style={styles.block}>
      <View style={styles.iconButtonWrapper}>
        <SalesTransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>
      <View>
        <Text style={styles.title}>등록</Text>
      </View>
      <View style={styles.buttons}>
        <SalesTransparentCircleButton
          name="delete-forever"
          color="#ef5350"
          hasMarginRight
        />
        <SalesTransparentCircleButton name="check" color="#009688" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    height: 55,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 35,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SalesWriteHeader;
