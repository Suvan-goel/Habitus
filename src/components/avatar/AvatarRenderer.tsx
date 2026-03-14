import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Rect,
  Polygon,
  Path,
  Ellipse,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
  Line,
} from 'react-native-svg';
import type { PlayerStats, PlayerClass } from '../../types/game';
import { CLASS_INFO } from '../../types/game';
import { getAvatarConfig, TIER_SIZES, AURA_OPACITY } from './avatarStateMachine';
import { COLORS } from '../../lib/constants';

interface AvatarRendererProps {
  stats: PlayerStats;
  playerClass: PlayerClass;
  size?: number;
}

// Lighter variant of a hex color for highlights
function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, Math.round(r + (255 - r) * amount));
  const ng = Math.min(255, Math.round(g + (255 - g) * amount));
  const nb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

// Darker variant of a hex color for shadows
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.max(0, Math.round(r * (1 - amount)));
  const ng = Math.max(0, Math.round(g * (1 - amount)));
  const nb = Math.max(0, Math.round(b * (1 - amount)));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

const SKIN = '#F0D5B0';
const SKIN_SHADOW = '#D4B896';

export function AvatarRenderer({ stats, playerClass, size = 180 }: AvatarRendererProps) {
  const config = getAvatarConfig(stats, playerClass);
  const classColor = CLASS_INFO[playerClass].color;
  const classLight = lighten(classColor, 0.35);
  const classDark = darken(classColor, 0.25);
  const bodyScale = TIER_SIZES[config.bodyBuild] / 100;
  const auraOpacity = AURA_OPACITY[config.aura];

  const cx = size / 2;
  const cy = size / 2;

  // Character proportions (relative to size)
  const headR = size * 0.14;
  const headY = cy - size * 0.12;
  const bodyW = size * 0.22 * bodyScale;
  const bodyH = size * 0.22;
  const bodyY = headY + headR * 0.7;
  const armW = size * 0.06;
  const armH = size * 0.18;
  const legW = size * 0.07;
  const legH = size * 0.14;
  const footH = size * 0.035;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={classColor} stopOpacity={auraOpacity * 0.8} />
            <Stop offset="60%" stopColor={classColor} stopOpacity={auraOpacity * 0.3} />
            <Stop offset="100%" stopColor={classColor} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={classLight} />
            <Stop offset="100%" stopColor={classColor} />
          </LinearGradient>
          <RadialGradient id="platformGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={classColor} stopOpacity={0.15} />
            <Stop offset="100%" stopColor={classColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Aura glow */}
        {auraOpacity > 0 && (
          <Circle cx={cx} cy={cy} r={cx * 0.92} fill="url(#auraGlow)" />
        )}

        {/* Ground shadow */}
        <Ellipse
          cx={cx}
          cy={bodyY + bodyH + legH + footH + size * 0.02}
          rx={size * 0.18}
          ry={size * 0.025}
          fill="#00000012"
        />

        {/* === LEGS === */}
        {/* Left leg */}
        <Rect
          x={cx - legW * 1.15}
          y={bodyY + bodyH - size * 0.01}
          width={legW}
          height={legH}
          rx={legW * 0.35}
          fill={classDark}
        />
        {/* Right leg */}
        <Rect
          x={cx + legW * 0.15}
          y={bodyY + bodyH - size * 0.01}
          width={legW}
          height={legH}
          rx={legW * 0.35}
          fill={classDark}
        />

        {/* Boots */}
        <Ellipse
          cx={cx - legW * 0.65}
          cy={bodyY + bodyH + legH - size * 0.015}
          rx={legW * 0.6}
          ry={footH}
          fill={darken(classDark, 0.2)}
        />
        <Ellipse
          cx={cx + legW * 0.65}
          cy={bodyY + bodyH + legH - size * 0.015}
          rx={legW * 0.6}
          ry={footH}
          fill={darken(classDark, 0.2)}
        />

        {/* === BODY / TUNIC === */}
        <Rect
          x={cx - bodyW / 2}
          y={bodyY}
          width={bodyW}
          height={bodyH}
          rx={bodyW * 0.18}
          fill="url(#bodyGrad)"
        />

        {/* Belt */}
        <Rect
          x={cx - bodyW / 2 + bodyW * 0.05}
          y={bodyY + bodyH * 0.62}
          width={bodyW * 0.9}
          height={size * 0.025}
          rx={size * 0.01}
          fill={COLORS.primary}
        />
        {/* Belt buckle */}
        <Circle
          cx={cx}
          cy={bodyY + bodyH * 0.62 + size * 0.0125}
          r={size * 0.018}
          fill={COLORS.primaryLight}
        />

        {/* === ARMS === */}
        {/* Left arm */}
        <Rect
          x={cx - bodyW / 2 - armW * 0.6}
          y={bodyY + size * 0.02}
          width={armW}
          height={armH}
          rx={armW * 0.4}
          fill={classColor}
        />
        {/* Left hand */}
        <Circle
          cx={cx - bodyW / 2 - armW * 0.1}
          cy={bodyY + size * 0.02 + armH}
          r={size * 0.03}
          fill={SKIN}
        />

        {/* Right arm */}
        <Rect
          x={cx + bodyW / 2 - armW * 0.4}
          y={bodyY + size * 0.02}
          width={armW}
          height={armH}
          rx={armW * 0.4}
          fill={classColor}
        />
        {/* Right hand */}
        <Circle
          cx={cx + bodyW / 2 + armW * 0.1}
          cy={bodyY + size * 0.02 + armH}
          r={size * 0.03}
          fill={SKIN}
        />

        {/* === CLASS WEAPON / ITEM === */}
        {playerClass === 'warrior' && (
          <G>
            {/* Sword held in right hand */}
            <Rect
              x={cx + bodyW / 2 + armW * 0.02}
              y={bodyY - size * 0.06}
              width={size * 0.025}
              height={size * 0.2}
              rx={size * 0.005}
              fill="#A0A0A8"
            />
            {/* Sword guard */}
            <Rect
              x={cx + bodyW / 2 - size * 0.02}
              y={bodyY + size * 0.12}
              width={size * 0.07}
              height={size * 0.018}
              rx={size * 0.004}
              fill={COLORS.primary}
            />
            {/* Sword pommel */}
            <Circle
              cx={cx + bodyW / 2 + armW * 0.14}
              cy={bodyY + size * 0.155}
              r={size * 0.015}
              fill={COLORS.primaryLight}
            />
          </G>
        )}

        {playerClass === 'monk' && (
          <G>
            {/* Staff held in right hand */}
            <Rect
              x={cx + bodyW / 2 + armW * 0.02}
              y={bodyY - size * 0.14}
              width={size * 0.02}
              height={size * 0.38}
              rx={size * 0.008}
              fill="#8B6914"
            />
            {/* Staff orb */}
            <Circle
              cx={cx + bodyW / 2 + armW * 0.12}
              cy={bodyY - size * 0.14}
              r={size * 0.028}
              fill={classLight}
              opacity={0.9}
            />
            <Circle
              cx={cx + bodyW / 2 + armW * 0.12}
              cy={bodyY - size * 0.14}
              r={size * 0.016}
              fill="#fff"
              opacity={0.5}
            />
          </G>
        )}

        {playerClass === 'bard' && (
          <G>
            {/* Lyre body held in left hand */}
            <Ellipse
              cx={cx - bodyW / 2 - armW * 0.1}
              cy={bodyY + size * 0.08}
              rx={size * 0.04}
              ry={size * 0.055}
              fill="#8B6914"
            />
            <Ellipse
              cx={cx - bodyW / 2 - armW * 0.1}
              cy={bodyY + size * 0.08}
              rx={size * 0.025}
              ry={size * 0.038}
              fill={COLORS.primary}
            />
            {/* Lyre strings */}
            <Line
              x1={cx - bodyW / 2 - armW * 0.1 - size * 0.01}
              y1={bodyY + size * 0.035}
              x2={cx - bodyW / 2 - armW * 0.1 - size * 0.01}
              y2={bodyY + size * 0.125}
              stroke={COLORS.primaryLight}
              strokeWidth={0.8}
            />
            <Line
              x1={cx - bodyW / 2 - armW * 0.1 + size * 0.01}
              y1={bodyY + size * 0.035}
              x2={cx - bodyW / 2 - armW * 0.1 + size * 0.01}
              y2={bodyY + size * 0.125}
              stroke={COLORS.primaryLight}
              strokeWidth={0.8}
            />
          </G>
        )}

        {/* === NECK === */}
        <Rect
          x={cx - size * 0.035}
          y={headY + headR * 0.6}
          width={size * 0.07}
          height={size * 0.04}
          fill={SKIN_SHADOW}
        />

        {/* === HEAD === */}
        <Circle cx={cx} cy={headY} r={headR} fill={SKIN} />

        {/* Face shadow (subtle depth) */}
        <Ellipse
          cx={cx}
          cy={headY + headR * 0.15}
          rx={headR * 0.85}
          ry={headR * 0.75}
          fill={SKIN_SHADOW}
          opacity={0.2}
        />

        {/* Eyes */}
        <Ellipse
          cx={cx - headR * 0.32}
          cy={headY - headR * 0.05}
          rx={size * 0.02}
          ry={size * 0.025}
          fill="#3A3A3A"
        />
        <Ellipse
          cx={cx + headR * 0.32}
          cy={headY - headR * 0.05}
          rx={size * 0.02}
          ry={size * 0.025}
          fill="#3A3A3A"
        />
        {/* Eye highlights */}
        <Circle
          cx={cx - headR * 0.28}
          cy={headY - headR * 0.1}
          r={size * 0.008}
          fill="#fff"
        />
        <Circle
          cx={cx + headR * 0.36}
          cy={headY - headR * 0.1}
          r={size * 0.008}
          fill="#fff"
        />

        {/* Mouth - small friendly smile */}
        <Path
          d={`M ${cx - headR * 0.2} ${headY + headR * 0.35} Q ${cx} ${headY + headR * 0.52} ${cx + headR * 0.2} ${headY + headR * 0.35}`}
          fill="none"
          stroke="#C4957A"
          strokeWidth={size * 0.012}
          strokeLinecap="round"
        />

        {/* === CLASS HEADGEAR === */}
        {playerClass === 'warrior' && (
          <G>
            {/* Warrior helm - rounded with visor */}
            <Path
              d={`M ${cx - headR * 1.05} ${headY + headR * 0.1}
                  Q ${cx - headR * 1.1} ${headY - headR * 0.6} ${cx} ${headY - headR * 1.2}
                  Q ${cx + headR * 1.1} ${headY - headR * 0.6} ${cx + headR * 1.05} ${headY + headR * 0.1}`}
              fill={classDark}
            />
            {/* Helm crest */}
            <Rect
              x={cx - size * 0.012}
              y={headY - headR * 1.35}
              width={size * 0.024}
              height={headR * 0.5}
              rx={size * 0.008}
              fill={COLORS.primary}
            />
            {/* Visor line */}
            <Line
              x1={cx - headR * 0.9}
              y1={headY - headR * 0.05}
              x2={cx + headR * 0.9}
              y2={headY - headR * 0.05}
              stroke={classColor}
              strokeWidth={size * 0.015}
              strokeLinecap="round"
            />
          </G>
        )}

        {playerClass === 'monk' && (
          <G>
            {/* Monk hood - soft rounded */}
            <Path
              d={`M ${cx - headR * 1.2} ${headY + headR * 0.3}
                  Q ${cx - headR * 1.25} ${headY - headR * 0.4} ${cx - headR * 0.5} ${headY - headR * 1.15}
                  Q ${cx} ${headY - headR * 1.4} ${cx + headR * 0.5} ${headY - headR * 1.15}
                  Q ${cx + headR * 1.25} ${headY - headR * 0.4} ${cx + headR * 1.2} ${headY + headR * 0.3}`}
              fill={classColor}
            />
            {/* Hood inner shadow */}
            <Path
              d={`M ${cx - headR * 0.95} ${headY + headR * 0.15}
                  Q ${cx - headR * 0.95} ${headY - headR * 0.3} ${cx} ${headY - headR * 0.9}
                  Q ${cx + headR * 0.95} ${headY - headR * 0.3} ${cx + headR * 0.95} ${headY + headR * 0.15}`}
              fill={classLight}
              opacity={0.3}
            />
          </G>
        )}

        {playerClass === 'bard' && (
          <G>
            {/* Bard hat - feathered cap */}
            <Path
              d={`M ${cx - headR * 1.1} ${headY - headR * 0.2}
                  Q ${cx - headR * 0.8} ${headY - headR * 1.3} ${cx + headR * 0.2} ${headY - headR * 1.1}
                  Q ${cx + headR * 1.2} ${headY - headR * 0.8} ${cx + headR * 1.15} ${headY - headR * 0.15}`}
              fill={classColor}
            />
            {/* Hat brim */}
            <Ellipse
              cx={cx}
              cy={headY - headR * 0.25}
              rx={headR * 1.15}
              ry={headR * 0.2}
              fill={classDark}
            />
            {/* Feather */}
            <Path
              d={`M ${cx + headR * 0.5} ${headY - headR * 1.05}
                  Q ${cx + headR * 1.4} ${headY - headR * 1.8} ${cx + headR * 1.6} ${headY - headR * 1.5}
                  Q ${cx + headR * 1.3} ${headY - headR * 1.1} ${cx + headR * 0.5} ${headY - headR * 1.05}`}
              fill={COLORS.primaryLight}
            />
          </G>
        )}

        {/* === SHOULDER PAULDRONS === */}
        <Ellipse
          cx={cx - bodyW / 2 - armW * 0.1}
          cy={bodyY + size * 0.015}
          rx={size * 0.04}
          ry={size * 0.03}
          fill={classDark}
        />
        <Ellipse
          cx={cx + bodyW / 2 + armW * 0.1}
          cy={bodyY + size * 0.015}
          rx={size * 0.04}
          ry={size * 0.03}
          fill={classDark}
        />

        {/* Collar / neckline accent */}
        <Path
          d={`M ${cx - bodyW * 0.3} ${bodyY + size * 0.01}
              Q ${cx} ${bodyY + size * 0.06} ${cx + bodyW * 0.3} ${bodyY + size * 0.01}`}
          fill="none"
          stroke={COLORS.primary}
          strokeWidth={size * 0.012}
          strokeLinecap="round"
        />

        {/* === CHARISMA SPARKLES (if high CHA) === */}
        {stats.cha >= 40 && (
          <G opacity={Math.min(1, stats.cha / 100)}>
            <Circle cx={cx - size * 0.28} cy={headY - size * 0.08} r={size * 0.01} fill={COLORS.primaryLight} />
            <Circle cx={cx + size * 0.3} cy={headY + size * 0.05} r={size * 0.008} fill={COLORS.primaryLight} />
            <Circle cx={cx - size * 0.22} cy={bodyY + size * 0.05} r={size * 0.006} fill={COLORS.primaryLight} />
            {stats.cha >= 75 && (
              <>
                <Circle cx={cx + size * 0.25} cy={headY - size * 0.15} r={size * 0.007} fill={COLORS.primaryLight} />
                <Circle cx={cx - size * 0.32} cy={bodyY + size * 0.12} r={size * 0.009} fill={COLORS.primaryLight} />
              </>
            )}
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
