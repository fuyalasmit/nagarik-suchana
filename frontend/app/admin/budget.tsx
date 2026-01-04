import React from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, HStack, Heading, Text } from '@gluestack-ui/themed';
import { PieChart } from '@/components/admin/PieChart';
import { BarChart } from '@/components/admin/BarChart';
import { WardCard } from '@/components/admin/WardCard';
import { budgetData, wardStats, formatNepaliCurrency, AdminColors } from '@/data/admin/mockData';

const Colors = AdminColors;

export default function BudgetScreen() {
  const utilizationPercentage = ((budgetData.totalSpent / budgetData.totalBudget) * 100).toFixed(1);
  const remainingBudget = budgetData.totalBudget - budgetData.totalSpent;

  const handleWardPress = (wardNumber: number) => {
    console.log('Ward pressed:', wardNumber);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <VStack style={{ marginBottom: 24 }}>
        <Heading size="2xl" style={{ color: '#1F2937', fontWeight: '800' }}>
          Budget Analytics
        </Heading>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          Fiscal Year {budgetData.fiscalYear}
        </Text>
      </VStack>

      {/* Budget Overview Card */}
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Total Annual Budget</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 16 }}>
          {formatNepaliCurrency(budgetData.totalBudget)}
        </Text>

        {/* Progress Bar */}
        <Box style={{ marginBottom: 16 }}>
          <HStack style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Budget Utilization</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#1F2937' }}>
              {utilizationPercentage}%
            </Text>
          </HStack>
          <Box
            style={{
              height: 12,
              backgroundColor: '#E5E7EB',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                height: '100%',
                width: `${utilizationPercentage}%`,
                backgroundColor: Colors.primary,
                borderRadius: 6,
              }}
            />
          </Box>
        </Box>

        {/* Stats Row */}
        <HStack style={{ justifyContent: 'space-between' }}>
          <VStack style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.primary }}>
              {formatNepaliCurrency(budgetData.totalSpent)}
            </Text>
            <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Spent</Text>
          </VStack>
          <Box style={{ width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 16 }} />
          <VStack style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.primaryDark }}>
              {formatNepaliCurrency(remainingBudget)}
            </Text>
            <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Remaining</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Budget Allocation Pie Chart */}
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 }}>
          Budget Allocation by Category
        </Text>
        <PieChart data={budgetData.categories} size={220} showLegend={true} />
      </Box>

      {/* Monthly Expenditure Bar Chart */}
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 }}>
          Monthly Expenditure Trend
        </Text>
        <BarChart data={budgetData.monthlyTrend} height={180} barColor={Colors.primary} />
        <Text style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
          Nepali Calendar Months (Shrawan - Ashadh)
        </Text>
      </Box>

      {/* Ward Statistics */}
      <Box style={{ marginBottom: 24 }}>
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
            Ward-wise Statistics
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            {wardStats.length} Wards
          </Text>
        </HStack>
        <VStack>
          {wardStats.map((ward) => (
            <WardCard key={ward.wardNumber} ward={ward} onPress={handleWardPress} />
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
