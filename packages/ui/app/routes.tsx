import FAQIcon from '@mui/icons-material/ContactSupport';
import HomeIcon from '@mui/icons-material/Home';
import QuickStartIcon from '@mui/icons-material/OfflineBolt';
import ArchitectureIcon from '@mui/icons-material/Widgets';

import { ArchitecturePage } from './pages/architecture/architecture-page';
import { FAQPage } from './pages/faq/faq-page';
import { HomePage } from './pages/home/home-page';
import { QuickStartPage } from './pages/quick-start/quick-start-page';
import { Route } from './types/route';
import {CallbackPage} from "./pages/callback/callback-page";

export const routes: Route[] = [
  {
    index: true,
    element: <HomePage />,
    handle: {
      Icon: HomeIcon,
      title: 'Home',
      description: 'The homepage for TheTaskFlows',
    },
  },
  {
    path: '/quick-start',
    element: <QuickStartPage />,
    handle: {
      Icon: QuickStartIcon,
      title: 'Quick Start',
      description: 'The page to quickly start using TheTaskFlows',
    },
  },
  {
    path: '/architecture',
    element: <ArchitecturePage />,
    handle: {
      Icon: ArchitectureIcon,
      title: 'Architecture',
      description: 'An overview of the architecture that powers TheTaskFlows',
    },
  },
  {
    path: '/faq',
    element: <FAQPage />,
    handle: {
      Icon: FAQIcon,
      title: 'FAQ',
      description: 'A list of frequently asked questions regarding TheTaskFlows',
    },
  },
  {
    index: true,
    path: '/callback',
    element: <CallbackPage />,
    handle: {
        Icon: HomeIcon,
        title: 'Callback',
        description: 'The callback page for Cognito',
    },
  },
];
