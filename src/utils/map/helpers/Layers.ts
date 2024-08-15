import { Map } from 'ol';
import BaseLayer from 'ol/layer/Base';
import { PropertiedCollection, Options as PropertiedCollectionOptions } from './PropertiedCollection';

export type Options = PropertiedCollectionOptions;

export class Layers<T extends BaseLayer> extends PropertiedCollection<T> {
  layers: T[];

  constructor(layers: T[], options?: Options) {
    super(layers, options);

    this.layers = layers;
  }

  get(name: string) {
    return this.layers.find((layer) => layer.getProperties()?.name === name);
  }

  addLayers(map: Map, layers: T[]) {
    layers.forEach((layer) => map.addLayer(layer));
  }

  removeLayers(map: Map, layers: T[]) {
    layers.forEach((layer) => map.removeLayer(layer));
  }
}
