import { Meta, StoryFn } from '@storybook/react';
import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import path from 'path';
import { describe, it } from 'vitest';

interface StoryFile {
  readonly [name: string]: Meta | StoryFn;
  readonly default: Meta;
}

describe.concurrent('Storybook', () => {
  const storybookFiles = Object.entries(import.meta.glob<StoryFile>('../stories/**/*.stories.tsx', { eager: true }));

  storybookFiles.forEach(([filePath, storyFile]) => {
    const componentName = path.basename(filePath).replace(/\.stories\.[^/.]+$/, '');

    describe.concurrent(componentName, () => {
      const stories = Object.entries(composeStories(storyFile)).map(([name, story]) => ({ name, story }));

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this component: ${componentName}. Make sure there is at least one valid story for this module.`,
        );
      }

      stories.forEach(({ name, story }) => {
        it.concurrent(name, async ({ expect }) => {
          const snapshotPath = path.join(path.dirname(filePath), 'snapshots', componentName, `${name}.snapshot`);
          await expect(render(story()).container).toMatchFileSnapshot(snapshotPath);
        });
      });
    });
  });
});
