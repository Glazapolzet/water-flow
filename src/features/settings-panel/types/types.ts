import { HideableButton, SelectWithOptions } from '@/components';
import { Checkbox } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export type SettingsSelect = ComponentProps<typeof SelectWithOptions> & { title: string };

export type SettingsCheckbox = ComponentProps<typeof Checkbox> & { title: string };

export type SettingsButton = ComponentProps<typeof HideableButton> & { title: string };
