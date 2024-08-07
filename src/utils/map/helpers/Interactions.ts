import { Map } from 'ol';
import Interaction from 'ol/interaction/Interaction';

export class Interactions {
  interactions: Interaction[];

  constructor(interactions: Interaction[]) {
    this.interactions = interactions;
  }

  get(name?: string) {
    if (!name) {
      return this.interactions;
    }

    return this.interactions.find((interaction) => interaction.getProperties()?.name === name);
  }

  getProps(name?: string): Record<string, any> {
    if (!name) {
      return this.interactions.reduce((accum, interaction) => {
        const props = interaction.getProperties();

        return Object.assign(accum, {
          [`${props.name}`]: props,
        });
      }, {});
    }

    const interaction = this.get(name) as Interaction;

    return interaction?.getProperties();
  }

  addInteractions(map: Map, names: string[]) {
    const interactions = names.map((name) => this.get(name) as Interaction | undefined);

    interactions.forEach((interaction) => {
      if (!interaction) {
        return;
      }

      map.addInteraction(interaction);
    });
  }

  removeInteractions(map: Map, names: string[]) {
    const interactions = names.map((name) => this.get(name) as Interaction | undefined);

    interactions.forEach((interaction) => {
      if (!interaction) {
        return;
      }

      map.removeInteraction(interaction);
    });
  }
}
