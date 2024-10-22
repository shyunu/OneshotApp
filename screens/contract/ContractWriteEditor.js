import React, {useRef} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

function ContractWriteEditor({client, onChangeClient}) {
  const nextInputRef = useRef(); // 다음 필드 참조

  return (
    <View style={styles.block}>
      <TextInput
        placeholder="회사명을 입력하세요"
        style={styles.input}
        returnKeyType="next"
        onChangeText={onChangeClient}
        value={client}
        onSubmitEditing={() => nextInputRef.current.focus()} // 다음 필드로 포커스 이동
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40, // 고정된 높이
    borderColor: '#ced4da', // 연한 회색 테두리 (HTML input과 유사)
    borderWidth: 1,
    borderRadius: 4, // 모서리 곡선 처리
    paddingHorizontal: 10, // 좌우 여백
    marginBottom: 12, // 입력 필드 간 간격
    backgroundColor: '#fff', // 흰색 배경
    fontSize: 16, // 적당한 글씨 크기
    color: '#495057', // 텍스트 색상
    shadowColor: '#000', // 그림자 색상
    shadowOffset: {width: 0, height: 1}, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 1, // 그림자 반경
    elevation: 2, // Android 그림자 (elevation 사용)
  },
});

export default ContractWriteEditor;
