import { Heading, Stack } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

interface TitledComponent {
  title: string;
  titleProps?: ComponentProps<typeof Heading>;
  Component: React.ReactNode;
}

export const TitledComponent: FC<TitledComponent> = ({ title, titleProps, Component }) => {
  const { as = 'h4', size = 'md', ...otherProps } = titleProps || {};

  return (
    <Stack spacing={2}>
      <Heading as={as} size={size} {...otherProps}>
        {title}
      </Heading>
      {Component}
    </Stack>
  );
};
