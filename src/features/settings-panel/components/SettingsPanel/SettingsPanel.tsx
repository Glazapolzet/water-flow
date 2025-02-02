import { CustomButton } from '@/components';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import { FC } from 'react';
import { CheckboxOptions, ConfirmButtonOptions, SelectOptions } from '../../types';
import { ActiveLayerSelect } from '../ActiveLayerSelect/ActiveLayerSelect';
import { IsolinesTypeSelect } from '../IsolinesTypeSelect/IsolinesTypeSelect';
import { SelectionAreaSelect } from '../SelectionAreaSelect/SelectionAreaSelect';
import { SplineIsolinesCheckbox } from '../SplineIsolinesCheckbox/SplineIsolinesCheckbox';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  activeLayer: SelectOptions;
  isolinesType: SelectOptions;
  selectionArea: SelectOptions;
  splineIsolines: CheckboxOptions;
  confirmButton: ConfirmButtonOptions;
}

export const SettingsPanel: FC<SettingsPanel> = ({
  activeLayer,
  isolinesType,
  selectionArea,
  splineIsolines,
  confirmButton,
}) => {
  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'gray.500'} />}>
      <Heading as={'h2'} size={'lg'}>
        Settings
      </Heading>

      <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
        <ActiveLayerSelect
          title={activeLayer.title}
          options={activeLayer.options}
          onChange={activeLayer.onChange}
          defaultValue={activeLayer.defaultValue ?? ''}
        />

        <IsolinesTypeSelect
          title={isolinesType.title}
          options={isolinesType.options}
          onChange={isolinesType.onChange}
          defaultValue={isolinesType.defaultValue ?? ''}
        />

        <SelectionAreaSelect
          title={selectionArea.title}
          options={selectionArea.options}
          onChange={selectionArea.onChange}
          defaultValue={selectionArea.defaultValue ?? ''}
        />

        <SplineIsolinesCheckbox
          title={splineIsolines.title}
          onChange={splineIsolines.onChange}
          isChecked={splineIsolines.isChecked}
        />

        <CustomButton
          colorScheme={'teal'}
          opacity={'1'}
          bgColor={'teal.200'}
          isVisible={confirmButton.isVisible}
          onClick={confirmButton.onClick}
        >
          {confirmButton.title}
        </CustomButton>
      </Stack>
    </Stack>
  );
};
