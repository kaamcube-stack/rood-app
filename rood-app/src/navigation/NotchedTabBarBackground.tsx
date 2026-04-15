import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  /** Use rgba — lower alpha = more content shows through (glass). */
  fill?: string;
  /** Subtle edge so the bar reads on busy backgrounds */
  stroke?: string;
  strokeWidth?: number;
  topCornerRadius?: number;
  bottomCornerRadius?: number;
  notchDepth?: number;
  notchHalfWidth?: number;
};

/**
 * Floating pill tab bar: large rounded corners (≈36–40px) + center concave notch.
 * Path: rounded bottom + rounded top + smooth quadratic notch.
 */
export function NotchedTabBarBackground({
  width: w,
  height: h,
  fill = 'rgba(255, 255, 255, 0.58)',
  stroke = 'rgba(15, 23, 42, 0.045)',
  strokeWidth = 1,
  topCornerRadius,
  bottomCornerRadius,
  notchDepth = 30,
  notchHalfWidth = 54,
}: Props) {
  const rt = topCornerRadius ?? 36;
  const rb = bottomCornerRadius ?? 24;
  const cx = w / 2;
  const left = cx - notchHalfWidth;
  const right = cx + notchHalfWidth;

  /** Keep a visible left edge: h − rb − rt > 0 */
  const safeRb = Math.min(rb, Math.max(10, h - rt - 6));

  const d = [
    `M ${safeRb} ${h}`,
    `Q 0 ${h} 0 ${h - safeRb}`,
    `L 0 ${rt}`,
    `Q 0 0 ${rt} 0`,
    `L ${left} 0`,
    `Q ${cx} ${notchDepth} ${right} 0`,
    `L ${w - rt} 0`,
    `Q ${w} 0 ${w} ${rt}`,
    `L ${w} ${h - safeRb}`,
    `Q ${w} ${h} ${w - safeRb} ${h}`,
    `L ${safeRb} ${h}`,
    'Z',
  ].join(' ');

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
