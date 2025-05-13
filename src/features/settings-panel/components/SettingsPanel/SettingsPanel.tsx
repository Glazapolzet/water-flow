import { HideableButton } from '@/components';
import { Heading, Stack, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsButton } from '../../types';
import { FlowLineSettings } from '../FlowLineSettings/FlowLineSettings';
import { MainSettings } from '../MainSettings/MainSettings';
import styles from './SettingsPanel.module.scss';

interface SettingsPanel {
  title: string;
  mainSettings: MainSettings;
  flowLineSettings: FlowLineSettings;
  clearButton: SettingsButton;
  confirmButton: SettingsButton;
}

export const SettingsPanel: FC<SettingsPanel> = ({
  title,
  mainSettings,
  flowLineSettings,
  clearButton,
  confirmButton,
}) => {
  const { title: clearButtonTitle, ...clearButtonProps } = clearButton;
  const { title: confirmButtonTitle, ...confirmButtonProps } = confirmButton;

  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'white'} />}>
      <Heading as={'h2'} size={'lg'}>
        {title}
      </Heading>

      <Stack spacing={10} direction={'column'} className={styles.optionsContainer}>
        <Tabs variant={'solid-rounded'} colorScheme="teal">
          <TabList>
            <Tab>Основные</Tab>
            <Tab>Параметры склона</Tab>
          </TabList>
          <TabPanels marginTop={30}>
            <TabPanel padding={0}>
              <MainSettings {...mainSettings} />
            </TabPanel>
            <TabPanel padding={0}>
              <FlowLineSettings {...flowLineSettings} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Stack spacing={3} direction={'column'}>
          <HideableButton colorScheme={'teal'} variant={'outline'} opacity={'1'} {...clearButtonProps}>
            {clearButtonTitle}
          </HideableButton>

          <HideableButton colorScheme={'teal'} opacity={'1'} bgColor={'teal.200'} {...confirmButtonProps}>
            {confirmButtonTitle}
          </HideableButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
