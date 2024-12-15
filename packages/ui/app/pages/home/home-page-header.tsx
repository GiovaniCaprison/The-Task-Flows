import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import { FunctionComponent, useContext } from 'react';
import Box from '@mui/material/Box';

import { PageSection } from '../../components/page-section';
import { Text } from '../../components/text';
import { DarkModeContext } from '../../layout/theme-provider';

const FADE_IN_EFFECT = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const HomePageHeader: FunctionComponent = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = useTheme();

  return (
    <PageSection
      containerSx={{
        background: isDarkMode
          ? `radial-gradient(circle, #382D00 0%, ${theme.palette.background.default} 80%)`
          : `radial-gradient(circle, ${theme.palette.background.default} 60%, #CCCCCC 100%)`,
        backgroundColor: 'background.default',
      }}
      contentSx={{
        display: { xs: 'flex', md: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: 'min-content min-content',
        margin: '100px auto 100px',
        padding: '75px 0',
        width: 'min-content',
      }}>
      <Box
        sx={{
          color: 'white',
          margin: 'auto 0',
          textAlign: { xs: 'center', md: 'right' },
          width: 'min-content',
        }}>
        <Text sx={{ display: { xs: 'flex', sm: 'block' }, flexDirection: 'column', fontSize: '4.5rem', whiteSpace: 'nowrap' }} variant='h2'>
          <Box component='span' sx={{ animation: `${FADE_IN_EFFECT} 1s linear 0.5s 1 normal forwards`, opacity: 0 }}>
            Meet
          </Box>{' '}
          <Box component='span' sx={{ animation: `${FADE_IN_EFFECT} 1s linear 1s 1 normal forwards`, color: 'secondary.main', opacity: 0 }}>
            TheTaskFlows
          </Box>
        </Text>
        <Text sx={{ textAlign: 'center', animation: `${FADE_IN_EFFECT} 1s linear 2.25s 1 normal forwards`, fontSize: '1.6rem', opacity: 0 }}>
          Your tool for managing the things you need
        </Text>
        <Text sx={{ textAlign: 'center', animation: `${FADE_IN_EFFECT} 1s linear 2.25s 1 normal forwards`, fontSize: '1.6rem', opacity: 0 }}>
          When you need them
        </Text>
      </Box>
    </PageSection>
  );
};
