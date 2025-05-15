import { TitledComponent } from '@/components';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsNumber } from '../../types';

export type TFlowLineSettings = {
  threshold: SettingsNumber;
  exponent: SettingsNumber;
  minLength: SettingsNumber;
};

export const FlowLineSettings: FC<TFlowLineSettings> = ({ threshold, exponent, minLength }) => {
  const { title: thresholdTitle, ...thresholdProps } = threshold;
  const { title: exponentTitle, ...exponentProps } = exponent;
  const { title: minLengthTitle, ...minLengthProps } = minLength;

  return (
    <Stack spacing={4} direction={'column'}>
      <TitledComponent
        title={thresholdTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...thresholdProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />

      <TitledComponent
        title={exponentTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...exponentProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />

      <TitledComponent
        title={minLengthTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...minLengthProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />
    </Stack>
  );
};
