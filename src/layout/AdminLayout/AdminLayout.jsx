import { Outlet } from 'react-router-dom';

// project-imports
import Breadcrumbs from 'components/Breadcrumbs';
import Drawer from './Drawer/Drawer';
import Footer from './Footer';
import Header from './Header';
import NavigationScroll from 'components/NavigationScroll';
import LoadingModal from '../../components/LoadingModal';

export default function AdminLayout() {
  return (
    <div>
      <Drawer />
      <Header />
      <LoadingModal />
      <div className="pc-container">
        <div className="pc-content">
          {/* <Breadcrumbs /> */}
          <NavigationScroll>
            <Outlet />
          </NavigationScroll>
        </div>
      </div>
    </div>
  );
}
