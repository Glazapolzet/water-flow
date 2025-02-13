import Interaction from 'ol/interaction/Interaction';

import { PropertiedCollection, Options as PropertiedCollectionOptions } from './PropertiedCollection';

export type Options = PropertiedCollectionOptions;

export class Interactions<T extends Interaction> extends PropertiedCollection<T> {
  interactions: T[];

  constructor(interactions: T[], options?: Options) {
    super(interactions, options);

    this.interactions = interactions;
  }

  get(name: string) {
    return this.interactions.find((interaction) => interaction.getProperties()?.name === name);
  }
}
