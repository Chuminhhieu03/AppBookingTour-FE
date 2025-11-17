import { Outlet } from 'react-router-dom';

// project-imports
import Header from './Header';
import NavigationScroll from 'components/NavigationScroll';
import LoadingModal from '../../components/LoadingModal';

export default function CustomerLayout() {
    return (
        <div>
            <Header />
            <LoadingModal />
            <div className="pc-container" style={{ marginLeft: 0 }}>
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
