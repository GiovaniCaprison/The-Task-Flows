import { FunctionComponent } from 'react';
import { PageHeader } from '../../components/page-header';
import { DropZoneComponent } from "../../components/drop-zone-component";
import { FileManager } from "./file-manager-component";
import {PageSection} from "../../components/page-section";
// import Container from "@mui/material/Container";
// import {Text} from "../../components/text";

/*
<PageSection>
  <Container
    sx={{paddingTop: '40px', paddingBottom: '40px', textAlign: 'center'}}
    >
    <Text variant={'h6'}>
        TheTaskFlows is currently in Development, meaning it's features are unavailable to any non-admin users. Updates will be coming shortly.
    </Text>
  </Container>
</PageSection>
 */

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
