import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FunctionComponent, useState } from 'react';
import Box from '@mui/material/Box';

import { Link } from '../components/link';
import { routes } from '../routes';
import { NonIndexRoute } from '../types/route';

export const NavigationMenu: FunctionComponent = () => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, marginRight: '1em' }}>
      <IconButton size='large' aria-haspopup='true' onClick={handleOpenNavMenu}>
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}>
        {routes
          .filter((route): route is NonIndexRoute => !route.index)
          .map((route, index) => (
            <MenuItem key={index} onClick={handleCloseNavMenu}>
              <Link href={route.path} key={index} sx={{ color: 'text.primary' }}>
                {route.handle.title}
              </Link>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};
