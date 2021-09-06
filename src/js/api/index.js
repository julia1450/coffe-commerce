const baseURL = "https://cors-anywhere.herokuapp.com/https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev/products"

const fetchProducts = async () => {
    let response = await fetch(`${baseURL}`)
    if(response.ok) {
        return await response.json();
    } else {
        throw new Error("서버 오류")
    }
}
const fetchProduct = async (id) => {
    let response = await fetch(`${baseURL}/${id}`)
    if(response.ok) {
        return await response.json();
    } else {
        throw new Error("서버 오류")
    }
}

export {
    fetchProducts,
    fetchProduct
}