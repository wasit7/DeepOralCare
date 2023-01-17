import Home from '../views/Home';
import PublicLayout from '../layout/PublicLayout';
import SearchResult from '../views/SearchResult';

const Routes = [
    {
        path: '/',
        name: 'Home',
        role: 0,
        component: Home,
        layout: PublicLayout,
        restricted: false
    },
    {
        path: '/Search',
        name: 'Search',
        role: 0,
        component: SearchResult,
        layout: PublicLayout,
        restricted: false
    },
]

export default Routes;
