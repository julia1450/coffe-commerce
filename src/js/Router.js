import List from './view/List.js';
import Detail from './view/Detail.js';

export default function Router({ $app }) {
    this.$app = $app;
    this.router;

    const routes = [
        { path: "/", view: List },
        { path: "/products/:productId", view: Detail },
    ];

    const navigateTo = (url) => {
        history.pushState({}, null, url);
        // pushState()가 다시 렌더링까지는 해주지 않으므로, view를 호출하는 router를 실행시키게 한다.
        this.router();
    };

    window.onpopstate = () => {
        this.router();
    }

    this.router = async () => {
        const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
        const potentialMatch = routes.map((route) => {
            return {
                route: route,
                result: location.pathname.match(pathToRegex(route.path)),
            };
        });

        let match = potentialMatch.find((potentialMatch) => {
            return potentialMatch.result;
        });

        if (!match) {
            document.querySelector("#app").innerHTML = `<h1>404</h1>`;
            return;
        } else {
            const view = new match.route.view({
                $app, 
                navigator: (link) => {
                    navigateTo(link);
                },
                parameter: match.result[1]
            });
        }
    }
}