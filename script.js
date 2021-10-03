const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
let modalQt = 1;
let carroCompras = [];

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex==2) {
                size.classList.add('selected');
            };

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
        c('.pizzaWindowArea').style.opacity = 1;   
        },200);
    });
        
    c('.pizza-area').append(pizzaItem) ;
    
});

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';  
    }, 500);
}

cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{

    if(modalQt>1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', ()=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = carroCompras.findIndex((item)=> item.identifier == identifier);

    if(key >-1){
        carroCompras[key].qt += modalQt;
    } else {
        carroCompras.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt    
        });
    }
 
    updateCarroCompras();
    closeModal();
    
});

c('.menu-openner').addEventListener('click', ()=> {
    if(carroCompras.length>0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=> {
    c('aside').style.left = '100vw';
});

function updateCarroCompras() {

    c('.menu-openner span').innerHTML = carroCompras.length;


    if(carroCompras.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in carroCompras) {
            let pizza = pizzaJson.find((item)=> item.id == carroCompras[i].id);
            let CarrinhoItem = c('.models .cart--item').cloneNode(true);
            subtotal += pizza.price * carroCompras[i].qt;

            let pizzaNameSize;
            switch (carroCompras[i].size) {
                case 0:
                    pizzaNameSize = 'P';
                    break;
                case 1:
                    pizzaNameSize = 'M';
                    break;
                case 2:
                    pizzaNameSize = 'G';
                    break;
            };

            pizzaName = `${pizza.name} (${pizzaNameSize})`;

            CarrinhoItem.querySelector('img').src = pizza.img;
            CarrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            CarrinhoItem.querySelector('.cart--item--qt').innerHTML = carroCompras[i].qt;

            CarrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(carroCompras[i].qt > 1 ) {
                    carroCompras[i].qt--;
                } else {
                    carroCompras.splice(i, 1);
                };

                updateCarroCompras();

            });

            CarrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                carroCompras[i].qt++;
                updateCarroCompras();
            });


            c('.cart').append(CarrinhoItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';

    };

};