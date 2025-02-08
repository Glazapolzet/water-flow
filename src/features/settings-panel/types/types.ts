import { HideableButton, SelectWithOptions } from '@/components';
import { Checkbox, NumberInput } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export type SettingsSelect = ComponentProps<typeof SelectWithOptions> & { title: string };

export type SettingsCheckbox = ComponentProps<typeof Checkbox> & { title: string };

export type SettingsButton = ComponentProps<typeof HideableButton> & { title: string };

export type SettingsNumber = ComponentProps<typeof NumberInput> & { title: string };
