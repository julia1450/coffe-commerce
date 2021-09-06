import AbstractView from './AbstractView.js';
import { fetchProduct } from '../api/index.js'

export default class extends AbstractView {
    constructor({ $app, navigator, parameter }) {
        super();
        this.$app = $app;
        this.navigator = navigator;
        this.parameter = parameter;

        this.state = {
            info: {},
            selectedProcuct: []
        };

        this.$target = document.createElement('div');
        this.$target.className = "ProductDetailPage";
		if ( this.$app.hasChildNodes() ) {
		  this.$app.removeChild( this.$app.childNodes[0] );
		}
        this.$app.appendChild(this.$target);

        this.init();
        this.setTitle('상품 정보');
        this.eventBinding();
    }

    async init() {
        this.state.info = await fetchProduct(this.parameter);
        this.setState(this.state);
    }

    setState(newState) {
        this.state = newState;
        this.render();
    }
    async render() {
        if (Object.keys(this.state.info).length > 0) {
            const titleTemplate = `<h1>${this.state.info.name} 상품 정보</h1>`;
            const detailTemplate = `<div class="ProductDetail">
                <img src="${this.state.info.imageUrl}">
                <div class="ProductDetail__info">
                <h2>${this.state.info.name}</h2>
                <div class="ProductDetail__price">${this.state.info.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원~</div>
                <select>
                    <option>선택하세요.</option>
                    ${this.state.info.productOptions.map((option, index) => {
                        if(option.stock > 0){
                            return `<option data-index="${index}">${this.state.info.name} ${option.name} ${option.price > 0 ? `+(${option.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})` : ""}</option>`
                        } else {
                            return `<option disabled>(품절) ${this.state.info.name} ${option.name}</option>`;
                        }
                        
                    }).join('')}
                </select>
                <div class="ProductDetail__selectedOptions">
                    
                </div>
                </div>
            </div>`
            this.$target.innerHTML = `${titleTemplate}<ul>${detailTemplate}</ul>`;

            
            this.renderSelectedArea();
        }


        const origin = `<div class="ProductDetailPage">
        
      <div class="CartPage">
        <h1>장바구니</h1>
        <div class="Cart">
          <ul>
            <li class="Cart__item">
              <img src="https://grepp-cloudfront.s3.ap-northeast-2.amazonaws.com/programmers_imgs/assignment_image/cafe_coffee_cup.png">
              <div class="Cart__itemDesription">
                <div>커피잔 100개 번들 10,000원 10개</div>
                <div>100,000원</div>
              </div>
            </li>
            <li class="Cart__item">
              <img src="https://grepp-cloudfront.s3.ap-northeast-2.amazonaws.com/programmers_imgs/assignment_image/cafe_coffee_cup.png">
              <div class="Cart__itemDesription">
                <div>커피잔 1000개 번들 15,000원 5개</div>
                <div>75,000원</div>
              </div>
            </li>
          </ul>
          <div class="Cart__totalPrice">
            총 상품가격 175,000원
          </div>
          <button class="OrderButton">주문하기</button>
        </div>
      </div>`;
    }

    renderSelectedArea() {
        const $selectedArea = this.$target.querySelector('.ProductDetail__selectedOptions');
        $selectedArea.innerHTML =
            `<h3>선택된 상품</h3>
        <ul>
        ${this.state.selectedProcuct.map(product => {
                return `<li data-id="${product.id}">
            ${this.state.info.name} ${product.name} ${(this.state.info.price + product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 <div><input type="number" value="${product.count}">개</div>
          </li>`
            }).join('')}
        </ul>
        <div class="ProductDetail__totalPrice">${this.calculateTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        <button class="OrderButton">주문하기</button>`
    }

    calculateTotalPrice() {
        let sum = 0;
        this.state.selectedProcuct.forEach(product => {
            sum += (this.state.info.price + product.price) * product.count;
        });
        return sum;
    }

    eventBinding() {
        // this.$target.addEventListener("click", e => {
        //     const $product = e.target.closest('.Product');
        //     if ($product) {
        //         this.navigator(`/web/products/${$product.dataset.id}`);
        //     }
        // });
        this.$target.addEventListener('change', e => {
            const $selectBox = e.target.closest('select');
            const $input = e.target.closest('input');
            if($selectBox) {
                let index = $selectBox.selectedOptions[0].dataset.index;
                const selectedOption = this.state.info.productOptions[index];
    
                // 있는지 확인
                const duplicateProduct = this.state.selectedProcuct.find(product => {
                    return product.id === selectedOption.id;
                });
                if(!duplicateProduct) {
                    selectedOption.count = 1;
                    this.state.selectedProcuct.push(selectedOption);
                } 
                this.renderSelectedArea();
            }
            else if($input) {
                const $productEl = e.target.closest('li');
                const countingProduct = this.state.selectedProcuct.forEach(product => {
                    if(product.id == $productEl.dataset.id) {
                        product.count = parseInt($input.value);
                    }
                    
                });
                this.renderSelectedArea();
            }
        });
    }
}