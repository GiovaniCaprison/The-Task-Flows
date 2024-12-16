import { FunctionComponent } from 'react';
import { PageHeader } from '../../components/page-header';
import { DropZoneComponent } from "../../components/drop-zone-component";
import { FileManager } from "./file-manager-component";
import {PageSection} from "../../components/page-section";

export const QuickStartPage: FunctionComponent = () => {
    return (
    <>
      <PageHeader />
      <PageSection>
          <FileManager />
          <DropZoneComponent />
      </PageSection>
    </>
  );
};
