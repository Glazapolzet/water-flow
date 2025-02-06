import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { ComponentProps, FC } from 'react';
import styles from './HideableButton.module.scss';

type HideableButton = ComponentProps<typeof Button> & {
  isVisible: boolean;
};

export const HideableButton: FC<HideableButton> = ({ children, isVisible, className, ...props }) => {
  return (
    <Button
      className={clsx(styles.button, !isVisible && styles.button_hidden, {
        [className ?? '']: className,
      })}
      {...props}
    >
      {children}
    </Button>
  );
};
