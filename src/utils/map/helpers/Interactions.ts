import Interaction from 'ol/interaction/Interaction';
import { PropertiedCollection, Options as PropertiedCollectionOptions } from './PropertiedCollection';

export type Options = PropertiedCollectionOptions;

export class Interactions extends PropertiedCollection<Interaction> {
  interactions: Interaction[];

  constructor(interactions: Interaction[], options?: Options) {
    super(interactions, options);

    this.interactions = interactions;
  }

  get(name?: string) {
    if (!name) {
      return this.interactions;
    }

    return this.interactions.find((interaction) => interaction.getProperties()?.name === name);
  }

  // addInteractions(map: Map, names: string[]) {
  //   const interactions = names.map((name) => this.get(name) as Interaction | undefined);

  //   interactions.forEach((interaction) => {
  //     if (!interaction) {
  //       return;
  //     }

  //     map.addInteraction(interaction);
  //   });
  // }

  // removeInteractions(map: Map, names: string[]) {
  //   const interactions = names.map((name) => this.get(name) as Interaction | undefined);

  //   interactions.forEach((interaction) => {
  //     if (!interaction) {
  //       return;
  //     }

  //     map.removeInteraction(interaction);
  //   });
  // }
}
