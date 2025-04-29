import SummaryApi from "../common"
import { toast } from 'react-toastify'
const token = localStorage.getItem('jwtToken')
console.log("token",token);

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    console.log("e",e)
    console.log("id",id)
    
    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json',
            "authorization" : `Bearer ${token}`
        },
        body : JSON.stringify(
            { productId : id }
        )
    })

    const responseData = await response.json()
    console.log( "respose add cart",responseData);

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(response.status == 400){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart