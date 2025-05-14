import { expect, test } from 'vitest';
import { transformFlowAccumulationToFlowLines } from './transformFlowAccumulationToFlowLines';

const elevationGrid = [
  [5, 3, 2],
  [4, 2, 1],
  [3, 1, 0],
];

const coordinatesGrid = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
];

const flowGrid = [
  [1, 2, 3],
  [1, 2, 4],
  [1, 2, 7],
];

test('transform flow accumulation to flow lines', () => {
  const result = transformFlowAccumulationToFlowLines(elevationGrid, coordinatesGrid, flowGrid);

  // Проверяем структуру GeoJSON
  expect(result.type).toBe('FeatureCollection');
  expect(result.features.length).toBeGreaterThan(0);

  // Проверяем, что линия содержит все ожидаемые точки (в любом порядке)
  const expectedPoints = [
    [0, 0, 5],
    [1, 1, 2],
    [2, 2, 0],
  ];
  const linePoints = result.features[0].geometry.coordinates;

  expect(linePoints).toEqual(expect.arrayContaining(expectedPoints));
  expect(linePoints).toHaveLength(expectedPoints.length);
});

test('local minimum handling', () => {
  const flatElevation = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

  const result = transformFlowAccumulationToFlowLines(flatElevation, coordinatesGrid, flowGrid);

  // Не должно быть линий (нет уклона)
  expect(result.features).toHaveLength(0);
});

test('edge flow', () => {
  const edgeFlowGrid = [
    [0, 0, 10], // Поток только в правом верхнем углу
    [0, 0, 0],
    [0, 0, 0],
  ];

  const result = transformFlowAccumulationToFlowLines(elevationGrid, coordinatesGrid, edgeFlowGrid);

  const expectedPoints = [
    [2, 0, 2],
    [2, 1, 1],
    [2, 2, 0],
  ];

  const linePoints = result.features[0].geometry.coordinates;

  // Линия должна идти от (2,0) вниз
  expect(linePoints).toEqual(expect.arrayContaining(expectedPoints));
  expect(linePoints).toHaveLength(expectedPoints.length);
});
