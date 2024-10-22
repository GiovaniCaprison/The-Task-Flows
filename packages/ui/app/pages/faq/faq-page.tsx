import { FunctionComponent } from 'react';

import { FAQSection, FAQSectionProps } from './faq-section';
import { PageHeader } from '../../components/page-header';
import { architectureFaqs, thetaskflowsFaqs, developmentFaqs, securityFaqs } from '../../constants/faq-entries';

const faqSections: Omit<FAQSectionProps, 'index'>[] = [
  { name: 'TheTaskFlows', faqEntries: thetaskflowsFaqs },
  { name: 'Development', faqEntries: developmentFaqs },
  { name: 'Architecture', faqEntries: architectureFaqs },
  { name: 'Security', faqEntries: securityFaqs },
];

export const FAQPage: FunctionComponent = () => (
  <>
    <PageHeader />

    {faqSections.map((faqSection, index) => (
      <FAQSection key={index} {...faqSection} index={index} />
    ))}
  </>
);
