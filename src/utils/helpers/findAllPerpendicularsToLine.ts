type PointCoordiates = [number, number];
type LineStringCoordiates = [number, number][];

/**
 * Вычисляет ближайшую точку на отрезке [A, B] к точке P
 */
function closestPointOnSegment(A: PointCoordiates, B: PointCoordiates, P: PointCoordiates): PointCoordiates | null {
  const [Ax, Ay] = A;
  const [Bx, By] = B;
  const [Px, Py] = P;

  const ABx = Bx - Ax;
  const ABy = By - Ay;
  const APx = Px - Ax;
  const APy = Py - Ay;

  const ab2 = ABx * ABx + ABy * ABy; // Длина AB в квадрате
  const ap_ab = APx * ABx + APy * ABy; // Скалярное произведение

  const t = ap_ab / ab2; // Проекция точки на линию AB

  if (t >= 0 && t <= 1) {
    // Точка лежит внутри отрезка
    return [Ax + ABx * t, Ay + ABy * t];
  } else {
    return null; // Точка за пределами отрезка
  }
}

/**
 * Находит все перпендикуляры от точки ко всей линии (если они существуют)
 */
export const findAllPerpendicularsToLine = (
  line: LineStringCoordiates,
  point: PointCoordiates,
): LineStringCoordiates[] => {
  const perpendiculars: LineStringCoordiates[] = [];

  for (let i = 0; i < line.length - 1; i++) {
    const A = line[i];
    const B = line[i + 1];

    const perpendicularPoint = closestPointOnSegment(A, B, point);

    if (perpendicularPoint) {
      perpendiculars.push([point, perpendicularPoint]);
    }
  }

  return perpendiculars;
};
