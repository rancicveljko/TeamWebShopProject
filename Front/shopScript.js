var singleLiOffset;
var currentOpenedBox;
var arrays;
function onProductClick(target, e) {
    var thisID = target.id;
    var id = Array.from(document.getElementById('wrap').querySelectorAll('li')).indexOf(target);
    if (currentOpenedBox === id) { // if user clicks an opened box (li) again you close the box and return back
        document.querySelectorAll("#wrap .detail-view").forEach(function (el) {
            el.style.display = "none";
        });
        return false;
    }
    document.getElementById("cart_wrapper").style.display = "none";
    document.querySelectorAll("#wrap .detail-view").forEach(function (el) {
        el.style.display = "none";
    });
    // save this id. so if user clicks an opened box li again you close the box.
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
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.scrollTop = targetOffset;
    document.body.scrollTop = targetOffset;
    document.querySelectorAll("#wrap #detail-".concat(thisID)).forEach(function (el) {
        el.style.display = "block";
    });
    return true;
}
function onAddToCart(target) {
    // const thisID: string = target.parentElement.parentElement.id.replace('detail-', '');
    // const itemname: string = target.parentElement.querySelector('.item_name').innerHTML;
    // const itemprice: string = target.parentElement.querySelector('.price').innerHTML;
    // if (include(arrays, parseInt(thisID))) {
    //     const price: string = document.getElementById(`each-${thisID}`).querySelector(".shopp-price em").innerHTML;
    //     let quantity: number = parseInt(document.getElementById(`each-${thisID}`).querySelector(".shopp-quantity").innerHTML);
    //     quantity += 1;
    //     const total: number = parseInt(itemprice) * quantity;
    //     document.getElementById(`each-${thisID}`).querySelector(".shopp-price em").innerHTML = total.toString();
    //     document.getElementById(`each-${thisID}`).querySelector(".shopp-quantity").innerHTML = quantity.toString();
    //     let prevCharges: number = parseInt(document.querySelector('.cart-total span').innerHTML);
    //     prevCharges = prevCharges - parseInt(price);
    //     prevCharges += total;
    //     document.querySelector('.cart-total span').innerHTML = prevCharges.toString();
    //     document.getElementById('total-hidden-charges').setAttribute('value', prevCharges.toString());
    // } else {
    //     arrays.push(parseInt(thisID));
    //     let prevCharges: number = parseInt(document.querySelector('.cart-total span').innerHTML);
    //     prevCharges += parseInt(itemprice);
    //     document.querySelector('.cart-total span').innerHTML = prevCharges.toString();
    //     document.getElementById('total-hidden-charges').setAttribute('value', prevCharges.toString());
    //     const height: number = document.getElementById('cart_wrapper').offsetHeight;
    //     document.getElementById('cart_wrapper').style.height = (height + 45) + "px";
    //     const cartInfo = document.getElementById('cart_wrapper').querySelector('.cart-info');
    //     const newCartItem = document.createElement('div');
    //     newCartItem.className = 'shopp';
    //     newCartItem.id = `each-${thisID}`;
    //     newCartItem.innerHTML = `
    //         <div class="label">${itemname}</div>
    //         <div class="shopp-price"> $<em>${itemprice}</em></div>
    //         <span class="shopp-quantity">1</span>
    //         <img src="remove.png" class="remove" />
    //         <br class="all" />
    //     `;
    //     cartInfo?.appendChild(newCartItem);
    // }
}
function getProductList(page) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5135/WebShop/product-list/".concat(page), true);
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
    var productList = document.createElement("ul");
    var prevProductItem = null;
    var prevDetailView = null;
    for (var i = 0; i < result.length; i++) {
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
        productDiv.id = product._id;
        productItem.appendChild(productImage);
        productItem.appendChild(productBr);
        productItem.appendChild(productDiv);
        var detailView = document.createElement("div");
        detailView.className = "detail-view";
        detailView.id = "detail-" + (i + 1).toString();
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
        detailInfo.appendChild(itemName);
        detailInfo.appendChild(productBr);
        detailInfo.appendChild(productDesc);
        detailInfo.appendChild(productBr3);
        detailInfo.appendChild(productButton);
        detailView.appendChild(closeX);
        detailView.appendChild(productImageDetail);
        detailView.appendChild(detailInfo);
        if (i % 4 === 0) {
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
    document.querySelectorAll(".close a").forEach(function (closeA) {
        closeA.addEventListener("click", function () {
            document.querySelectorAll('#wrap .detail-view').forEach(function (el) {
                el.style.display = 'none';
            });
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var _a, _b;
    singleLiOffset = 1000;
    currentOpenedBox = -1;
    arrays = new Array();
    getProductList(1);
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
        document.getElementById('cart_wrapper').style.display = 'block';
    });
});
function include(arr, obj) {
    return arr.includes(obj);
}
function getpos(arr, obj) {
    return arr.indexOf(obj);
}
