import { SxProps } from '@mui/system';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';

interface Props extends PropsWithChildren {
  readonly href: string;
  readonly sx?: SxProps;
}

const linkStyle = { color: '#007DBC', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } };

/**
 * react-router's Link component which can't be used with external links and external links should
 * be using the normal <a/> tags
 *
 * See here for more details -> https://github.com/ReactTraining/react-router/issues/1147
 */
export const Link: FunctionComponent<Props> = ({ children, href, sx }) => (
  <Box component={ReactRouterLink} sx={{ ...linkStyle, ...sx }} to={href}>
    {children}
  </Box>
);
