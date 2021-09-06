import Router from './Router.js'
export default function App($app) {
    const router = new Router({$app});
    router.router();
}