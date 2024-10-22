import Typography from '@mui/material/Typography';
import { ComponentProps, FunctionComponent } from 'react';

export const Text: FunctionComponent<ComponentProps<typeof Typography>> = ({ children, ...props }) => (
  <Typography {...props} sx={{ color: 'text.primary', ...props.sx }}>
    {children}
  </Typography>
);
