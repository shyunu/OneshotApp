import React from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';

function ProductList() {
  return (
    <ScrollView>
      <View style={styles.wrapper}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              No. <Text style={styles.dataText}></Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              공급업체명: <Text style={styles.dataText}></Text>
            </Text>
            <Text style={styles.infoText}>
              카테고리: <Text style={styles.dataText}></Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              상품명: <Text style={styles.dataText}></Text>
            </Text>
            <Text style={styles.infoText}>
              총재고수량: <Text style={styles.dataText}>개</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              안전재고수량: <Text style={styles.dataText}>원</Text>
            </Text>
            <Text style={styles.infoText}>
              판매가격: <Text style={styles.dataText}>원</Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginHorizontal: 16,
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
  dataText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
export default ProductList;
