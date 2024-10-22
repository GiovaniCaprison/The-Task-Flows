import { SxProps } from '@mui/system';
import ReactMarkdown from 'markdown-to-jsx';
import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';

import { MarkdownListElement } from './markdown-list-element';
import { Link } from '../link';
import { Text } from '../text';

interface Props {
  readonly children: string;
  readonly sx?: SxProps;
}

const options = {
  overrides: {
    h1: { component: Text, props: { gutterBottom: true, variant: 'h5' } },
    h2: { component: Text, props: { gutterBottom: true, variant: 'h6' } },
    h3: { component: Text, props: { gutterBottom: true, variant: 'subtitle1' } },
    h4: { component: Text, props: { gutterBottom: true, variant: 'caption', paragraph: true } },
    p: { component: Text, props: { paragraph: true } },
    span: { component: Text, props: { paragraph: true } },
    a: { component: Link },
    li: { component: MarkdownListElement },
  },
};

export const Markdown: FunctionComponent<Props> = ({ children, sx }) => (
  <Box component={ReactMarkdown} options={options} sx={{ color: 'text.primary', ...sx }}>
    {children}
  </Box>
);
