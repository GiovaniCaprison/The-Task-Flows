/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionComponent, PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

import { MessageBox } from './message-box';

const FallbackComponent: FunctionComponent<FallbackProps> = ({ error }) => (
  <MessageBox type='error'>
    <b>Error</b>: An error occurred while rendering a component:
    <br />
    <i>{JSON.stringify(error, Object.getOwnPropertyNames(error))}</i>
    <br />
    Try refreshing the page, and please contact our team if this issue persists.
  </MessageBox>
);

export const ErrorBoundary: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={FallbackComponent}>{children}</ReactErrorBoundary>
);
