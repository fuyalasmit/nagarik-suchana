import React from 'react';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { BarChartProps } from '@/types/admin';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  barColor = Colors.primary,
}) => {
  const chartWidth = 320;
  const chartHeight = height - 40;
  const barWidth = 20;
  const barGap = 8;
  const paddingLeft = 10;

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.amount), 1);

  // Calculate bar positions and heights
  const bars = data.map((item, index) => {
    const barHeight = (item.amount / maxValue) * (chartHeight - 20);
    const x = paddingLeft + index * (barWidth + barGap);
    const y = chartHeight - barHeight;

    return {
      ...item,
      x,
      y,
      height: barHeight,
    };
  });

  // Format amount for display
  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(0)}Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(0)}L`;
    }
    return amount.toString();
  };

  return (
    <VStack style={{ alignItems: 'center' }}>
      <Svg width={chartWidth} height={height}>
        {/* Bars */}
        {bars.map((bar) => (
          <React.Fragment key={bar.month}>
            {/* Bar */}
            <Rect
              x={bar.x}
              y={bar.y}
              width={barWidth}
              height={bar.height}
              fill={bar.amount > 0 ? barColor : '#E5E7EB'}
              rx={4}
              ry={4}
            />
            {/* Value label on top of bar */}
            {bar.amount > 0 && (
              <SvgText
                x={bar.x + barWidth / 2}
                y={bar.y - 5}
                fontSize={8}
                fill="#6B7280"
                textAnchor="middle"
              >
                {formatAmount(bar.amount)}
              </SvgText>
            )}
            {/* Month label */}
            <SvgText
              x={bar.x + barWidth / 2}
              y={chartHeight + 15}
              fontSize={8}
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {bar.month.substring(0, 3)}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </VStack>
  );
};

export default BarChart;
