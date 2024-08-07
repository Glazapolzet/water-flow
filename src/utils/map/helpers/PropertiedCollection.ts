import { Collection } from 'ol';
import BaseObject from 'ol/Object';

export type Options = {
  unique?: boolean | undefined;
};

export class PropertiedCollection<T extends BaseObject> extends Collection<T> {
  items: T[];

  constructor(array: T[], options?: Options) {
    super(array, options);

    this.items = array;
  }

  getProperties(name?: string): Record<string, any> {
    if (!name) {
      return this.items.reduce((accum, item) => {
        const props = item.getProperties();

        return Object.assign(accum, {
          [`${props.name}`]: props,
        });
      }, {});
    }

    const item = this.get(name) as T;

    return item?.getProperties();
  }
}
