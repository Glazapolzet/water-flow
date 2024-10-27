import { CustomSelect } from '@/components';
import { Heading, Stack } from '@chakra-ui/react';
import { FC } from 'react';
import { SelectOptions } from '../../types';

export const SelectionAreaSelect: FC<SelectOptions> = ({ heading, options, defaultValue, onChange }) => {
  return (
    <Stack spacing={2}>
      <Heading as={'h4'} size={'md'}>
        {heading}
      </Heading>
      <CustomSelect
        borderColor={'gray.500'}
        borderWidth={'1px'}
        options={options}
        size={'md'}
        variant={'filled'}
        defaultValue={defaultValue ?? ''}
        onChange={onChange}
      />
    </Stack>
  );
};
