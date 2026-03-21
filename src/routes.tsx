import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Upload',
    path: '/',
    element: <UploadPage />
  },
  {
    name: 'Result',
    path: '/result',
    element: <ResultPage />,
    visible: false
  }
];

export default routes;
