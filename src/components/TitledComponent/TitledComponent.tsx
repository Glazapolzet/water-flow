import { Heading, Stack } from '@chakra-ui/react';
import { FC } from 'react';

interface TitledComponent {
  title: string;
  Component: React.ReactNode;
}

export const TitledComponent: FC<TitledComponent> = ({ title, Component }) => {
  return (
    <Stack spacing={2}>
      <Heading as={'h4'} size={'md'}>
        {title}
      </Heading>
      {Component}
    </Stack>
  );
};
