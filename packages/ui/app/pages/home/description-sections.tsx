import BatteriesIncludedIcon from '@mui/icons-material/BatteryChargingFull';
import OnShouldersOfGiantsIcon from '@mui/icons-material/EmojiPeople';
import PowerOfOneIcon from '@mui/icons-material/Filter1';
import SecurityFocusedIcon from '@mui/icons-material/Security';
import BetterTogetherIcon from '@mui/icons-material/SupervisedUserCircle';
import { FunctionComponent } from 'react';

import { DescriptionSection, DescriptionSectionProps } from './description-section';

const descriptionSectionsProps: Omit<DescriptionSectionProps, 'index'>[] = [
  {
    title: 'The Power of 1',
    description:
      '1 Purpose. 1 Platform. 1 Pipeline. 1 Click. TheTaskFlows offers users a streamlined and automated way to store and retrieve files and user data. Designed for efficiency, TheTaskFlows provides a preconfigured, ready-to-use environment that simplifies uploading files to cloud storage. It centralizes best practices for cloud storage and data analysis, ensuring that users can upload their files and get results with minimal setup. TheTaskFlows allows users to focus on the organisation of their data and task completion without the burden of managing complex infrastructure or configurations. With just a few clicks, users can upload their files, monitor their information, and download their stored data, all in one place.',
    Icon: PowerOfOneIcon,
  },
  {
    title: 'Batteries Included',
    description:
      'TheTaskFlows ensures that file uploading, along with custom configurations such as database connections, security policies, resource monitoring, and optimized query execution, are included by default. Users do not need to worry about configuring these elements before or after submitting their files. TheTaskFlows automatically handles upload execution, error handling, and result delivery, providing a seamless and efficient experience. It builds, processes, and maintains files in the background, allowing users to focus on their data analysis or other goals without the hassle of setup or maintenance.',
    Icon: BatteriesIncludedIcon,
  },
  {
    title: 'Better Together',
    description: `In the future, TheTaskFlows will allow users to contribute and share their own custom group configurations and workflows. Users will be able to create and share their data for group access to cloud storage across their team, organization, or with specified users. This feature will enable both public and restricted sharing among specified groups, fostering collaboration and the exchange of data, helping teams work more efficiently and share best practices.`,
    Icon: BetterTogetherIcon,
  },
  {
    title: 'On the Shoulders of Giants',
    description:
      'All files and configurations officially hosted on behalf of TheTaskFlows will be vetted by Subject Matter Experts (SMEs) and system architects to ensure they adhere to industry best practices for data processing and storage. This ensures that all processes concerning files are reliable, efficient, and optimized for performance. In the future, part of the vetting process for any user uploaded files will focus on ensuring they are secure, cost-effective, and follow best practices for query optimization and resource management. This will provide a trusted environment where users can confidently upload data with high standards of quality and performance.',
    Icon: OnShouldersOfGiantsIcon,
  },
  {
    title: 'Security Focused',
    description:
      'TheTaskFlows is designed with security as a top priority. It integrates secure authentication mechanisms, using industry-standard protocols to protect user credentials and data. The platform is built to guard against XSS and CSRF attacks and enforces TLS encryption by default to ensure secure communication. TheTaskFlows extends secure-by-default practices to all file submissions and processing, ensuring that sensitive data is handled safely. Additionally, once tasks handled by the application are completed, any associated data is securely cleaned up and removed using automated tools, ensuring both data integrity and user privacy are maintained at the highest level.',
    Icon: SecurityFocusedIcon,
  },
];

export const DescriptionSections: FunctionComponent = () => (
  <>
    {descriptionSectionsProps.map((props, index) => (
      <DescriptionSection key={index} index={index} {...props} />
    ))}
  </>
);
