import { ChangeEvent, ComponentPropsWithoutRef, MouseEvent } from 'react';

export type SelectOptions = {
  title: string;
  defaultValue?: string;
  options: ComponentPropsWithoutRef<'option'>[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export type CheckboxOptions = {
  title: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
};

export type ButtonOptions = {
  title: string;
  isVisible: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};
