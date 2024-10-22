// import React from 'react';
// import Theme from '@amzn/meridian/theme';
// import '../src/index.css';

// // Define your themes or import them
// const lightTheme = { mode: 'light' }; // Adjust based on actual theme definition
// const darkTheme = { mode: 'dark' }; // Adjust based on actual theme definition

// export const decorators = [
//   (Story, context) => {
//     const themeMode = context.globals.theme === 'dark' ? darkTheme : lightTheme;
//     return (
//       <Theme {...themeMode}>
//         <Story />
//       </Theme>
//     );
//   },
// ];

// export const globalTypes = {
//   theme: {
//     name: 'Theme',
//     description: 'Global theme for components',
//     defaultValue: 'light',
//     toolbar: {
//       icon: 'circlehollow',
//       items: [
//         { value: 'light', title: 'Light' },
//         { value: 'dark', title: 'Dark' },
//       ],
//     },
//   },
// };
