document.addEventListener("DOMContentLoaded", function () {
    const addProductForm = document.getElementById('addProductForm');

    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const tags = formData.get('tags').split(',').map(tag => tag.trim());

        const productData = {
            name: formData.get('name'),
            imageURL: formData.get('imageURL'),
            tags: tags,
            price: parseFloat(formData.get('price')),
            comments: []
        };

        fetch('http://localhost:5135/WebShop/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response;  
          
        })
        .then(data => {
            alert('Product successfully added.');
            addProductForm.reset();
        })
        .catch(error => {
            console.error('Error during POST request:', error);
            alert('An error occurred while adding the product.');
        });
    });
});