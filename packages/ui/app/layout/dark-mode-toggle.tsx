import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { FunctionComponent, useContext } from 'react';
import Box from '@mui/material/Box';


import { ISENGARD_YELLOW, DarkModeContext } from './theme-provider';

const HEIGHT = 24;
const WIDTH = 48;
const PADDING = 2;

const TOGGLE_SIZE = HEIGHT - 2 * PADDING;

const MOON_CRESCENT_OFFSET = 0.25;

const numToPx = <N extends number>(num: N): `${N}px` => `${num}px`;

const CHECKBOX_STYLE = {
  width: numToPx(WIDTH),
  height: numToPx(HEIGHT),
  position: 'absolute',
  margin: '0px',
  cursor: 'pointer',
  opacity: '0',
  zIndex: 2,
} as const;

export const DarkModeToggle: FunctionComponent = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const theme = useTheme();

  const toggleDarkMode = (): void => setIsDarkMode(!isDarkMode);
  const tooltipText = `Click to enable ${isDarkMode ? 'light' : 'dark'} mode`;

  const spanStyle = {
    position: 'absolute',
    height: numToPx(HEIGHT),
    width: numToPx(WIDTH),
    overflow: 'hidden',
    opacity: 1,
    backgroundColor: 'background.default',
    border: `${theme.palette.background.paper} solid 1px`,
    borderRadius: numToPx(HEIGHT / 2),
    boxShadow: isDarkMode ? undefined : `rgba(0, 0, 0, 0.24) 0px 1px 3px`,
    transition: '0.2s ease background-color, 0.2s ease opacity',

    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: numToPx(PADDING),
      width: numToPx(HEIGHT - 2 * PADDING),
      height: numToPx(HEIGHT - 2 * PADDING),
      borderRadius: '50%',
      transition: '0.5s ease transform, 0.2s ease background-color',
    },

    '&:before': {
      backgroundColor: 'background.default',
      transform: isDarkMode
        ? `translate(${numToPx(WIDTH - (1 + MOON_CRESCENT_OFFSET) * TOGGLE_SIZE - PADDING)},-${numToPx(
            MOON_CRESCENT_OFFSET * TOGGLE_SIZE,
          )})`
        : `translate(-${numToPx(TOGGLE_SIZE)},0px)`,
      zIndex: 1,
    },

    '&:after': {
      backgroundColor: isDarkMode ? 'white' : ISENGARD_YELLOW,
      transform: isDarkMode ? `translate(${numToPx(WIDTH - TOGGLE_SIZE - PADDING)}, 0px)` : `translate(${numToPx(PADDING)}, 0px)`,
      zIndex: 0,
    },
  } as const;

  return (
    <Tooltip title={tooltipText}>
      <Box sx={{ width: numToPx(WIDTH), height: numToPx(HEIGHT) }}>
        <Box checked={isDarkMode} component='input' onChange={toggleDarkMode} sx={CHECKBOX_STYLE} type='checkbox' />
        <Box component='span' sx={spanStyle} />
      </Box>
    </Tooltip>
  );
};
