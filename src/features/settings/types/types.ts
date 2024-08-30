import { ChangeEvent, ComponentProps, MouseEvent } from 'react';

export type SelectOptions = {
  heading: string;
  defaultValue?: string;
  options: ComponentProps<'option'>[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export type IsolineSelectOptions = SelectOptions & {
  splineCheckbox: {
    heading: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isChecked: boolean;
  };
};

export type ConfirmButtonOptions = {
  heading: string;
  isVisible: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};
