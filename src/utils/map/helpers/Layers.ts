import BaseLayer from 'ol/layer/Base';
import { PropertiedCollection, Options as PropertiedCollectionOptions } from './PropertiedCollection';

export type Options = PropertiedCollectionOptions;

export class Layers extends PropertiedCollection<BaseLayer> {
  layers: BaseLayer[];

  constructor(layers: BaseLayer[], options?: Options) {
    super(layers, options);

    this.layers = layers;
  }

  get(name?: string) {
    if (!name) {
      return this.layers;
    }

    return this.layers.find((layer) => layer.getProperties()?.name === name);
  }
}
