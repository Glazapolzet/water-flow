import { SelectWithOptions, TitledComponent } from '@/components';
import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsNumber, SettingsSelect, SettingsSwitch } from '../../types';

export type MainSettings = {
  activeLayer: SettingsSelect;
  selectionArea: SettingsSelect;
  splineIsolines: SettingsSwitch;
  isolinesDelta: SettingsNumber;
  pointsDelta: SettingsNumber;
};

export const MainSettings: FC<MainSettings> = ({
  activeLayer,
  selectionArea,
  splineIsolines,
  isolinesDelta,
  pointsDelta,
}) => {
  const { title: activeLayerTitle, ...activeLayerProps } = activeLayer;
  const { title: selectionAreaTitle, ...selectionAreaProps } = selectionArea;
  const { title: splineIsolinesTitle, ...splineIsolinesProps } = splineIsolines;
  const { title: isolinesDeltaTitle, ...isolinesDeltaProps } = isolinesDelta;
  const { title: pointsDeltaTitle, ...pointsDeltaProps } = pointsDelta;

  return (
    <Stack spacing={4} direction={'column'}>
      <TitledComponent
        title={activeLayerTitle}
        Component={
          <SelectWithOptions
            borderColor={'gray.400'}
            borderWidth={'1px'}
            size={'md'}
            variant={'filled'}
            {...activeLayerProps}
          />
        }
      />

      <TitledComponent
        title={selectionAreaTitle}
        Component={
          <SelectWithOptions
            borderColor={'gray.400'}
            borderWidth={'1px'}
            size={'md'}
            variant={'filled'}
            {...selectionAreaProps}
          />
        }
      />

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          {splineIsolinesTitle}
        </FormLabel>
        <Switch {...splineIsolinesProps} colorScheme={'teal'} size="md" id="email-alerts" />
      </FormControl>

      <TitledComponent
        title={isolinesDeltaTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...isolinesDeltaProps}>
            <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        }
      />

      <TitledComponent
        title={pointsDeltaTitle}
        Component={
          <NumberInput variant={'filled'} focusBorderColor={'teal.200'} {...pointsDeltaProps}>
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
