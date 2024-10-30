import React, {useState} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function SalesSearchFrame() {

  const [search, setSearch] = useState('');
  const [salesData, setSalesData] = useState([]);
  function onDeleteAll() {
    setSearch('');
  }

  return (
    <View style={styles.searchWrap}>
      <TextInput
        placeholder="검색어를 입력하세요"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
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

      <Icon name="search" size={28} style={styles.searchIcon} />
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
    width: '100%',
    height: 40,
    // bottom: 25,
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
})

export default SalesSearchFrame;
