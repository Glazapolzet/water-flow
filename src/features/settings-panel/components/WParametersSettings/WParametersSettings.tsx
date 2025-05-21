import { SelectWithOptions, TitledComponent } from '@/components';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsNumber, SettingsSelect } from '../../types';

export type TWParametersSettings = {
  alpha: SettingsNumber;
  Kt: SettingsSelect;
  Km: SettingsSelect;
  Ke: SettingsSelect;
  h: SettingsNumber;
  WLimit: SettingsNumber;
};

export const WParametersSettings: FC<TWParametersSettings> = ({ alpha, Kt, Km, Ke, h, WLimit }) => {
  const { title: alphaTitle, ...alphaProps } = alpha;
  const { title: KtTitle, ...KtProps } = Kt;
  const { title: KmTitle, ...KmProps } = Km;
  const { title: KeTitle, ...KeProps } = Ke;
  const { title: hTitle, ...hProps } = h;
  const { title: WLimitTitle, ...WLimitProps } = WLimit;

  return (
    <Stack spacing={4} direction={'column'}>
      <TitledComponent
        title={alphaTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...alphaProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />

      <TitledComponent
        title={hTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...hProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />

      <TitledComponent
        title={KtTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <SelectWithOptions borderColor={'gray.400'} borderWidth={'1px'} size={'md'} variant={'filled'} {...KtProps} />
        }
      />

      <TitledComponent
        title={KmTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <SelectWithOptions borderColor={'gray.400'} borderWidth={'1px'} size={'md'} variant={'filled'} {...KmProps} />
        }
      />

      <TitledComponent
        title={KeTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <SelectWithOptions borderColor={'gray.400'} borderWidth={'1px'} size={'md'} variant={'filled'} {...KeProps} />
        }
      />

      <TitledComponent
        title={WLimitTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...WLimitProps}>
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
