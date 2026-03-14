import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import type { PlayerStats, Attribute } from '../../types/game';
import { ATTRIBUTE_LABELS } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface StatRadarProps {
  stats: PlayerStats;
}

const ATTRIBUTES: Attribute[] = ['str', 'con', 'sta', 'wis', 'cha'];
const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
const LEVELS = 4;

function getPoint(index: number, value: number, maxValue: number = 100): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / ATTRIBUTES.length - Math.PI / 2;
  const r = (value / maxValue) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

export function StatRadar({ stats }: StatRadarProps) {
  const statValues = ATTRIBUTES.map((attr) => Math.min(stats[attr], 100));

  // Data polygon points
  const dataPoints = statValues.map((val, i) => {
    const point = getPoint(i, val);
    return `${point.x},${point.y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Grid levels */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const r = ((level + 1) / LEVELS) * RADIUS;
          const points = ATTRIBUTES.map((_, i) => {
            const angle = (Math.PI * 2 * i) / ATTRIBUTES.length - Math.PI / 2;
            return `${CENTER + r * Math.cos(angle)},${CENTER + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <Polygon
              key={level}
              points={points}
              fill="none"
              stroke={COLORS.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {ATTRIBUTES.map((_, i) => {
          const point = getPoint(i, 100);
          return (
            <Line
              key={`axis-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={point.x}
              y2={point.y}
              stroke={COLORS.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={dataPoints}
          fill={COLORS.primary + '40'}
          stroke={COLORS.primary}
          strokeWidth={2}
        />

        {/* Data points */}
        {statValues.map((val, i) => {
          const point = getPoint(i, val);
          return (
            <Circle
              key={`point-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={COLORS[ATTRIBUTES[i]]}
            />
          );
        })}

        {/* Labels */}
        {ATTRIBUTES.map((attr, i) => {
          const point = getPoint(i, 130);
          return (
            <SvgText
              key={`label-${i}`}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill={COLORS[attr]}
              fontSize={11}
              fontWeight="bold"
            >
              {ATTRIBUTE_LABELS[attr]}
            </SvgText>
          );
        })}
      </Svg>

      {/* Stat values below */}
      <View style={styles.statRow}>
        {ATTRIBUTES.map((attr) => (
          <View key={attr} style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS[attr] }]}>
              {stats[attr]}
            </Text>
            <Text style={styles.statLabel}>{attr.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    ...CARD_SHADOW,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
