import { FunctionComponent } from 'react';

import { DescriptionSections } from './description-sections';
import { HomePageHeader } from './home-page-header';
import { QuickLinkSection } from './quick-link-section';

export const HomePage: FunctionComponent = () => (
  <>
    <HomePageHeader />
    <QuickLinkSection />
    <DescriptionSections />
  </>
);
