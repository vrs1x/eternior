/* ETERNIOR - Lab & Core Logic
   Author: Arsić Development
*/

let cart = JSON.parse(localStorage.getItem('eternior_cart')) || [];
// Proširen objekat da prati boju, broj ruža i slatkiše
let currentLabConfig = { 
    color: 'Crvena', 
    extraColorPrice: 0, 
    roseCount: 1, 
    extraRosePrice: 0, 
    sweets: 0, 
    sweetPrice: 0, 
    total: 3000 
};
let currentStdProduct = {};

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setInterval(createFloatingHeart, 2500);
});

// --- CORE FUNCTIONS ---
function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
function toggleCart() { document.getElementById('side-cart').classList.toggle('active'); }

function addToCart(name, price, size = 'Standard') {
    cart.push({ name, price, size });
    localStorage.setItem('eternior_cart', JSON.stringify(cart));
    updateCartUI();
    if (!document.getElementById('side-cart').classList.contains('active')) toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('eternior_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const countSpan = document.getElementById('cart-count');
    const totalSpan = document.getElementById('cart-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.style = "display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;";
        itemDiv.innerHTML = `
            <div>
                <p style="color:#d4af37; font-weight:600; margin:0;">${item.name}</p>
                <small style="color:#666;">${item.size} - ${item.price} RSD</small>
            </div>
            <span onclick="removeFromCart(${index})" style="cursor:pointer; color:#ff4d4d; font-size:20px;">&times;</span>
        `;
        container.appendChild(itemDiv);
    });
    countSpan.innerText = cart.length;
    totalSpan.innerText = total.toLocaleString();
}

// --- ETERNIOR LAB LOGIC ---
function openLabModal() {
    document.getElementById('lab-modal').style.display = 'block';
    updateLabUI();
}

function closeLabModal() { document.getElementById('lab-modal').style.display = 'none'; }

function updateLab(type, value, img, price) {
    // 1. Logika za boju
    if(type === 'color') {
        currentLabConfig.color = value;
        currentLabConfig.extraColorPrice = price;
        const mainImg = document.getElementById('lab-main-img');
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
            mainImg.src = img;
            mainImg.style.opacity = '1';
        }, 200);
        
        document.querySelectorAll('#lab-colors .chip').forEach(c => {
            c.classList.toggle('active', c.innerText.includes(value));
        });
    }

    // 2. Logika za broj ruža
    if(type === 'count') {
        currentLabConfig.roseCount = value;
        currentLabConfig.extraRosePrice = price;
        
        document.querySelectorAll('#lab-rose-count .chip').forEach(c => {
            // Provera da li čip sadrži broj koji smo kliknuli
            c.classList.toggle('active', c.innerText.startsWith(value + " "));
        });
    }

    // 3. Logika za slatkiše
    if(type === 'sweets') {
        currentLabConfig.sweets = value;
        currentLabConfig.sweetPrice = price;
        document.querySelectorAll('#lab-sweets .chip').forEach(c => {
            const valText = value === 0 ? 'Bez' : value + ' kom';
            c.classList.toggle('active', c.innerText === valText);
        });
    }

    updateLabUI();
}

function updateLabUI() {
    const oldPrice = currentLabConfig.total;
    const priceDisplay = document.getElementById('lab-total');
    
    currentLabConfig.total = 2000 + 
                            currentLabConfig.extraColorPrice + 
                            currentLabConfig.extraRosePrice + 
                            currentLabConfig.sweetPrice;
    
    // Dodaj "bump" efekat
    priceDisplay.classList.add('price-bump');
    setTimeout(() => priceDisplay.classList.remove('price-bump'), 200);

    animatePrice('lab-total', oldPrice, currentLabConfig.total, 300);
}

function addLabToCart() {
    const note = document.getElementById('lab-note').value;
    const details = `Boja: ${currentLabConfig.color}, Ruža: ${currentLabConfig.roseCount}, Slatkiši: ${currentLabConfig.sweets} kom ${note ? '| Poruka: ' + note : ''}`;
    addToCart("Custom Eternior Lab", currentLabConfig.total, details);
    closeLabModal();
}

// --- STANDARD MODAL LOGIC ---
function openStandardModal(name, price, img, desc, isSweet) {
    currentStdProduct = { name, price, img, isSweet };
    document.getElementById('std-title').innerText = name;
    document.getElementById('std-desc').innerText = desc;
    document.getElementById('std-image').src = img;
    document.getElementById('std-sweet-option').style.display = isSweet ? 'block' : 'none';
    document.getElementById('standard-modal').style.display = 'block';
    updateStdPrice();
}

function closeStandardModal() { document.getElementById('standard-modal').style.display = 'none'; }

function updateStdPrice() {
    const qty = document.getElementById('std-qty').value;
    const total = currentStdProduct.price * qty;
    document.getElementById('std-total-price').innerText = total.toLocaleString();
}

function addStandardToCart() {
    const qty = document.getElementById('std-qty').value;
    const total = currentStdProduct.price * qty;
    let details = `Količina: ${qty}`;
    if(currentStdProduct.isSweet) details += ` | Slatkiš: ${document.getElementById('std-sweet-type').value}`;
    
    addToCart(currentStdProduct.name, total, details);
    closeStandardModal();
}

// --- WHATSAPP ---
function sendWhatsApp() {
    if (cart.length === 0) return alert("Korpa je prazna! ❤️");
    let msg = "🌹 *ETERNIOR - Porudžbina* 🌹\n\n";
    cart.forEach(item => msg += `📍 *${item.name}*\n${item.size}\n💰 ${item.price} RSD\n\n`);
    const total = cart.reduce((s, i) => s + i.price, 0);
    msg += `*UKUPNO:* ${total} RSD`;
    window.open(`https://wa.me/381611633267?text=${encodeURIComponent(msg)}`, 'blank');
}

// --- HEARTS ---
function createFloatingHeart() {
    if (window.innerWidth < 768) return; 
    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart cupid-heart';
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 15 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 4) + "s";
    heart.style.opacity = Math.random() * 0.5;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

// --- PRICE ANIMATION ---
function animatePrice(elementId, start, end, duration) {
    const obj = document.getElementById(elementId);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Optimizacija klika za mobilne uređaje
document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('button, .cart-trigger, .menu-toggle');
    buttons.forEach(btn => {
        btn.style.touchAction = "manipulation";
    });
});

