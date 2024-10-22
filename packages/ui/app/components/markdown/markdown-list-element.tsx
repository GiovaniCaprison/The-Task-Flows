import { FunctionComponent, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

export const MarkdownListElement: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Box component='li' sx={{ marginTop: 1 }}>
    <Box component='span' sx={{ color: 'text.primary' }}>
      {children}
    </Box>
  </Box>
);
