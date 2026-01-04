import React from 'react';
import { Box, Text, HStack, VStack } from '@gluestack-ui/themed';
import Svg, { Path, G } from 'react-native-svg';
import { PieChartProps } from '@/types/admin';

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLegend = true,
}) => {
  const total = data.reduce((sum, item) => sum + item.allocated, 0);
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = data.map((item) => {
    const percentage = (item.allocated / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc points
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    // Large arc flag
    const largeArc = angle > 180 ? 1 : 0;

    // Create path
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      percentage,
      path,
    };
  });

  return (
    <VStack style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice) => (
            <Path
              key={slice.id}
              d={slice.path}
              fill={slice.color}
            />
          ))}
        </G>
      </Svg>

      {showLegend && (
        <VStack style={{ marginTop: 20, width: '100%' }}>
          {slices.map((slice) => (
            <HStack
              key={slice.id}
              style={{
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <Box
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: slice.color,
                  marginRight: 10,
                }}
              />
              <Text style={{ flex: 1, fontSize: 13, color: '#374151' }}>
                {slice.name}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937' }}>
                {slice.percentage.toFixed(1)}%
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default PieChart;
