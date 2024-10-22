import CircularProgress from '@mui/material/CircularProgress';
import { FunctionComponent } from 'react';

interface Props {
  readonly inline?: boolean;
  readonly size?: number;
}

export const ProgressCircle: FunctionComponent<Props> = ({ inline, size }) => (
  <CircularProgress color='secondary' size={size ?? 40} sx={{ display: inline ? 'default' : 'block', margin: inline ? '0' : 'auto' }} />
);
