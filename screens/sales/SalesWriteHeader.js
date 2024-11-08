import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import SalesTransparentCircleButton from './SalesTransparentCircleButton';

function SalesWriteHeader({onResetFields, onRegist}) {
  const navigation = useNavigation();
  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    }
  };

  //초기화 버튼(delete-forever)
  function alertDeleteConfirm() {
    Alert.alert(
      '경고\n',
      '초기화하시겠습니까?\n',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            navigation.goBack(); // 이전 화면으로 돌아가기
          },
        },
      ],
      {cancelable: false},
    );
  }

  //저장하기 버튼(check)
  function alertCheckConfirm() {
    Alert.alert('확인\n', '판매를 등록하시겠습니까?\n', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {


          if (onRegist) {
            onRegist();
          }
        },
      },
    ]);
  }

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
          onPress={alertDeleteConfirm}
        />
        <SalesTransparentCircleButton
          name="check"
          color="#00569A"
          onPress={alertCheckConfirm}
        />
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
