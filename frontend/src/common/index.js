// const backendDomin = "http://127.0.0.1:5000"

// const SummaryApi = {
//     signUP : {
//         url : `${backendDomin}/api/users/user/signup`,
//         method : "post"
//     },
//     signIn : {
//         url : `${backendDomin}/api/users/user/signin`,
//         method : "post"
//     },
//     current_user : {
//         url : `${backendDomin}/api/users/user/user-details`,
//         method : "get"
//     },
//     logout_user : {
//         url : `${backendDomin}/api/users/user/logout`,
//         method : 'get'
//     },
//     allUser : {
//         url : `${backendDomin}/api/users/user/all-users`,
//         method : 'get'
//     },
//     updateUser : {
//         url : `${backendDomin}/api/users/user/update-user`,
//         method : "PATCH"
//     },
//     uploadProduct : {
//         url : `${backendDomin}/api/products/product/upload-product`,
//         method : 'post'
//     },
//     allProduct : {
//         url : `${backendDomin}/api/products/product/get-product`,
//         method : 'get'
//     },
//     updateProduct : {
//         url : `${backendDomin}/api/products/product/update-product`,
//         method  : 'PATCH'
//     },
//     categoryProduct : {
//         url : `${backendDomin}/api/products/product/get-category-product`,
//         method : 'get'
//     },
//     categoryWiseProduct : {
//         url : `${backendDomin}/api/products/product/category-product`,
//         method : 'post'
//     },
//     productDetails : {
//         url : `${backendDomin}/api/products/product/product-details`,
//         method : 'post'
//     },
//     addToCartProduct : {
//         url : `${backendDomin}/api/users/user/add-to-cart`,
//         method : 'post'
//     },
//     addToCartProductCount : {
//         url : `${backendDomin}/api/users/user/count-cart`,
//         method : 'get'
//     },
//     addToCartProductView : {
//         url : `${backendDomin}/api/users/user/view-cart`,
//         method : 'get'
//     },
//     updateCartProduct : {
//         url : `${backendDomin}/api/users/user/update-cart`,
//         method : 'PATCH'
//     },
//     deleteCartProduct : {
//         url : `${backendDomin}/api/users/user/delete-cart`,
//         method : 'post'
//     },
//     searchProduct : {
//         url : `${backendDomin}/api/products/product/search-product`,
//         method : 'get'
//     },
//     filterProduct : {
//         url : `${backendDomin}/api/products/product/filter-product`,
//         method : 'post'
//     },
//     addOrder: {
//         url: 'http://localhost:5000/api/orders',
//         method: 'POST'
//       },
//     getUserOrders: {
//         url: 'http://localhost:5000/api/orders/product',
//         method: 'GET'
//       },
//     getAllOrders: {
//         url: 'http://localhost:5000/api/orders',
//         method: 'GET'
//       },
//     updateOrderStatus: {
//         url: 'http://localhost:5000/api/orders',
//         method: 'PUT'
//       },
//     deleteProduct: {
//         url: 'http://localhost:5000/api/products/product/delete-product',
//         method: "DELETE"
//       }  
    
// }


// export default SummaryApi;

const backendDomin = "http://127.0.0.1:5000"

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/users/user/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/users/user/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/users/user/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/users/user/logout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/users/user/all-users`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/users/user/update-user`,
        method : "PATCH"
    },
    uploadProduct : {
        url : `${backendDomin}/api/products/product/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/products/product/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/products/product/update-product`,
        method  : 'PATCH'
    },
    categoryProduct : {
        url : `${backendDomin}/api/products/product/get-category-product`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/products/product/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/products/product/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/users/user/add-to-cart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/users/user/count-cart`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/users/user/view-cart`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/users/user/update-cart`,
        method : 'PATCH'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/users/user/delete-cart`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/products/product/search-product`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/products/product/filter-product`,
        method : 'post'
    },
    addOrder: {
        url: 'http://localhost:5000/api/orders',
        method: 'POST'
      },
    getUserOrders: {
        url: 'http://localhost:5000/api/orders/product',
        method: 'GET'
      },
    getAllOrders: {
        url: 'http://localhost:5000/api/orders',
        method: 'GET'
      },
    updateOrderStatus: {
        url: 'http://localhost:5000/api/orders',
        method: 'PUT'
      },
    deleteProduct: {
        url: 'http://localhost:5000/api/products/product/delete-product',
        method: "DELETE"
      }  
    
}


export default SummaryApi;