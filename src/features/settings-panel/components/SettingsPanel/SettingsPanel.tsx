import { HideableButton, SelectWithOptions, TitledComponent } from '@/components';
import { Checkbox, Heading, Stack, StackDivider } from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsButton, SettingsCheckbox, SettingsSelect } from '../../types';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  activeLayer: SettingsSelect;
  isolinesType: SettingsSelect;
  selectionArea: SettingsSelect;
  splineIsolines: SettingsCheckbox;
  clearButton: SettingsButton;
  confirmButton: SettingsButton;
}

export const SettingsPanel: FC<SettingsPanel> = ({
  activeLayer,
  isolinesType,
  selectionArea,
  splineIsolines,
  clearButton,
  confirmButton,
}) => {
  const { title: activeLayerTitle, ...activeLayerProps } = activeLayer;
  const { title: isolinesTypeTitle, ...isolinesTypeProps } = isolinesType;
  const { title: selectionAreaTitle, ...selectionAreaProps } = selectionArea;
  const { title: splineIsolinesTitle, ...splineIsolinesProps } = splineIsolines;

  const { title: clearButtonTitle, ...clearButtonProps } = clearButton;
  const { title: confirmButtonTitle, ...confirmButtonProps } = confirmButton;

  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'gray.500'} />}>
      <Heading as={'h2'} size={'lg'}>
        Settings
      </Heading>

      <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
        <TitledComponent
          title={activeLayerTitle}
          Component={
            <SelectWithOptions
              borderColor={'gray.500'}
              borderWidth={'1px'}
              size={'md'}
              variant={'filled'}
              {...activeLayerProps}
            />
          }
        />

        <TitledComponent
          title={isolinesTypeTitle}
          Component={
            <SelectWithOptions
              borderColor={'gray.500'}
              borderWidth={'1px'}
              size={'md'}
              variant={'filled'}
              {...isolinesTypeProps}
            />
          }
        />

        <TitledComponent
          title={selectionAreaTitle}
          Component={
            <SelectWithOptions
              borderColor={'gray.500'}
              borderWidth={'1px'}
              size={'md'}
              variant={'filled'}
              {...selectionAreaProps}
            />
          }
        />

        <Checkbox colorScheme={'teal'} {...splineIsolinesProps}>
          {splineIsolinesTitle}
        </Checkbox>

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
