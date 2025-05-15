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
  mainSettings: TMainSettings;
  flowLineSettings: TFlowLineSettings;
  wParametersSettings: TWParametersSettings;
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
  const { title: clearButtonTitle, ...clearButtonProps } = clearButton;
  const { title: confirmButtonTitle, ...confirmButtonProps } = confirmButton;

  return (
    <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor={'white'} />}>
      <Heading as={'h2'} size={'lg'}>
        {title}
      </Heading>

      <Stack spacing={10} direction={'column'} className={styles.optionsContainer}>
        <Tabs variant={'solid-rounded'} colorScheme="teal">
          <TabList gap={1} flexWrap={'wrap'} width={'100%'}>
            <Tab>Основные</Tab>
            <Tab>Анализ склона</Tab>
            <Tab>Параметры для расчета W</Tab>
            <Tab>Параметры для расчета L</Tab>
          </TabList>
          <TabPanels marginTop={30}>
            <TabPanel padding={0}>
              <MainSettings {...mainSettings} />
            </TabPanel>
            <TabPanel padding={0}>
              <FlowLineSettings {...flowLineSettings} />
            </TabPanel>
            <TabPanel padding={0}>
              <WParametersSettings {...wParametersSettings} />
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
