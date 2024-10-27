import { Spinner } from '@chakra-ui/react';
import { FC } from 'react';
import styles from './CustomSpinner.module.scss';

export const CustomSpinner: FC = () => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal.500"
      size="xl"
      className={styles.spinner}
    />
  );
};
