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

  if (ab2 === 0) {
    return A; // Если A и B совпадают, возвращаем A
  }

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
 * Находит все перпендикуляры от точки к изолинии (MultiLineString)
 * Если ни одного перпендикуляра не нашлось, возвращает линию до ближайшей точки
 */
export function findAllPathsToLine(
  multiLine: MultiLineStringCoordinates,
  point: PointCoordinates,
): LineStringCoordinates[] {
  const perpendiculars: LineStringCoordinates[] = [];

  for (const line of multiLine) {
    for (let i = 0; i < line.length - 1; i++) {
      const A = line[i];
      const B = line[i + 1];

      const perpendicularPoint = closestPointOnSegment(A, B, point);

      // Проверяем, что точка корректная
      if (!isNaN(perpendicularPoint[0]) && !isNaN(perpendicularPoint[1])) {
        perpendiculars.push([point, perpendicularPoint]);
      }
    }
  }

  // Если не найдено ни одного перпендикуляра, добавляем линию к ближайшей точке
  if (perpendiculars.length === 0) {
    const nearestPoint = closestPointOnLine(multiLine.flat(), point);
    perpendiculars.push([point, nearestPoint]);
  }

  return perpendiculars;
}
