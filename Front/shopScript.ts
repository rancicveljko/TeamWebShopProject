let singleLiOffset: number;
let currentOpenedBox: number;
let arrays: Array<number>;
const tagsSet = new Set<string>();
let currentPage: number;
let currentFilter: string = "";
const itemsPerRow: number = 4;
const numOfRows: number = 2;

function onProductClick(target: HTMLLIElement, e: Event) {
    const thisID: string = target.id;
    const id: number = Array.from(document.getElementById('wrap')!.querySelectorAll('li')).indexOf(target);



    if (currentOpenedBox === id) { // if user clicks an opened box (li) again you close the box and return back
        document.querySelectorAll("#wrap .detail-view").forEach((el) => {
            (el as HTMLElement).style.display = "none";
        });
        return false;
    }

    document.getElementById("cart_wrapper")!.style.display = "none";
    document.querySelectorAll("#wrap .detail-view").forEach((el) => {
        (el as HTMLElement).style.display = "none";
    });

    // save this id. so if user clicks an opened box li again you close the box.
    currentOpenedBox = id;

    let targetOffset: number = 0;

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

    document.querySelectorAll(`#wrap #detail-${thisID}`).forEach((el) => {
        (el as HTMLElement).style.display = "block";
    });

    return true;
}

function onAddToCart(target: HTMLElement): void {
    if (!target.classList.contains("add-to-cart-button")) return;
    const thisID: string = target.parentElement!.parentElement!.id.replace('detail-', '');
    const itemname: string = target.parentElement!.querySelector('.item_name')!.innerHTML;
    const itemprice: string = target.parentElement!.querySelector('.price')!.innerHTML;

    if (include(arrays, parseInt(thisID))) {
        const price: string = document.getElementById(`each-${thisID}`)!.querySelector(".shopp-price em")!.innerHTML;
        let quantity: number = parseInt(document.getElementById(`each-${thisID}`)!.querySelector(".shopp-quantity")!.innerHTML);
        quantity += 1;

        const total: number = parseInt(itemprice) * quantity;

        document.getElementById(`each-${thisID}`)!.querySelector(".shopp-price em")!.innerHTML = total.toString();
        document.getElementById(`each-${thisID}`)!.querySelector(".shopp-quantity")!.innerHTML = quantity.toString();

        let prevCharges: number = parseInt(document.querySelector('.cart-total span')!.innerHTML);
        prevCharges = prevCharges - parseInt(price);

        prevCharges += total;
        document.querySelector('.cart-total span')!.innerHTML = prevCharges.toString();

        document.getElementById('total-hidden-charges')!.setAttribute('value', prevCharges.toString());
    } else {
        arrays.push(parseInt(thisID));

        let prevCharges: number = parseInt(document.querySelector('.cart-total span')!.innerHTML);
        prevCharges += parseInt(itemprice);

        document.querySelector('.cart-total span')!.innerHTML = prevCharges.toString();
        document.getElementById('total-hidden-charges')!.setAttribute('value', prevCharges.toString());

        const height: number = document.getElementById('cart_wrapper')!.offsetHeight;
        document.getElementById('cart_wrapper')!.style.height = (height + 45) + "px";

        const cartInfo = document.getElementById('cart_wrapper')!.querySelector('.cart-info');
        const newCartItem = document.createElement('div');
        newCartItem.className = 'shopp';
        newCartItem.id = `each-${thisID}`;
        newCartItem.innerHTML = `
            <div class="label">${itemname}</div>
            <div class="shopp-price"> $<em>${itemprice}</em></div>
            <span class="shopp-quantity">1</span>
            <img src="../Assets/remove.png" class="remove" />
            <br class="all" />
        `;
        cartInfo?.appendChild(newCartItem);
    }
}

function getProductList(page: number, filter: string): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:5135/WebShop/product-list/${page}?tag=${filter}`, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const result = JSON.parse(xhr.response);
                renderProducts(result);
            } else {
                alert("Error loading products");
            }
        }
    };

    xhr.send();
}

function renderProducts(result: any): void {

    // clear previous ul
    const ulWrap = document.getElementById("wrapul")!;
    ulWrap.innerHTML = "";

    const productList = document.createElement("ul");
    let prevProductItem: HTMLElement | null = null;
    let prevDetailView: HTMLElement | null = null;

    for (let i = 0; i < result.length; i++) {
        const product = result[i];
        result[i].tags.forEach(element => tagsSet.add(element)); // add tags

        const productItem = document.createElement("li");
        productItem.id = (i + 1).toString();

        const productImage = document.createElement("img");
        productImage.src = "../product_img/" + product.imageURL;
        productImage.className = "items";
        productImage.height = 100;

        const productBr = document.createElement("br");
        productBr.setAttribute("clear", "all");

        const productDiv = document.createElement("div");
        productDiv.innerHTML = product.name;
        productDiv.id = product._id;

        productItem.appendChild(productImage);
        productItem.appendChild(productBr);
        productItem.appendChild(productDiv);

        const detailView = document.createElement("div");
        detailView.className = "detail-view";
        detailView.id = "detail-" + (i + 1).toString();

        const closeX = document.createElement("div");
        closeX.className = "close";
        closeX.setAttribute("align", "right");

        const closeXA = document.createElement("a");
        closeXA.innerHTML = "x";
        closeXA.href = "javascript:void(0)";

        closeX.appendChild(closeXA);

        const productImageDetail = document.createElement("img");
        productImageDetail.src = "../product_img/" + product.imageURL;
        productImageDetail.className = "detail_images";
        productImageDetail.width = 340;
        productImageDetail.height = 310;

        const detailInfo = document.createElement("div");
        detailInfo.className = "detail_info";

        const itemName = document.createElement("label");
        itemName.className = "item_name";
        itemName.innerHTML = product.name;

        const productBr1 = document.createElement("br");
        productBr1.setAttribute("clear", "all");

        let desc = "";
        for (let j = 0; j < product.tags.length - 1; j++) {
            desc = desc + product.tags[j] + ", ";
        }
        desc = desc + product.tags[product.tags.length - 1];

        const productDesc = document.createElement("p");
        productDesc.innerHTML = desc;

        const productBr2 = document.createElement("br");
        productBr2.setAttribute("clear", "all");

        const productBr3 = document.createElement("br");
        productBr3.setAttribute("clear", "all");

        const productSpan = document.createElement("span");
        productSpan.className = "price";
        productSpan.innerHTML = product.price;

        productDesc.appendChild(productBr1);
        productDesc.appendChild(productBr2);
        productDesc.appendChild(productSpan);

        const productButton = document.createElement("button");
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

        if (i % itemsPerRow === 0) {
            productList.appendChild(productItem);
            productList.appendChild(detailView);
        } else {
            prevProductItem?.insertAdjacentElement('afterend', productItem);
            prevDetailView?.insertAdjacentElement('afterend', detailView);
        }

        prevProductItem = productItem;
        prevDetailView = detailView;
    }

    document.getElementById("wrapul")!.appendChild(productList);

    document.querySelectorAll("#wrap li").forEach((li) => {
        li.addEventListener("click", function (e) {
            onProductClick(li as HTMLLIElement, e);
        });
    });

    document.querySelectorAll(".add-to-cart-button").forEach((button) => {
        button.addEventListener("click", function () {
            onAddToCart(button as HTMLElement);
        });
    });

    document.querySelectorAll(".close a").forEach((closeA) => {
        closeA.addEventListener("click", function () {
            document.querySelectorAll('#wrap .detail-view').forEach((el) => {
                (el as HTMLElement).style.display = 'none';
            });
        });
    });

    addFilterBox();
}

document.addEventListener("DOMContentLoaded", function () {
    singleLiOffset = 1000;
    currentOpenedBox = -1;
    arrays = new Array<number>();

    currentPage = 1;
    getProductList(currentPage, "");
    getTotalProducts();

    document.addEventListener('click', function (e) {
        if ((e.target as HTMLElement).classList.contains('remove')) {
            const deduct: string = (e.target as HTMLElement).parentElement!.querySelector('.shopp-price em')!.innerHTML;
            let prevCharges: number = parseInt(document.querySelector('.cart-total span')!.innerHTML);
            const thisID: string = (e.target as HTMLElement).parentElement!.id.replace('each-', '');

            const pos: number = getpos(arrays, parseInt(thisID));
            arrays.splice(pos, 1, 0);

            prevCharges = prevCharges - parseInt(deduct);
            document.querySelector('.cart-total span')!.innerHTML = prevCharges.toString();
            document.getElementById('total-hidden-charges')!.setAttribute('value', prevCharges.toString());
            (e.target as HTMLElement).parentElement?.remove();
        }
    });

    document.getElementById('Submit')?.addEventListener('click', function () {
        const totalCharge: string = (document.getElementById('total-hidden-charges') as HTMLInputElement).value;
        document.getElementById('cart_wrapper')!.innerHTML = 'Total Charges: $' + totalCharge;
        return false;
    });

    document.querySelectorAll('.closeCart').forEach((closeCart) => {
        closeCart.addEventListener('click', function () {
            document.getElementById('cart_wrapper')!.style.display = 'none';
        });
    });

    document.getElementById('show_cart')?.addEventListener('click', function () {
        document.getElementById('cart_wrapper')!.style.display = 'block';
    });
});

function include(arr: Array<number>, obj: number): boolean {
    return arr.includes(obj);
}

function getpos(arr: Array<number>, obj: number): number {
    return arr.indexOf(obj);
}

function addFilterBox(): void {
    const wrapUl: HTMLElement = document.getElementById("wrapul")!;

    const newDiv: HTMLDivElement = document.createElement("div");
    newDiv.id = "wrap-select";
    wrapUl.appendChild(newDiv);

    const selLabel = document.createElement("label");
    selLabel.className = "select-label";
    selLabel.innerText = "Filter:";
    newDiv.appendChild(selLabel);

    const newSelect = document.createElement("select");
    newSelect.id = "filter-select";
    newDiv.appendChild(newSelect);

    tagsSet.forEach(tag => {
        const newOpt = document.createElement("option");
        newOpt.value = tag;
        newOpt.innerText = tag;
        newSelect.appendChild(newOpt);
    });

    newDiv.appendChild(document.createElement("br"));
    const btnApplyFilter = document.createElement("button");
    btnApplyFilter.id = "btn-apply-filter";
    btnApplyFilter.innerText = "Apply Filter";
    btnApplyFilter.addEventListener("click", function (e) {

        currentFilter = newSelect.options[newSelect.selectedIndex].value;
        getProductList(currentPage, currentFilter);
    });
    newDiv.appendChild(btnApplyFilter);

    const btnClearFilter = document.createElement("button");
    btnClearFilter.id = "btn-clear-filter";
    btnClearFilter.innerText = "Clear Filter";
    btnClearFilter.addEventListener("click", function (e) {
        currentFilter = "";
        getProductList(currentPage, currentFilter);
    });
    newDiv.appendChild(btnClearFilter);

}

function getTotalProducts(): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:5135/WebShop/total-products`, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const result = JSON.parse(xhr.response);
                renderPages(result);
            } else {
                alert("Error loading products");
            }
        }
    };

    xhr.send();
}

function renderPages(totalProducts: number): void {
    let numOfPages: number = Math.ceil(totalProducts / (itemsPerRow * numOfRows));

    const pageButtonsContainer: HTMLElement | null = document.getElementById('wrap-page-buttons');

    if (pageButtonsContainer) {
        pageButtonsContainer.innerHTML = '';

        for (let id = 0; id < numOfPages; id++) {
            const button = document.createElement('button');

            button.textContent = (id + 1).toString(); 
            button.className = 'page-button';
            button.id = `button-page-${id + 1}`;

            button.onclick = function () {
                currentPage = id + 1;
                getProductList(currentPage, currentFilter);
            };

            pageButtonsContainer.appendChild(button);
        }
    }
}