document.getElementById('newProduct').addEventListener('click', addProduct)
document.getElementById('newResource').addEventListener('click', addResource)
document.getElementById('backBtn').addEventListener('click', goHome)

function addProduct() {
    location.replace("http://localhost:3000/new-product");
}

function addResource() {
    location.replace("http://localhost:3000/new-resource");
}

