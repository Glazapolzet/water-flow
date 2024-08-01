import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { selectTheme } from './select';

const config: ThemeConfig = { initialColorMode: 'dark' };

const theme = extendTheme({ config, components: { Select: selectTheme } });

export default theme;
