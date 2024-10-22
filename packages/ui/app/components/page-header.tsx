import { FunctionComponent } from 'react';
import { useMatches } from 'react-router-dom';

import { PageSection } from './page-section';
import { Text } from './text';
import { pagePadding } from '../constants/page-size';
import { RouteMetadata } from '../types/route';

export const PageHeader: FunctionComponent = () => {
  const [, lastMatch] = useMatches();

  const { Icon, title, description } = lastMatch.handle as RouteMetadata;

  return (
    <PageSection
      containerSx={{ backgroundColor: 'background.default' }}
      contentSx={{
        display: 'grid',
        gridTemplateColumns: 'max-content auto',
        padding: `20px ${pagePadding} 40px`,
        marginTop: '80px',
      }}>
      <Icon sx={{ color: 'text.primary', fontSize: 80, gridColumn: '1', gridRow: '1 / span 2', margin: 'auto 10px auto 0' }} />
      <Text sx={{ gridColumn: '2', gridRow: '1' }} variant='h3'>
        {title}
      </Text>
      <Text sx={{ fontSize: '1.25rem', gridColumn: '2', gridRow: '2' }}>{description}</Text>
    </PageSection>
  );
};
