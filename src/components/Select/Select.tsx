import { Select as ChakraSelect } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

type Select = ComponentProps<typeof ChakraSelect> & {
  options: Array<ComponentProps<'option'>>;
};

export const Select: FC<Select> = ({ options, ...props }) => {
  return (
    <ChakraSelect {...props}>
      {options.map(({ children, id, ...props }, index) => (
        <option key={id ?? index} {...props}>
          {children}
        </option>
      ))}
    </ChakraSelect>
  );
};
