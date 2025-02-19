type PointCoordinates = [number, number];
type LineStringCoordinates = PointCoordinates[];
type MultiLineStringCoordinates = LineStringCoordinates[];

/**
 * Вычисляет ближайшую точку на отрезке [A, B] к точке P
 */
function closestPointOnSegment(A: PointCoordinates, B: PointCoordinates, P: PointCoordinates): PointCoordinates {
  const [Ax, Ay] = A;
  const [Bx, By] = B;
  const [Px, Py] = P;

  const ABx = Bx - Ax;
  const ABy = By - Ay;
  const APx = Px - Ax;
  const APy = Py - Ay;

  const ab2 = ABx * ABx + ABy * ABy; // Длина AB в квадрате
  const ap_ab = APx * ABx + APy * ABy; // Скалярное произведение

  const t = Math.max(0, Math.min(1, ap_ab / ab2)); // Проекция точки на отрезок
  return [Ax + ABx * t, Ay + ABy * t]; // Координаты ближайшей точки
}

/**
 * Находит ближайшую точку на линии (LineString) к заданной точке
 */
function closestPointOnLine(line: LineStringCoordinates, point: PointCoordinates): PointCoordinates {
  let closest: PointCoordinates = line[0];
  let minDist = Infinity;

  for (let i = 0; i < line.length - 1; i++) {
    const segmentClosest = closestPointOnSegment(line[i], line[i + 1], point);
    const dist = Math.hypot(point[0] - segmentClosest[0], point[1] - segmentClosest[1]);

    if (dist < minDist) {
      minDist = dist;
      closest = segmentClosest;
    }
  }

  return closest;
}

/**
 * Находит ближайшую точку на изолинии (MultiLineString) к заданной точке
 */
function closestPointOnMultiLineString(
  multiLine: MultiLineStringCoordinates,
  point: PointCoordinates,
): PointCoordinates {
  let closest: PointCoordinates = multiLine[0][0];
  let minDist = Infinity;

  for (const line of multiLine) {
    const lineClosest = closestPointOnLine(line, point);
    const dist = Math.hypot(point[0] - lineClosest[0], point[1] - lineClosest[1]);

    if (dist < minDist) {
      minDist = dist;
      closest = lineClosest;
    }
  }

  return closest;
}

/**
 * Находит перпендикуляр от точки к изолинии (MultiLineString)
 */
export function findPerpendicularToLine(
  multiLine: MultiLineStringCoordinates,
  point: PointCoordinates,
): LineStringCoordinates {
  const nearest = closestPointOnMultiLineString(multiLine, point);
  return [point, nearest]; // Отрезок между точкой и ближайшей точкой
}
