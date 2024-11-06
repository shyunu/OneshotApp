import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {PieChart, BarChart} from 'react-native-chart-kit';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';


const HomeScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const [contractCount, setContractCount] = useState(0); // 계약건수
  const [salesCount, setSalesCount] = useState(0); // 판매건수
  const [quarterlyData, setQuarterlyData] = useState([0, 0, 0, 0]); // 분기별 매출액
  const [achievementRate, setAchievementRate] = useState(0); // 목표량 달성률
  const [goalAmount, setGoalAmount] = useState('15000000'); // 목표 금액 (기본 값은 1500만원)
  const [tempGoalAmount, setTempGoalAmount] = useState(goalAmount); // 임시 목표 금액
  const [isEditing, setIsEditing] = useState(false); // 목표 금액 편집 상태

  // API 호출
  const fetchCounts = async () => {
    try {
      const contractResponse = await axios.get(
        'http://localhost:8181/homeApp/contractCount',
      );
      setContractCount(contractResponse.data);

      const salesResponse = await axios.get(
        'http://localhost:8181/homeApp/salesCount',
      );
      setSalesCount(salesResponse.data);

      // 분기별 매출액 가져오기
      const quarterlyResponse = await axios.get(
        'http://localhost:8181/homeApp/getQuarterlyOrderAmount',
      );
      const amounts = quarterlyResponse.data.map(item => item.total_amount);
      setQuarterlyData(amounts);

      const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
      calculateAchievementRate(totalAmount); // 매출액에 따라 목표달성률 계산
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  // 목표 달성률 계산
  const calculateAchievementRate = totalAmount => {
    const rate = (totalAmount / parseFloat(goalAmount)) * 100;
    setAchievementRate(rate);
  };

  // 화면 포커스 시 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      fetchCounts();
    }, [])
  );

  useEffect(() => {
    if (!isEditing && goalAmount && !isNaN(goalAmount)) {
      const totalAmount = quarterlyData.reduce(
        (acc, amount) => acc + amount,
        0,
      );
      calculateAchievementRate(totalAmount);
    }
  }, [goalAmount, quarterlyData, isEditing]);

  // 세로막대차트(분기별 매출액)
  const barData = {
    labels: ['1분기', '2분기', '3분기', '4분기'],
    datasets: [
      {
        data: quarterlyData,
      },
    ],
  };

  // 파이차트(목표 달성률)
  const pieData = [
    {
      name: '달성률(%)',
      population: achievementRate,
      color: 'rgba(0, 86, 154, 0.5)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: '잔여목표액',
      population: 100 - achievementRate,
      color: '#EDF2FB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  // 목표 금액 저장 함수
  const handleSaveGoalAmount = () => {
    setGoalAmount(tempGoalAmount);
    setIsEditing(false); // 편집 모드 비활성화
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.titleText}>금일 등록 현황</Text>
        <View style={styles.todayWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>계약 건수</Text>
            <Text style={styles.cardCount}>{contractCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>판매 건수</Text>
            <Text style={styles.cardCount}>{salesCount}</Text>
          </View>
        </View>

        <Text style={styles.titleText}>분기별 매출액</Text>
        <BarChart
          style={styles.barChart}
          data={barData}
          width={screenWidth - 15}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            formatYLabel: value => {
              return new Intl.NumberFormat('ko-KR').format(Math.floor(value));
            },
          }}
          verticalLabelRotation={0}
        />

        <Text style={styles.titleText}>목표판매량</Text>
        <View style={styles.goalInputContainer}>
          <TextInput
            style={[
              styles.input,
              {backgroundColor: isEditing ? '#fff' : '#f0f0f0'}, // 편집 상태에 따라 배경색 변경
            ]}
            value={tempGoalAmount}
            onChangeText={setTempGoalAmount}
            keyboardType="numeric"
            placeholder="목표 금액 입력"
            editable={isEditing}
          />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => {
              if (isEditing) handleSaveGoalAmount();
              setIsEditing(!isEditing);
            }}>
            <Text style={styles.changeButtonText}>
              {isEditing ? '저장' : '변경'}
            </Text>
          </TouchableOpacity>
        </View>

        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={190}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  titleText: {
    textAlign: 'left',
    width: '100%',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  barChart: {
    marginTop: 20,
  },
  todayWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00569A',
    lineHeight: 30,
    left: 60,
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  changeButton: {
    marginLeft: 10,
    backgroundColor: '#00569A',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
