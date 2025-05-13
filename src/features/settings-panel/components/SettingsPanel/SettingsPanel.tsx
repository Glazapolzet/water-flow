import { HideableButton, SelectWithOptions, TitledComponent } from '@/components';
import {
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Switch,
} from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsButton, SettingsNumber, SettingsSelect, SettingsSwitch } from '../../types';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  title: string;
  activeLayer: SettingsSelect;
  selectionArea: SettingsSelect;
  splineIsolines: SettingsSwitch;
  isolinesDelta: SettingsNumber;
  pointsDelta: SettingsNumber;
  clearButton: SettingsButton;
  confirmButton: SettingsButton;
}

export const SettingsPanel: FC<SettingsPanel> = ({
  title,
  activeLayer,
  selectionArea,
  splineIsolines,
  isolinesDelta,
  pointsDelta,
  clearButton,
  confirmButton,
}) => {
  const { title: activeLayerTitle, ...activeLayerProps } = activeLayer;
  const { title: selectionAreaTitle, ...selectionAreaProps } = selectionArea;
  const { title: splineIsolinesTitle, ...splineIsolinesProps } = splineIsolines;
  const { title: isolinesDeltaTitle, ...isolinesDeltaProps } = isolinesDelta;
  const { title: pointsDeltaTitle, ...pointsDeltaProps } = pointsDelta;

  const { title: clearButtonTitle, ...clearButtonProps } = clearButton;
  const { title: confirmButtonTitle, ...confirmButtonProps } = confirmButton;

  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'white'} />}>
      <Heading as={'h2'} size={'lg'}>
        {title}
      </Heading>

      <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
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
            <NumberInput step={5} variant={'filled'} focusBorderColor={'teal.200'} {...isolinesDeltaProps}>
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
            <NumberInput step={5} variant={'filled'} focusBorderColor={'teal.200'} {...pointsDeltaProps}>
              <NumberInputField borderColor={'gray.400'} borderWidth={'1px'} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          }
        />

        <HideableButton colorScheme={'teal'} variant={'outline'} opacity={'1'} {...clearButtonProps}>
          {clearButtonTitle}
        </HideableButton>

        <HideableButton colorScheme={'teal'} opacity={'1'} bgColor={'teal.200'} {...confirmButtonProps}>
          {confirmButtonTitle}
        </HideableButton>
      </Stack>
    </Stack>
  );
};
