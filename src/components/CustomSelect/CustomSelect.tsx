import { Select as ChakraSelect } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

type CustomSelect = ComponentProps<typeof ChakraSelect> & {
  options: ComponentProps<'option'>[];
};

export const CustomSelect: FC<CustomSelect> = ({ options, ...props }) => {
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
