
import { Vector2, Vector3 } from '../types';

export const Vec2 = {
  add: (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vector2, b: Vector2): Vector2 => ({ x: a.x - b.x, y: a.y - b.y }),
  mul: (a: Vector2, s: number): Vector2 => ({ x: a.x * s, y: a.y * s }),
  mag: (a: Vector2): number => Math.sqrt(a.x * a.x + a.y * a.y),
  lerp: (a: Vector2, b: Vector2, t: number): Vector2 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),
  dist: (a: Vector2, b: Vector2): number => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)),
};

export const MathUtils = {
  clamp: (val: number, min: number, max: number) => Math.min(Math.max(val, min), max),
  lerp: (start: number, end: number, t: number) => start * (1 - t) + end * t,
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  smoothStep: (t: number) => t * t * (3 - 2 * t),
};

/**
 * Generates a CSS matrix3d string for rigid body transforms.
 * T = Translation Matrix * Rotation Matrix * Scale Matrix
 */
export const composeMatrix3d = (
  pos: Vector2,
  z: number,
  rot: Vector2, // x = pitch (tilt), y = yaw
  scale: number
): string => {
  // Convert degrees to radians
  const radX = (rot.x * Math.PI) / 180;
  const radY = (rot.y * Math.PI) / 180;

  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  // Rotation Matrix (Combined X and Y)
  // [  cy,    0,   sy,   0 ]
  // [ sxsy,  cx, -sxcy,  0 ]
  // [ -cxsy, sx,  cxcy,  0 ]
  // [   0,    0,    0,   1 ]
  
  // We apply Scale into the diagonal
  const m11 = cosY * scale;
  const m12 = sinX * sinY * scale;
  const m13 = -cosX * sinY * scale;
  
  const m21 = 0;
  const m22 = cosX * scale;
  const m23 = sinX * scale;
  
  const m31 = sinY * scale;
  const m32 = -sinX * cosY * scale;
  const m33 = cosX * cosY * scale;

  // Translation
  const tx = pos.x;
  const ty = pos.y;
  const tz = z;

  // CSS matrix3d format (column-major)
  return `matrix3d(
    ${m11.toFixed(4)}, ${m12.toFixed(4)}, ${m13.toFixed(4)}, 0,
    ${m21.toFixed(4)}, ${m22.toFixed(4)}, ${m23.toFixed(4)}, 0,
    ${m31.toFixed(4)}, ${m32.toFixed(4)}, ${m33.toFixed(4)}, 0,
    ${tx.toFixed(4)},  ${ty.toFixed(4)},  ${tz.toFixed(4)},  1
  )`;
};
