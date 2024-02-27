var singleLiOffset;
var currentOpenedBox;
var arrays;
var tagsSet = new Set();
var currentPage;
var currentFilter = "";
var itemsPerRow = 4;
var numOfRows = 2;
function onProductClick(target, e) {
    var thisID = target.id;
    var id = Array.from(document.getElementById('wrap').querySelectorAll('li')).indexOf(target);
    if (currentOpenedBox === id) {
        document.querySelectorAll("#wrap .detail-view").forEach(function (el) {
            el.style.display = "none";
        });
        return false;
    }
    document.getElementById("cart_wrapper").style.display = "none";
    document.querySelectorAll("#wrap .detail-view").forEach(function (el) {
        el.style.display = "none";
    });
    currentOpenedBox = id;
    var targetOffset = 0;
    if (id <= 3)
        targetOffset = 0;
    else if (id <= 7)
        targetOffset = singleLiOffset;
    else if (id <= 11)
        targetOffset = singleLiOffset * 2;
    else if (id <= 15)
        targetOffset = singleLiOffset * 3;
    else if (id <= 19)
        targetOffset = singleLiOffset * 4;
    document.documentElement.scrollTop = targetOffset;
    document.body.scrollTop = targetOffset;
    document.querySelectorAll("#wrap #detail-".concat(thisID)).forEach(function (el) {
        el.style.display = "block";
    });

    return true;
}
function onAddToCart(target) {
    if (!target.classList.contains("add-to-cart-button"))
        return;
    var thisID = target.parentElement.parentElement.id.replace('detail-', '');
    var itemname = target.parentElement.querySelector('.item_name').innerHTML;
    var itemprice = target.parentElement.querySelector('.price').innerHTML;
    if (include(arrays, parseInt(thisID))) {
        var price = document.getElementById("each-".concat(thisID)).querySelector(".shopp-price em").innerHTML;
        var quantity = parseInt(document.getElementById("each-".concat(thisID)).querySelector(".shopp-quantity").innerHTML);
        quantity += 1;
        var total = parseInt(itemprice) * quantity;
        document.getElementById("each-".concat(thisID)).querySelector(".shopp-price em").innerHTML = total.toString();
        document.getElementById("each-".concat(thisID)).querySelector(".shopp-quantity").innerHTML = quantity.toString();
        var prevCharges = parseInt(document.querySelector('.cart-total span').innerHTML);
        prevCharges = prevCharges - parseInt(price);
        prevCharges += total;
        document.querySelector('.cart-total span').innerHTML = prevCharges.toString();
        document.getElementById('total-hidden-charges').setAttribute('value', prevCharges.toString());
    }
    else {
        arrays.push(parseInt(thisID));
        var prevCharges = parseInt(document.querySelector('.cart-total span').innerHTML);
        prevCharges += parseInt(itemprice);
        document.querySelector('.cart-total span').innerHTML = prevCharges.toString();
        document.getElementById('total-hidden-charges').setAttribute('value', prevCharges.toString());
        var height = document.getElementById('cart_wrapper').offsetHeight;
        document.getElementById('cart_wrapper').style.height = (height + 45) + "px";
        var cartInfo = document.getElementById('cart_wrapper').querySelector('.cart-info');
        var newCartItem = document.createElement('div');
        newCartItem.className = 'shopp';
        newCartItem.id = "each-".concat(thisID);
        newCartItem.innerHTML = "\n            <div class=\"label\">".concat(itemname, "</div>\n            <div class=\"shopp-price\"> $<em>").concat(itemprice, "</em></div>\n            <span class=\"shopp-quantity\">1</span>\n            <img src=\"../Assets/remove.png\" class=\"remove\" />\n            <br class=\"all\" />\n        ");
        cartInfo === null || cartInfo === void 0 ? void 0 : cartInfo.appendChild(newCartItem);
    }
}

function getUniqueTags() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5135/WebShop/unique-tags", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var result = JSON.parse(xhr.response);
                tagsSet.clear();
                result.forEach(tag => {
                    tagsSet.add(tag);
                });
                addFilterBox();
            } else {
                alert("Error loading tags");
            }
        }
    };
    xhr.send();
}

function getProductList(page, filter) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5135/WebShop/product-list/".concat(page, "?tag=").concat(filter), true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var result = JSON.parse(xhr.response);
                renderProducts(result);
            }
            else {
                alert("Error loading products");
            }
        }
    };
    xhr.send();
}
function renderProducts(result) {
    var detailVievId=0;
    var ulWrap = document.getElementById("wrapul");
    ulWrap.innerHTML = "";
    var productList = document.createElement("ul");
    var prevProductItem = null;
    var prevDetailView = null;
    for (var i = 0; i < result.length; i++) {
        detailVievId++;
        var product = result[i];
        var productItem = document.createElement("li");
        productItem.id = (i + 1).toString();
        var productImage = document.createElement("img");
        productImage.src = "../product_img/" + product.imageURL;
        productImage.className = "items";
        productImage.height = 100;
        var productBr = document.createElement("br");
        productBr.setAttribute("clear", "all");
        var productDiv = document.createElement("div");
        productDiv.innerHTML = product.name;
        productDiv.id = product.id;
        productItem.appendChild(productImage);
        productItem.appendChild(productBr);
        productItem.appendChild(productDiv);
        var detailView = document.createElement("div");
        detailView.className = "detail-view";
       
        detailView.id = "detail-" +detailVievId;
        var closeX = document.createElement("div");
        closeX.className = "close";
        closeX.setAttribute("align", "right");
        var closeXA = document.createElement("a");
        closeXA.innerHTML = "x";
        closeXA.href = "javascript:void(0)";
        closeX.appendChild(closeXA);
        var productImageDetail = document.createElement("img");
        productImageDetail.src = "../product_img/" + product.imageURL;
        productImageDetail.className = "detail_images";
        productImageDetail.width = 340;
        productImageDetail.height = 310;
        var detailInfo = document.createElement("div");
        detailInfo.className = "detail_info";
        var itemName = document.createElement("label");
        itemName.className = "item_name";
        itemName.innerHTML = product.name;
        var productBr1 = document.createElement("br");
        productBr1.setAttribute("clear", "all");
        var desc = "";
        for (var j = 0; j < product.tags.length - 1; j++) {
            desc = desc + product.tags[j] + ", ";
        }
        desc = desc + product.tags[product.tags.length - 1];
        var productDesc = document.createElement("p");
        productDesc.innerHTML = desc;
        var productBr2 = document.createElement("br");
        productBr2.setAttribute("clear", "all");
        var productBr3 = document.createElement("br");
        productBr3.setAttribute("clear", "all");
        var productSpan = document.createElement("span");
        productSpan.className = "price";
        productSpan.innerHTML = product.price;
        productDesc.appendChild(productBr1);
        productDesc.appendChild(productBr2);
        productDesc.appendChild(productSpan);
        var productButton = document.createElement("button");
        productButton.className = "add-to-cart-button";
        productButton.innerHTML = "Add to Cart";
        productButton.id = "productButton";

        var deleteProductBtn = document.createElement("button");
        deleteProductBtn.innerHTML = "Delete Product";
        deleteProductBtn.id = "deleteProductBtn";
        deleteProductBtn.addEventListener('click', DeleteProduct(product.id));

        var updateProductBtn = document.createElement("button");
        updateProductBtn.innerHTML = "Update Product";
        updateProductBtn.id = "updateProductBtn";
        updateProductBtn.addEventListener('click', UpdateProduct(product.id,detailVievId));

        detailInfo.appendChild(itemName);
        detailInfo.appendChild(productBr);
        detailInfo.appendChild(productDesc);
        detailInfo.appendChild(productBr3);
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");
        let isLoggedInAdmin = false;
        let isLoggedInUser = false;
        if(!token)
        {
            productButton.style.display = 'none';
            deleteProductBtn.style.display = 'none';
            updateProductBtn.style.display = 'none';
        }
        if (token) {
            if (userRole == "admin") {
                isLoggedInAdmin = true;
            }
            else if (userRole == "user") {
                isLoggedInUser = true;
            }
        }
        console.log(isLoggedInUser);
        if (isLoggedInUser) {

            productButton.style.display = 'inline-block';
            deleteProductBtn.style.display = 'none';
            updateProductBtn.style.display = 'none';
        }
        if (isLoggedInAdmin) {

            productButton.style.display = 'none';
            deleteProductBtn.style.display = 'inline-block';
            updateProductBtn.style.display = 'inline-block';
        }
        detailInfo.appendChild(productButton);
        detailInfo.appendChild(deleteProductBtn);
        detailInfo.appendChild(updateProductBtn);

        const commentsSection = document.createElement("div");
        commentsSection.className = "comments-section";
        commentsSection.id = `${product.id}`;
        commentsSection.className = "comments_section";

        const commentsHeader = document.createElement("h3");
        commentsHeader.innerText = "Comments:";

        const commentsList = document.createElement("ul");
        commentsList.id = `comments-list-${product.id}`;

        getComments(product.id);
        commentsSection.appendChild(commentsHeader);
        commentsSection.appendChild(commentsList);

        if (isLoggedInUser) {
            const commentInput = document.createElement("textarea");
            commentInput.className = "comment-input";
            commentInput.id = `comment-input-${product.id}`;
            commentInput.placeholder = "Enter a comment";
    
            var addCommentButton = document.createElement("button");
            addCommentButton.className = "add-comment-button";
            addCommentButton.innerText = "Add comment";
    
            
            const inputAndButtonContainer = document.createElement("div");
            inputAndButtonContainer.classList.add("input-and-button-container");
            inputAndButtonContainer.appendChild(commentInput);
            inputAndButtonContainer.appendChild(addCommentButton);
    
            commentsSection.appendChild(inputAndButtonContainer);
        }        

        detailView.appendChild(closeX);
        detailView.appendChild(productImageDetail);
        detailView.appendChild(detailInfo);
        detailView.appendChild(commentsSection);
        if (i % itemsPerRow === 0) {
            productList.appendChild(productItem);
            productList.appendChild(detailView);
        }
        else {
            prevProductItem === null || prevProductItem === void 0 ? void 0 : prevProductItem.insertAdjacentElement('afterend', productItem);
            prevDetailView === null || prevDetailView === void 0 ? void 0 : prevDetailView.insertAdjacentElement('afterend', detailView);
        }
        prevProductItem = productItem;
        prevDetailView = detailView;
    }
    document.getElementById("wrapul").appendChild(productList);
    document.querySelectorAll("#wrap li").forEach(function (li) {
        li.addEventListener("click", function (e) {
            onProductClick(li, e);
        });
    });
    document.querySelectorAll(".add-to-cart-button").forEach(function (button) {
        button.addEventListener("click", function () {
            onAddToCart(button);
        });
    });
    document.querySelectorAll(".add-comment-button").forEach(function (button) {
        button.addEventListener("click", function () {
            addComment(button);
        });
    });
    document.querySelectorAll(".close a").forEach(function (closeA) {
        closeA.addEventListener("click", function () {
            document.querySelectorAll('#wrap .detail-view').forEach(function (el) {
                el.style.display = 'none';
            });
        });
    });
    getUniqueTags();
}
function DeleteProduct(productId) {
    return function() {
        fetch(`http://localhost:5135/WebShop/delete-product/${productId}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                alert("Greška prilikom brisanja proizvoda. Pokušajte ponovo!");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response;
        })
        .then((data) => {
            alert("Proizvod uspešno obrisan!");
            window.location.reload();
        
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
    
    };
}
function UpdateProduct(productId,detailVievId) {
    return function() {
        var detailView = document.getElementById("detail-" + detailVievId);
        
        console.log("Detail View:", detailView);
        
        if (detailView) {
            var updateForm = document.createElement("form");

            var nameLabel = document.createElement("label");
            nameLabel.innerHTML = "Name: ";
            var nameInput = document.createElement("input");
            nameInput.type = "text";
            nameLabel.appendChild(nameInput);

            var priceLabel = document.createElement("label");
            priceLabel.innerHTML = "Price: ";
            var priceInput = document.createElement("input");
            priceInput.type = "number";
            priceLabel.appendChild(priceInput);

            var tagsLabel = document.createElement("label");
            tagsLabel.innerHTML = "Tags: ";
            var tagsInput = document.createElement("input");
            tagsInput.type = "text";
            tagsLabel.appendChild(tagsInput);

            var updateButton = document.createElement("button");
            updateButton.innerHTML = "Update";
            updateButton.addEventListener('click', function() {
                var updatedName = nameInput.value;
                var updatedPrice = parseInt(priceInput.value);
                var updatedTags = tagsInput.value.split(',');
                UpdateProductOnServer(productId, updatedName, updatedPrice, updatedTags);
            });

            
            updateForm.appendChild(nameLabel);
            updateForm.appendChild(document.createElement("br"));
            updateForm.appendChild(priceLabel);
            updateForm.appendChild(document.createElement("br"));
            updateForm.appendChild(tagsLabel);
            updateForm.appendChild(document.createElement("br"));
            updateForm.appendChild(updateButton);

            var existingForm = detailView.querySelector("form");
            if (existingForm) {
                existingForm.remove();
            }

            detailView.appendChild(updateForm);
        } else {
            console.error("Detail view for product with ID " + productId + " not found.");
        }
    };
}

function UpdateProductOnServer(productId, name, price, tags) {
    fetch(
        `http://localhost:5135/WebShop/update-product/${productId}/${name}/${price}/${tags}`,
        {
            method: "PUT",
        }
    )
    .then((response) => {
        if (!response.ok) {
            alert(
                "Greška prilikom ažuriranja informacija o proizvodu. Pokušajte ponovo!"
            );
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    })
    .then((data) => {
        alert("Vaše informacije su uspešno ažurirane!");
    })
    .catch((error) => {
        console.error("Fetch error:", error);
        alert("Greska!");
    });
}


document.addEventListener("DOMContentLoaded", function () {
    var registerBtn = document.getElementById('registerBtn');
    var loginBtn = document.getElementById('loginBtn');
    var viewCartBtn = document.getElementById('show_cart');
    var adminOptionsBtn = document.getElementById('adminOptionsBtn');
    var logoutBtn = document.getElementById('logoutBtn');


    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    let isLoggedInAdmin = false;
    let isLoggedInUser = false;
    if (token) {
        if (userRole == "admin") {
            isLoggedInAdmin = true;
        }
        else if (userRole == "user") {
            isLoggedInUser = true;
        }
    }
    console.log(isLoggedInUser);
    if (isLoggedInUser) {
        viewCartBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'none';
    }
    if (isLoggedInAdmin) {
        adminOptionsBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'none';
        adminOptionsBtn.addEventListener('click', function () {
            window.location.href = "../html/dodajProizvod.html";
        });
    }
    var _a, _b;
    singleLiOffset = 1000;
    currentOpenedBox = -1;
    arrays = new Array();
    currentPage = 1;
    getProductList(currentPage, "");
    getTotalProducts();

    document.addEventListener('click', function (e) {
        var _a;
        if (e.target.classList.contains('remove')) {
            var deduct = e.target.parentElement.querySelector('.shopp-price em').innerHTML;
            var prevCharges = parseInt(document.querySelector('.cart-total span').innerHTML);
            var thisID = e.target.parentElement.id.replace('each-', '');
            var pos = getpos(arrays, parseInt(thisID));
            arrays.splice(pos, 1, 0);
            prevCharges = prevCharges - parseInt(deduct);
            document.querySelector('.cart-total span').innerHTML = prevCharges.toString();
            document.getElementById('total-hidden-charges').setAttribute('value', prevCharges.toString());
            (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
        }
    });
    (_a = document.getElementById('Submit')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        var totalCharge = document.getElementById('total-hidden-charges').value;
        document.getElementById('cart_wrapper').innerHTML = 'Total Charges: $' + totalCharge;
        return false;
    });
    document.querySelectorAll('.closeCart').forEach(function (closeCart) {
        closeCart.addEventListener('click', function () {
            document.getElementById('cart_wrapper').style.display = 'none';
        });
    });
    (_b = document.getElementById('show_cart')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        if(document.getElementById('cart_wrapper').style.display == 'none')
            document.getElementById('cart_wrapper').style.display = 'block';
        else document.getElementById('cart_wrapper').style.display = 'none';
    });
    registerBtn.addEventListener('click', function () {
        window.location.href = "../html/register.html";
    });

    loginBtn.addEventListener('click', function () {
        window.location.href = "../html/login.html";
    });

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        window.location.href = "../html/index.html";
    });
});
function include(arr, obj) {
    return arr.includes(obj);
}
function getpos(arr, obj) {
    return arr.indexOf(obj);
}
function addFilterBox() {
    var filterContainer = document.getElementById("filter-container");
    var filterOptions = document.createElement("div");
    filterOptions.className = "filter-options";
    filterContainer.appendChild(filterOptions);

    var labelCategory = document.createElement("label");
    labelCategory.for = "category";
    labelCategory.className = "label-category";
    labelCategory.innerText = "Category:";
    filterOptions.appendChild(labelCategory);

    var selectCategory = document.createElement("select");
    selectCategory.className = "filter-select";
    selectCategory.id = "category";
    filterOptions.appendChild(selectCategory);

    tagsSet.forEach(function (tag) {
        var optionTag = document.createElement("option");
        optionTag.value = tag;
        optionTag.innerText = tag;
        selectCategory.appendChild(optionTag);
    });

    var buttonsContainer = document.getElementById("buttons-container");

    var btnApplyFilter = document.createElement("button");
    btnApplyFilter.id = "btn-apply-filter";
    btnApplyFilter.innerText = "Apply Filter";
    btnApplyFilter.addEventListener("click", function (e) {
        currentFilter = selectCategory.options[selectCategory.selectedIndex].value;
        getProductList(currentPage, currentFilter);
    });
    buttonsContainer.appendChild(btnApplyFilter);

    var btnClearFilter = document.createElement("button");
    btnClearFilter.id = "btn-clear-filter";
    btnClearFilter.innerText = "Clear Filter";
    btnClearFilter.addEventListener("click", function (e) {
        currentFilter = "";
        getProductList(currentPage, currentFilter);
    });
    buttonsContainer.appendChild(btnClearFilter);
    filterContainer.appendChild(buttonsContainer);
}

function getTotalProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5135/WebShop/total-products", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var result = JSON.parse(xhr.response);
                renderPages(result);
            }
            else {
                alert("Error loading products");
            }
        }
    };
    xhr.send();
}
function renderPages(totalProducts) {
    var numOfPages = Math.ceil(totalProducts / (itemsPerRow * numOfRows));
    var pageButtonsContainer = document.getElementById('wrap-page-buttons');
    if (pageButtonsContainer) {
        pageButtonsContainer.innerHTML = '';
        var _loop_1 = function (id) {
            var button = document.createElement('button');
            button.textContent = (id + 1).toString();
            button.className = 'page-button';
            button.id = "button-page-".concat(id + 1);
            button.onclick = function () {
                currentPage = id + 1;
                getProductList(currentPage, currentFilter);
            };
            pageButtonsContainer.appendChild(button);
        };
        for (var id = 0; id < numOfPages; id++) {
            _loop_1(id);
        }
    }
}


function showComments(comments, productID) {
    const commentsList = document.getElementById(`comments-list-${productID}`);
    commentsList.innerHTML = "";
    if (Array.isArray(comments) && comments.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No comments";
        commentsList?.appendChild(li);
    }
    else {
        comments.forEach(comment => {
            const li = document.createElement("li");
            li.innerText = comment;
            commentsList?.appendChild(li);
        });
    }
}

function addComment(target) {
    if (!target.classList.contains("add-comment-button"))
        return;
    var productID = target.parentElement.parentElement.id.replace('detail-', '');
    const commentInput = document.getElementById(`comment-input-${productID}`);
    const comment = commentInput.value.trim();
    if (!comment) {
        alert("Comment cannot be empty.");
        return;
    }

    const url = `http://localhost:5135/WebShop/add-comment/${productID}/${comment}`;
    const data = { id: productID, komentar: comment };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(result => {
            getComments(productID);
        })
        .catch(error => {
            console.error('Error during POST request:', error);
        });
    const commentsList = document.getElementById(`comments-list-${productID}`);
    if (commentsList instanceof HTMLElement) {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment;
        commentsList.appendChild(commentItem);
    } else {
        console.error(`Element with ID 'comments-list-${productID}' not found.`);
    }

    getComments(productID);
    commentInput.value = "";
}

function getComments(productID) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:5135/WebShop/product-comments/${productID}`, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const result = JSON.parse(xhr.response);
                showComments(result, productID);
            } else {
                console.error("Error loading comments. Status:", xhr.status);
            }
        }
    };

    xhr.send();
}