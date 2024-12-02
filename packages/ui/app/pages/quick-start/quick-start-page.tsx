import { FunctionComponent } from 'react';

import { PageHeader } from '../../components/page-header';
import { DropZoneComponent } from '../../components/drop-zone-component';

export const QuickStartPage: FunctionComponent = () => {
  return (
    <>
      <PageHeader />
      <DropZoneComponent />
    </>
  );
};
