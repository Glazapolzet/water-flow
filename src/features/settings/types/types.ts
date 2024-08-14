import { ChangeEvent, ComponentProps } from 'react';

export type SelectOptions = {
  defaultValue?: string;
  options: ComponentProps<'option'>[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};
