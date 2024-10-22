import Paper from '@mui/material/Paper';
import { SxProps } from '@mui/system';
import { FunctionComponent, PropsWithChildren } from 'react';

type MessageBoxTypes = 'code' | 'error' | 'success' | 'warning';

interface Props extends PropsWithChildren {
  readonly sx?: SxProps;
  readonly type: MessageBoxTypes;
}

const getBackgroundColor = (type: MessageBoxTypes, isDarkMode: boolean): string => {
  switch (type) {
    case 'code':
      return isDarkMode ? '#4B4B4B' : '#F0F0F0';
    case 'error':
      return isDarkMode ? '#940000' : '#F2DEDE';
    case 'warning':
      return isDarkMode ? '#8A7700' : '#FCF8E3';
    case 'success':
      return isDarkMode ? '#174f1A' : '#77D17C';
  }
};

export const MessageBox: FunctionComponent<Props> = ({ children, sx, type }) => (
  <Paper sx={{ backgroundColor: (theme) => getBackgroundColor(type, theme.palette.mode === 'dark'), padding: '15px', ...sx }}>
    {children}
  </Paper>
);
