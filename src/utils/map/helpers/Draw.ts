import { Draw } from 'ol/interaction';
import { Interactions } from './Interactions';

export class DrawInteractions extends Interactions {
  constructor(drawInteractions: Draw[]) {
    super(drawInteractions);
  }
}
