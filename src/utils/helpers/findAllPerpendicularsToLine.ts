type PointCoordinates = [number, number];
type LineStringCoordinates = PointCoordinates[];
type MultiLineStringCoordinates = LineStringCoordinates[];

/**
 * Вычисляет ближайшую точку на отрезке [A, B] к точке P, если она проецируется внутрь отрезка
 */
function closestPointOnSegment(A: PointCoordinates, B: PointCoordinates, P: PointCoordinates): PointCoordinates | null {
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
    return [Ax + ABx * t, Ay + ABy * t]; // Ближайшая точка внутри отрезка
  }
  return null; // Точка проецируется за пределами отрезка
}

/**
 * Находит все перпендикуляры от точки ко всей изолинии (MultiLineString)
 */
export function findAllPerpendicularsToLine(
  multiLine: MultiLineStringCoordinates,
  point: PointCoordinates,
): LineStringCoordinates[] {
  const perpendiculars: LineStringCoordinates[] = [];

  for (const line of multiLine) {
    for (let i = 0; i < line.length - 1; i++) {
      const A = line[i];
      const B = line[i + 1];

      const perpendicularPoint = closestPointOnSegment(A, B, point);
      if (perpendicularPoint) {
        perpendiculars.push([point, perpendicularPoint]);
      }
    }
  }

  return perpendiculars;
}
