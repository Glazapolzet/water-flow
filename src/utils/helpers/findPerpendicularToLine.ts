type PointCoordiates = [number, number];
type LineStringCoordiates = PointCoordiates[];

/**
 * Вычисляет ближайшую точку на отрезке [A, B] к точке P
 */
function closestPointOnSegment(A: PointCoordiates, B: PointCoordiates, P: PointCoordiates): PointCoordiates {
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
function closestPointOnLine(line: LineStringCoordiates, point: PointCoordiates): PointCoordiates {
  let closest: PointCoordiates = line[0];
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
 * Находит перпендикуляр от точки к линии
 */
export const findPerpendicularToLine = (line: LineStringCoordiates, point: PointCoordiates): LineStringCoordiates => {
  const nearest = closestPointOnLine(line, point);
  return [point, nearest]; // Отрезок между точкой и ближайшей точкой
};
