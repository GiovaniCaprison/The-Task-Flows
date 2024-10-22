import { SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { ComponentType, FunctionComponent } from 'react';
import Box from '@mui/material/Box';

import { Markdown } from '../../components/markdown';
import { PageSection } from '../../components/page-section';

export interface DescriptionSectionProps {
  readonly Icon: ComponentType<SvgIconProps>; // Needs to be capitalized to use as a JSX Element
  readonly description: string;
  readonly index: number;
  readonly title: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention -- Icon must be capitalized to render in JSX
export const DescriptionSection: FunctionComponent<DescriptionSectionProps> = ({ Icon, description, index, title }) => {
  const isEvenRow: boolean = index % 2 === 0;

  return (
    <PageSection
      containerSx={{ backgroundColor: isEvenRow ? 'background.paper' : 'background.default' }}
      contentSx={{ display: 'grid', gridTemplateColumns: { md: 'auto auto' }, padding: { xs: '50px 25px', sm: '75px 50px', md: '100px' } }}>
      <Icon
        sx={{
          color: 'text.primary',
          fontSize: '175px',
          gridColumn: { md: isEvenRow ? 1 : 2 },
          gridRow: 1,
          margin: { xs: isEvenRow ? 'auto auto auto 0' : 'auto 0 auto auto', md: isEvenRow ? 'auto 50px auto 0' : 'auto 0 auto 50px' },
        }}
      />

      <Box sx={{ gridColumn: { md: isEvenRow ? 2 : 1 }, gridRow: { md: 1 } }}>
        <Typography
          sx={{ color: 'text.secondary', fontSize: '3rem', marginBottom: '10px', textAlign: isEvenRow ? 'left' : 'right' }}
          variant='h4'>
          {title}
        </Typography>

        <Markdown sx={{ color: 'text.primary', fontSize: '1.25rem', textAlign: 'justify' }}>{description}</Markdown>
      </Box>
    </PageSection>
  );
};
