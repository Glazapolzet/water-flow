import { Map } from 'ol';
import { Modify, Select } from 'ol/interaction';

export class ExampleModify {
  map: Map;
  select: Select;
  modify: Modify;

  constructor(map: Map) {
    this.map = map;
    this.select = new Select();
    this.modify = new Modify({
      features: this.select.getFeatures(),
    });
  }

  _setEvents() {
    const selectedFeatures = this.select.getFeatures();

    this.select.on('change:active', function () {
      selectedFeatures.forEach(function (each) {
        selectedFeatures.remove(each);
      });
    });
  }

  setActive(active: boolean) {
    this.select.setActive(active);
    this.modify.setActive(active);
  }

  init() {
    this.map.addInteraction(this.select);
    this.map.addInteraction(this.modify);

    this._setEvents();
  }
}
