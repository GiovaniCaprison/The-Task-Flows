import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FunctionComponent, useContext } from 'react';

import { DarkModeContext } from './theme-provider';

export const HelloFromRegion: FunctionComponent = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Tooltip title={`This website's backend hosted in and responding from us-east-1 (North Virginia).`} placement='right'>
      <Typography sx={{ color: isDarkMode ? 'grey.400' : 'text.primary', fontWeight: 500 }}>Hello from us-east-1!</Typography>
    </Tooltip>
  );
};
