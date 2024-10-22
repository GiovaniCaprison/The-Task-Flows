import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from './footer';
import { WebsiteHeader } from './website-header';
import { ErrorBoundary } from '../components/error-boundary';


export const Layout: FunctionComponent = () => (
  <>
    <ErrorBoundary>
      <WebsiteHeader />
    </ErrorBoundary>

    <Outlet />

    <ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  </>
);
