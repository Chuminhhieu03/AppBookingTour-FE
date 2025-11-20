import { Outlet } from 'react-router-dom';

// project-imports
import Header from './Header';
import Footer from './Footer';
import NavigationScroll from 'components/NavigationScroll';
import LoadingModal from '../../components/LoadingModal';
import './customer-layout.css';

// styles

export default function CustomerLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <LoadingModal />
            <main style={{ flex: 1, background: '#F5F7FA' }}>
                <NavigationScroll>
                    <Outlet />
                </NavigationScroll>
            </main>
            <Footer />
        </div>
    );
}
