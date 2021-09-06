import AbstractView from './AbstractView.js';
import {fetchProducts} from '../api/index.js'

export default class extends AbstractView {
    constructor({$app, navigator}) {
        super();
        this.$app = $app;
        this.navigator = navigator;

        this.state = [];

        this.$target = document.createElement('div');
        this.$target.className = "ProductListPage";
		
		if ( this.$app.hasChildNodes() ) {
		  this.$app.removeChild( this.$app.childNodes[0] );
		}
        this.$app.appendChild(this.$target);

        this.init();
        this.setTitle('상품 목록');
        this.render();
        this.eventBinding();
    }

    async init() {
        this.state = await fetchProducts();
        this.setState(this.state);
    }

    setState(newState) {
        this.state = newState;
        this.render();
    }
    async render() {
        const titleTemplate = `<h1>상품목록</h1>`;
        const listTemplate = this.state.map(product => {
            return `<li class="Product" data-id="${product.id}">
                <img src="${product.imageUrl}">
                <div class="Product__info">
                <div>${product.name}</div>
                <div>${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원~</div>
                </div>
            </li>`
        }).join('');
        this.$target.innerHTML =`${titleTemplate}<ul>${listTemplate}</ul>`;
    }

    eventBinding() {
        this.$target.addEventListener("click", e => {
            const $product = e.target.closest('.Product');
            if($product) {
                this.navigator(`/products/${$product.dataset.id}`);
            }
        });
    }
}