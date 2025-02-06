import { Select as ChakraSelect } from '@chakra-ui/react';
import { ComponentProps, ComponentPropsWithoutRef, FC } from 'react';

type SelectWithOptions = ComponentProps<typeof ChakraSelect> & {
  options: ComponentPropsWithoutRef<'option'>[];
};

export const SelectWithOptions: FC<SelectWithOptions> = ({ options, ...props }) => {
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
