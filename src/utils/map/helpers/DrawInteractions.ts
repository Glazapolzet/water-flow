import { Draw } from 'ol/interaction';
import { Interactions, Options as InteractionsOptions } from './Interactions';

type Options = InteractionsOptions;

export class DrawInteractions extends Interactions<Draw> {
  constructor(drawInteractions: Draw[], options?: Options) {
    super(drawInteractions, options);
  }
}
