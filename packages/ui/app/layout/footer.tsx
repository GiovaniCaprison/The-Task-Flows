import { useTheme } from '@mui/material/styles';
import { FunctionComponent, useContext } from 'react';
import Box from '@mui/material/Box';

import { HelloFromRegion } from './hello-from-region';
import { DarkModeContext } from './theme-provider';
import { AmazonLogo } from '../components/amazon-logo';
import { PageSection } from '../components/page-section';
import { pagePadding } from '../constants/page-size';

export const Footer: FunctionComponent = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = useTheme();

  return (
    <Box component='footer' sx={{ marginTop: 'auto' }}>
      <PageSection
        containerSx={{ backgroundColor: 'background.default', borderBottom: 'none' }}
        contentSx={{
          display: 'grid',
          gridTemplateColumns: 'max-content auto max-content',
          padding: `20px ${pagePadding}`,
        }}>
        <HelloFromRegion />

        <Box component='span' sx={{ gridColumn: 3 }}>
          <AmazonLogo color={isDarkMode ? theme.palette.grey[400] : 'text.primary'} width='70px' />
        </Box>
      </PageSection>
    </Box>
  );
};
