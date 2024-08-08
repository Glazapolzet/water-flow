import { Select, VisibleButton } from '@/components';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import { Map } from 'ol';
import { ChangeEvent, ComponentProps, FC, MutableRefObject } from 'react';
import styles from './SettingsPanel.module.scss';

type SelectOpts = {
  defaultValue?: string;
  options: ComponentProps<'option'>[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

interface SettingsPanel {
  mapRef: MutableRefObject<Map | undefined>;
  layerSelect: SelectOpts;
  drawSelect: SelectOpts;
  showConfirmAreaButton: boolean;
}

export const SettingsPanel: FC<SettingsPanel> = ({ layerSelect, drawSelect, showConfirmAreaButton }) => {
  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'gray.500'} />}>
      <Heading as={'h2'} size={'lg'}>
        Settings
      </Heading>

      <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
        <Stack spacing={2}>
          <Heading as={'h4'} size={'md'}>
            Layers
          </Heading>
          <Select
            borderColor={'gray.500'}
            borderWidth={'1px'}
            options={layerSelect.options}
            size={'md'}
            variant={'outline'}
            defaultValue={layerSelect.defaultValue ?? ''}
            onChange={layerSelect.onChange}
          />
        </Stack>
        <Stack spacing={2}>
          <Heading as={'h4'} size={'md'}>
            Select area
          </Heading>
          <Select
            borderColor={'gray.500'}
            borderWidth={'1px'}
            options={drawSelect.options}
            size={'md'}
            variant={'filled'}
            defaultValue={drawSelect.defaultValue ?? ''}
            onChange={drawSelect.onChange}
          />
        </Stack>
        <VisibleButton
          colorScheme={'gray'}
          opacity={'.75'}
          bgColor={'whiteAlpha.400'}
          isVisible={showConfirmAreaButton}
        >
          Calculate selected area
        </VisibleButton>
      </Stack>
    </Stack>
  );
};
