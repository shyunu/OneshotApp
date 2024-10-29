import React, {useEffect, useState} from 'react';
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
import axios from 'axios';

function SalesList() {
  const [search, setSearch] = useState('');
  const [salesData, setSalesData] = useState([]);
  function onDeleteAll() {
    setSearch('');
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.searchWrap}>
        {search !== '' ? (
          <TouchableOpacity onPress={onDeleteAll}>
            <Icon
              name="cancel"
              size={20}
              style={{color: 'red', opacity: 0.5}}
            />
          </TouchableOpacity>
        ) : (
          <Icon
            name="cancel"
            size={20}
            style={{color: '#e3e3e3', opacity: 0.5}}
          />
        )}

        <TextInput
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <Icon name="search" size={28} style={styles.searchIcon} />
      </View>

      {/* {salesData.map((item, index) => (
        <View key={index} style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>No.{item.ORDER_HEADER_NO}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>판매등록일자: {item.ORDER_SDATE}</Text>
            <Text style={styles.infoText}>판매담당자명: {item.EMPLOYEE_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>고객사명: {item.CLIENT_NAME}</Text>
            <Text style={styles.infoText}>총거래가: {item.TOTAL_AMOUNT}</Text>
          </View>
        </View>
      ))} */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>No.</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>판매등록일자</Text>
          <Text style={styles.infoText}>판매담당자명</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>고객사명</Text>
          <Text style={styles.infoText}>총거래가</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoContainer: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 10,
    bottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
});

export default SalesList;
