const url = `https://api.cloudinary.com/v1_1/debs5nezf/image/upload`

const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","product")
    

    const dataResponse = await fetch(url,{
        method : "POST",
        body : formData
    })

    return dataResponse.json()

}

export default uploadImage 