import React, {useState} from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function InventorySearchFrame({onSearch}) {
  const [search, setSearch] = useState('');

  // 검색어 입력 처리 (디바운싱 적용)
  const handleSearchInput = text => {
    console.log(text);
    setSearch(text);
  };

  // 검색 아이콘 클릭 시 검색어로 목록 조회
  const handleSearchPress = () => {
    console.log('search: ', search);
    onSearch(search); // 입력된 검색어를 onSearch에 전달
  };

  // 검색 초기화
  function onDeleteAll() {
    setSearch(''); // 검색어 초기화
    onSearch(''); // 검색어가 비어 있으면 전체 목록 조회
  }

  return (
    <View style={styles.searchWrap}>
      <TextInput
        placeholder="검색어를 입력하세요"
        style={styles.searchInput}
        value={search}
        onChangeText={handleSearchInput}
      />
      {search !== '' ? (
        <TouchableOpacity onPress={onDeleteAll}>
          <Icon name="cancel" size={20} style={{color: 'red', opacity: 0.5}} />
        </TouchableOpacity>
      ) : (
        <Icon
          name="cancel"
          size={20}
          style={{color: '#e3e3e3', opacity: 0.5, marginRight: 5}}
        />
      )}

      <Icon
        name="search"
        size={28}
        style={styles.searchIcon}
        onPress={handleSearchPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    height: 40,
    bottom: 15,
    marginTop: 35,
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
});

export default InventorySearchFrame;
