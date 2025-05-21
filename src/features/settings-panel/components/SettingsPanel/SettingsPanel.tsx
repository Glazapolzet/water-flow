import { HideableButton } from '@/components';
import { Heading, Stack, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { FC } from 'react';
import { SettingsButton } from '../../types';
import { FlowLineSettings, TFlowLineSettings } from '../FlowLineSettings/FlowLineSettings';
import { MainSettings, TMainSettings } from '../MainSettings/MainSettings';
import { TWParametersSettings, WParametersSettings } from '../WParametersSettings/WParametersSettings';
import styles from './SettingsPanel.module.scss';

export type TSettingsPanel = {
  title: string;
  mainSettings: TMainSettings & { tabName: string };
  flowLineSettings: TFlowLineSettings & { tabName: string };
  wParametersSettings: TWParametersSettings & { tabName: string };
  clearButton: SettingsButton;
  confirmButton: SettingsButton;
};

export const SettingsPanel: FC<TSettingsPanel> = ({
  title,
  mainSettings,
  flowLineSettings,
  wParametersSettings,
  clearButton,
  confirmButton,
}) => {
  const { tabName: mainSettingsTabName, ...mainSettingsProps } = mainSettings;
  const { tabName: flowLineSettingsTabName, ...flowLineSettingsProps } = flowLineSettings;
  const { tabName: wParametersSettingsTabName, ...wParametersSettingsProps } = wParametersSettings;

  const { title: clearButtonTitle, ...clearButtonProps } = clearButton;
  const { title: confirmButtonTitle, ...confirmButtonProps } = confirmButton;

  return (
    <Stack overflowY={'scroll'} align={'start'} direction={'column'} divider={<StackDivider borderColor={'white'} />}>
      <Heading as={'h2'} size={'lg'}>
        {title}
      </Heading>

      <Stack spacing={10} direction={'column'} className={styles.optionsContainer}>
        <Tabs variant={'solid-rounded'} colorScheme="teal">
          <TabList flexWrap={'wrap'} width={'100%'} gap={2}>
            <Tab bg={'gray.100'} color={'black'} _selected={{ color: 'white', bg: 'teal.500' }}>
              {mainSettingsTabName}
            </Tab>
            <Tab bg={'gray.100'} color={'black'} _selected={{ color: 'white', bg: 'teal.500' }}>
              {flowLineSettingsTabName}
            </Tab>
            <Tab bg={'gray.100'} color={'black'} _selected={{ color: 'white', bg: 'teal.500' }}>
              {wParametersSettingsTabName}
            </Tab>
            <Tab bg={'gray.100'} color={'black'} _selected={{ color: 'white', bg: 'teal.500' }}>
              Параметры для расчета L
            </Tab>
          </TabList>
          <TabPanels marginTop={5}>
            <TabPanel padding={0}>
              <MainSettings {...mainSettingsProps} />
            </TabPanel>
            <TabPanel padding={0}>
              <FlowLineSettings {...flowLineSettingsProps} />
            </TabPanel>
            <TabPanel padding={0}>
              <WParametersSettings {...wParametersSettingsProps} />
            </TabPanel>
            <TabPanel padding={0}>
              <FlowLineSettings {...flowLineSettingsProps} />
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
