import { FunctionComponent } from 'react';

import { LinkableSection } from '../../components/linkable-section';
import { Markdown } from '../../components/markdown';
import { PageSection } from '../../components/page-section';
import { Text } from '../../components/text';
import { pagePadding } from '../../constants/page-size';
import { FAQEntry } from '../../types/faq';

export interface FAQSectionProps {
  readonly faqEntries: FAQEntry[];
  readonly index: number;
  readonly name: string;
}

export const FAQSection: FunctionComponent<FAQSectionProps> = ({ faqEntries, index, name }) => (
  <PageSection
    containerSx={{ backgroundColor: index % 2 === 0 ? 'background.paper' : 'background.default' }}
    contentSx={{ padding: `25px ${pagePadding}` }}>
    <Text sx={{ marginBottom: '15px' }} variant='h4'>
      {name}
    </Text>

    {faqEntries.map((faqEntry, faqNum) => (
      <LinkableSection key={faqNum} title={faqEntry.question}>
        <Markdown>{faqEntry.answer}</Markdown>
      </LinkableSection>
    ))}
  </PageSection>
);
