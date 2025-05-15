import { FeatureCollection, LineString } from 'geojson';
import { describe, expect, it } from 'vitest';
import { makeFlowLineDistanceElevationData } from './makeFlowLineDistanceElevationData';

describe('makeFlowLineDistanceElevationData', () => {
  it('корректно вычисляет расстояния и высоты для LineString', () => {
    const featureCollection: FeatureCollection<LineString> = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [
              [0, 0, 120], // A
              [3, 0, 110], // B (расстояние AB = 3)
              [3, 4, 100], // C (расстояние BC = 4)
            ],
          },
          properties: {},
        },
      ],
    };

    const result = makeFlowLineDistanceElevationData(featureCollection);

    // Проверяем расстояния (нарастающий итог: 0 → 3 → 7)
    expect(result.distances).toEqual([0, 3, 7]);

    // Проверяем высоты
    expect(result.elevations).toEqual([120, 110, 100]);
  });

  it('возвращает [0] и высоту первой точки для LineString с одной точкой', () => {
    const featureCollection: FeatureCollection<LineString> = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [[10, 20, 50]], // Одна точка
          },
          properties: {},
        },
      ],
    };

    const result = makeFlowLineDistanceElevationData(featureCollection);
    expect(result.distances).toEqual([0]);
    expect(result.elevations).toEqual([50]);
  });

  it('возвращает пустые значения расстояния и высоты для пустого FeatureCollection', () => {
    const featureCollection: FeatureCollection<LineString> = {
      type: 'FeatureCollection' as const,
      features: [], // Пустая коллекция
    };

    const result = makeFlowLineDistanceElevationData(featureCollection);
    expect(result.distances).toEqual([]);
    expect(result.elevations).toEqual([]);
  });
});
