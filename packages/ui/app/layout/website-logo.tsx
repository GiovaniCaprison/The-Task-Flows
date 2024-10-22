import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';

import { Link } from '../components/link';

export const WebsiteLogo: FunctionComponent = () => {
  return (
    <Box component='span' sx={{ display: 'flex', flexGrow: { xs: 1, md: 0 }, marginTop: '-4' }}>
      <Link href={'/'}>
        <img src={'/img/Logo32.png'} alt={'Logo'} />
        <Box
          component='span'
          sx={{
            color: 'secondary.main',
            display: 'inline-block',
            fontFamily: 'Roboto',
            fontSize: '25px',
            fontWeight: 400,
            letterSpacing: 0.13,
            transform: 'translate(6px,-6px)',
            marginRight: '14px',
          }}>
          TheTaskFlows
        </Box>
      </Link>
    </Box>
  );
};
