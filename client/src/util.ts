
export function parseIntSafe(s: string) {
  return parseInt(s) || 0;
}

export function radToDeg(rad: number) {
  return Math.round(rad*180/Math.PI); 
}

export function degToRad(deg: number) {
  return deg/180*Math.PI;
}
