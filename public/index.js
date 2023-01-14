let images_container = document.getElementById("images_container")

const response = await fetch(`http://localhost:3000/api/image`)
const images = await response.json()

for (const image of images.images) {
    let image_card = document.createElement("div")
    image_card.classList.add("image_card")

    let image_element = document.createElement("img")
    image_element.src = `data:${image.contentType};base64,${image.image}`

    let image_name = document.createElement("div")
    image_name.innerText = image.name

    image_card.append(image_element)
    image_card.append(image_name)
    images_container.append(image_card)
}
