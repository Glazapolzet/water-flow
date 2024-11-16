import { Checkbox } from '@chakra-ui/react';
import { FC } from 'react';
import { CheckboxOptions } from '../../types/types';

export const SplineIsolinesCheckbox: FC<CheckboxOptions> = ({ title, isChecked, onChange }) => {
  return (
    <Checkbox colorScheme="teal" onChange={onChange} isChecked={isChecked}>
      {title}
    </Checkbox>
  );
};
