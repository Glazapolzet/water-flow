import { Select, VisibleButton } from '@/components';
import { Checkbox, Heading, Stack, StackDivider } from '@chakra-ui/react';
import { Map } from 'ol';
import { FC, MutableRefObject } from 'react';
import { ConfirmButtonOptions, IsolineSelectOptions, SelectOptions } from '../../types';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  mapRef: MutableRefObject<Map | undefined>;
  layer: SelectOptions;
  selectionType: SelectOptions;
  isolinesType: IsolineSelectOptions;
  confirmButton: ConfirmButtonOptions;
}

export const SettingsPanel: FC<SettingsPanel> = ({ layer, selectionType, isolinesType, confirmButton }) => {
  const selectItems = [layer, selectionType, isolinesType];

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
          onChange={isolinesType.splineCheckbox.onChange}
          isChecked={isolinesType.splineCheckbox.isChecked}
        >
          {isolinesType.splineCheckbox.heading}
        </Checkbox>

        <VisibleButton
          colorScheme={'teal'}
          opacity={'1'}
          bgColor={'teal.200'}
          isVisible={confirmButton.isVisible}
          onClick={confirmButton.onClick}
        >
          {confirmButton.heading}
        </VisibleButton>
      </Stack>
    </Stack>
  );
};
