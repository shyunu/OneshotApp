import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import SalesFloatingWriteButton from './SalesFloatingWriteButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

function SalesScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.block}>
      <View style={styles.searchWrap}>
        <Icon name="cancel" size={20} style={{color: '#e3e3e3'}} />

        <TextInput
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
        />
        {/* <TouchableOpacity style={styles.searchButton}>
          <Text style={{color: '#fff'}}>검색</Text>
        </TouchableOpacity> */}
        <Icon name="search" size={28} style={styles.searchIcon} />
      </View>
{/* 
      <View>
        <Text>판매등록일자</Text>
        <Text>고객사명</Text>
        <Text>상품리스트</Text>
        <Text>총거래가</Text>
        <Text>판매담당자명</Text>
        <Text>배송상태</Text>
        <Text>배송일</Text>
      </View> */}
      <SalesFloatingWriteButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchWrap: {
    flexDirection: 'row', // 가로 정렬 설정
    alignItems: 'center', // 세로 중앙 정렬
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    bottom: 25,
  },
  searchIcon: {
    marginLeft: 5,
    color: '#777',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    letterSpacing: 1,
  },
  searchButton: {
    backgroundColor: '#00569A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: 40,
    height: 25,
  },
});

export default SalesScreen;
