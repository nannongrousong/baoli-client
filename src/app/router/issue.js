import Loadable from 'react-loadable';
import Loading from 'APP_COMPONENT/loading';


export default [{
    path: '/issue',
    component: Loadable({
        loader: () => import('../pages/issue'),
        loading: Loading
    })
}];