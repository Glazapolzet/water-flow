import { extendTheme } from '@chakra-ui/react';
import { selectTheme } from './select';
import { themeConfig } from './themeConfig';

const theme = extendTheme({ themeConfig, components: { Select: selectTheme } });

export default theme;
