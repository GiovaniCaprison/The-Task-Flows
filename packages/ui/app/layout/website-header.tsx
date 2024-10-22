import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { FunctionComponent } from 'react';

import { DarkModeToggle } from './dark-mode-toggle';
import { NavigationMenu } from './navigation-menu';
import { NavigationTabs } from './navigation-tabs';
import { WebsiteLogo } from './website-logo';
import { maxPageWidth, pageMargin, pagePadding } from '../constants/page-size';

export const WebsiteHeader: FunctionComponent = () => {
  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return (
    <AppBar sx={{ backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none', paddingTop: '12px', zIndex: 1000 }}>
      <Container maxWidth='xl'>
        <Toolbar
          sx={{
            backdropFilter: 'blur(6px)',
            backgroundColor: trigger ? `${theme.palette.primary.dark}99` : 'transparent',
            borderRadius: '20px',
            boxShadow: trigger ? 'rgba(0, 0, 0, 0.24) 0px 4px 6px' : 'none',
            margin: pageMargin,
            maxWidth: maxPageWidth,
            padding: `0 ${pagePadding}`,
            transition: 'all ease 0.3s',
            width: `calc(100% - 2 * ${pagePadding})`,
            justifyContent: 'space-between', // Ensures space between elements
            alignItems: 'center', // Vertically centers the elements
          }}>
          <NavigationMenu />

          <WebsiteLogo />

          <NavigationTabs />

          <Stack alignItems='center' direction='row' spacing={2} sx={{ gridColumn: '3', margin: 'auto 0' }}>
            <DarkModeToggle />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
