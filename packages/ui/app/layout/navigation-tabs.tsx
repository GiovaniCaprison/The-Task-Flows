import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import { DarkModeContext } from './theme-provider';
import { routes } from '../routes';
import { NonIndexRoute } from '../types/route';

export const NavigationTabs: FunctionComponent = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  const navigationTabRoutes = routes.filter((route): route is NonIndexRoute => !route.index);

  const activeTabIndex = navigationTabRoutes.findIndex((route) => matchPath(route.path, location.pathname));

  const handleTabChange = (event: ChangeEvent<unknown>, index: number): void => {
    const newPath = navigationTabRoutes[index].path;

    // Save the current scroll position before navigating
    setScrollPositions((prevPositions) => ({
      ...prevPositions,
      [location.pathname]: window.scrollY,
    }));

    navigate(newPath);
  };

  useEffect(() => {
    // Restore the scroll position when the location changes
    const savedPosition = scrollPositions[location.pathname] || 0;
    window.scrollTo(0, savedPosition);
  }, [location.pathname, scrollPositions]);

  return (
    <Tabs
      indicatorColor='secondary'
      onChange={handleTabChange}
      sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: '10px' }}
      textColor='secondary'
      value={activeTabIndex}>
      {navigationTabRoutes.map((route, index) => (
        <Tab
          key={index}
          label={route.handle.title}
          sx={{
            '&.MuiTab-root': {
              color: isDarkMode ? 'grey.400' : 'text.primary',
              fontSize: '1.1em',
              margin: '0 5px',
              minWidth: 'unset',
              textTransform: 'none',
            },
          }}
          value={index}
        />
      ))}
    </Tabs>
  );
};
