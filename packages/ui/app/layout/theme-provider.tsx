import { Theme, ThemeProvider as MUIThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { FunctionComponent, PropsWithChildren, createContext, useEffect, useState } from 'react';

export const ISENGARD_YELLOW = '#FFCC00';

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1D1D1D',
      dark: '#141414',
    },
    secondary: {
      main: ISENGARD_YELLOW,
    },
    background: {
      paper: '#161614',
    },
  },
  components: {
    MuiStepLabel: {
      styleOverrides: {
        labelContainer: {
          marginTop: '0px !important',
        },
        label: {
          marginTop: '5px !important',
          color: '#fff !important',
        },
      },
    },
  },
});

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2B2B2B',
    },
    secondary: {
      main: '#808080',
    },
    background: {
      paper: '#FAFAFA',
    },
  },
  components: {
    MuiStepLabel: {
      styleOverrides: {
        labelContainer: {
          marginTop: '0px !important',
        },
        label: {
          marginTop: '5px !important',
          color: '#000 !important',
        },
      },
    },
  },
});

const IS_DARK_MODE_LOCAL_STORAGE_KEY = 'IS_DARK_MODE_LOCAL_STORAGE_KEY';

const initialState = {
  isDarkMode: true,
  setIsDarkMode: (val: boolean): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
};

const CLASS_NAME_LIGHT = 'light-mode';
const CLASS_NAME_DARK = 'dark-mode';

export const DarkModeContext = createContext(initialState);

export const ThemeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isDarkMode, setIsDarkModeInState] = useState(false); // Default theme is light

  const setIsDarkModeInStateAndInCSS = (newIsDarkMode: boolean): void => {
    // So this must be ignored so as to not throw an error
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [document.body, document.getElementById('app')!].forEach((element) => {
      element.classList.add(newIsDarkMode ? CLASS_NAME_DARK : CLASS_NAME_LIGHT);
      element.classList.remove(newIsDarkMode ? CLASS_NAME_LIGHT : CLASS_NAME_DARK);
    });

    setIsDarkModeInState(newIsDarkMode);
  };

  // On mount, read the preferred theme from local storage
  useEffect(() => {
    // Build process as it exists in the root tsconfig.json
    // So once again this does not throw an error...
    const isDarkModeFromLocalStorage = localStorage.getItem(IS_DARK_MODE_LOCAL_STORAGE_KEY) === 'true';
    setIsDarkModeInStateAndInCSS(isDarkModeFromLocalStorage);
  }, [setIsDarkModeInState]);

  // Sets IsDarkMode both in local storage and in the state
  const setIsDarkMode = (val: boolean): void => {
    localStorage.setItem(IS_DARK_MODE_LOCAL_STORAGE_KEY, JSON.stringify(val));
    setIsDarkModeInStateAndInCSS(val);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <StyledEngineProvider injectFirst>
        <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>{children}</MUIThemeProvider>
      </StyledEngineProvider>
    </DarkModeContext.Provider>
  );
};
