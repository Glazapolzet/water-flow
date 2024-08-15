import { Select, VisibleButton } from '@/components';
import { Checkbox, Heading, Stack, StackDivider } from '@chakra-ui/react';
import { Map } from 'ol';
import { FC, MutableRefObject } from 'react';
import { ConfirmButtonOptions, IsolineSelectOptions, SelectOptions } from '../../types';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  mapRef: MutableRefObject<Map | undefined>;
  layerSelect: SelectOptions;
  figureSelect: SelectOptions;
  isolineSelect: IsolineSelectOptions;
  confirmButton: ConfirmButtonOptions;
}

export const SettingsPanel: FC<SettingsPanel> = ({ layerSelect, figureSelect, isolineSelect, confirmButton }) => {
  const selectItems = [layerSelect, figureSelect, isolineSelect];

  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'gray.500'} />}>
      <Heading as={'h2'} size={'lg'}>
        Settings
      </Heading>

      <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
        {selectItems.map((item, index) => (
          <Stack spacing={2} key={index}>
            <Heading as={'h4'} size={'md'}>
              {item.heading}
            </Heading>
            <Select
              borderColor={'gray.500'}
              borderWidth={'1px'}
              options={item.options}
              size={'md'}
              variant={'filled'}
              defaultValue={item.defaultValue ?? ''}
              onChange={item.onChange}
            />
          </Stack>
        ))}

        <Checkbox
          colorScheme="teal"
          onChange={isolineSelect.splineCheckbox.onChange}
          isChecked={isolineSelect.splineCheckbox.isChecked}
        >
          Spline isolines
        </Checkbox>

        <VisibleButton
          colorScheme={'teal'}
          opacity={'1'}
          bgColor={'teal.200'}
          isVisible={confirmButton.isVisible}
          onClick={confirmButton.onClick}
        >
          Calculate selected area
        </VisibleButton>
      </Stack>
    </Stack>
  );
};
