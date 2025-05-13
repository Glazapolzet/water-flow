import { HideableButton, SelectWithOptions } from '@/components';
import { NumberInput, Slider, Switch } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export type SettingsSelect = ComponentProps<typeof SelectWithOptions> & { title: string };

export type SettingsSwitch = ComponentProps<typeof Switch> & { title: string };

export type SettingsButton = ComponentProps<typeof HideableButton> & { title: string };

export type SettingsNumber = ComponentProps<typeof NumberInput> & { title: string };

export type SettingsSlider = ComponentProps<typeof Slider> & { title: string };
