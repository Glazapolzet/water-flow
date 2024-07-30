import { Spinner } from '@chakra-ui/react';
import { FC } from 'react';

export const Loader: FC = () => {
  return <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />;
};
