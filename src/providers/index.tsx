import theme from '@/theme';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface Provider {
  children: ReactNode;
}

const Provider: FC<Provider> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </>
  );
};

export default Provider;
