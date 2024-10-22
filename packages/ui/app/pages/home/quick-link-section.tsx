import Button from '@mui/material/Button';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { PageSection } from '../../components/page-section';
import { routes } from '../../routes';
import { NonIndexRoute } from '../../types/route';

export const QuickLinkSection: FunctionComponent = () => (
  <PageSection
    containerSx={{ borderBottom: 'none' }}
    contentSx={{
      display: 'grid',
      gridTemplateColumns: { sm: '1fr 1fr 1fr' },
      gridTemplateRows: 'auto auto auto',
      padding: { xs: '0 50px', sm: '0', md: '0 100px' },
    }}>
    {routes
      .filter((route): route is NonIndexRoute => !route.index)
      .map((route, index) => {
        const { Icon, title } = route.handle;

        return (
          <Button component={Link} key={index} to={route.path} sx={{ color: 'text.primary', height: '125px', fontSize: '1.5rem' }}>
            <div>
              <Icon sx={{ display: 'block', fontSize: '3rem', margin: 'auto' }} />
              {title}
            </div>
          </Button>
        );
      })}
  </PageSection>
);
