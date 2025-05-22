import { SelectWithOptions, TitledComponent } from '@/components';
import { Stack } from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsSelect } from '../../types';

export type TLParametersSettings = {
  Lv: SettingsSelect;
  Lp: SettingsSelect;
};

export const LParametersSettings: FC<TLParametersSettings> = ({ Lv, Lp }) => {
  const { title: LvTitle, ...LvProps } = Lv;
  const { title: LpTitle, ...LpProps } = Lp;

  return (
    <Stack spacing={4} direction={'column'}>
      <TitledComponent
        title={LvTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <SelectWithOptions borderColor={'gray.400'} borderWidth={'1px'} size={'md'} variant={'filled'} {...LvProps} />
        }
      />

      <TitledComponent
        title={LpTitle}
        titleProps={{ size: 'sm' }}
        Component={
          <SelectWithOptions borderColor={'gray.400'} borderWidth={'1px'} size={'md'} variant={'filled'} {...LpProps} />
        }
      />
    </Stack>
  );
};
