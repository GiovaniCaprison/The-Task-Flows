import { useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FunctionComponent, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

import { ErrorBoundary } from './error-boundary';
import { maxPageWidth, pagePadding } from '../constants/page-size';

interface Props extends PropsWithChildren {
  readonly containerSx?: SxProps;
  readonly contentSx?: SxProps;
}

export const PageSection: FunctionComponent<Props> = ({ containerSx, contentSx, children }) => {
  const theme = useTheme();

  return (
    <ErrorBoundary>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: `${theme.palette.secondary.main} solid 1px`,
          transition: 'background-color ease 0.2s',
          ...containerSx,
        }}>
        <Box sx={{ margin: '0 auto', maxWidth: maxPageWidth, overflow: 'auto', padding: `0 ${pagePadding}`, ...contentSx }}>{children}</Box>
      </Box>
    </ErrorBoundary>
  );
};
