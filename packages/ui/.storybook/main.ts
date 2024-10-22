import { StorybookConfig } from '@storybook/react-vite'; // (or whatever framework you are using)

export default {
  // All of the addons we want to support. More available at https://storybook.js.org/integrations
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials', '@storybook/addon-themes'],
  core: {
    // Switches the default Webpack builder to Vite since we already use that for building main app. See here for more details https://storybook.js.org/docs/builders/vite
    builder: '@storybook/builder-vite',
    // Disables telemetry reporting given we don't want to risk sensitive internal code information being externalized
    disableTelemetry: true,
  },
  docs: {
    // Enable automated documentation. See here for more details https://storybook.js.org/docs/writing-docs/autodocs
    autodocs: true,
  },
  // Configures Storybook to use Vite as our framework. See here for more details on frameworks https://storybook.js.org/docs/configure/frameworks
  framework: '@storybook/react-vite',
  // What stories to include when running Storybook
  stories: ['../stories/**/*.stories.tsx'],
} satisfies StorybookConfig;
