// Корзина
let cart = [];
let promoApplied = false;

// Добавление в корзину
function addToCart(name, price, category) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        showNotification('⚠️ Этот товар уже в корзине!');
        return;
    }
    
    cart.push({
        id: Date.now(),
        name: name,
        price: price,
        category: category
    });
    
    updateCart();
    showNotification(`✅ ${name} добавлен в корзину!`);
}

// Обновление корзины
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutAmount = document.getElementById('checkoutAmount');
    
    // Обновляем счетчик
    cartCount.textContent = cart.length;
    
    // Очищаем корзину
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Корзина пуста</p>
                <small>Добавьте товары из магазина</small>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Удалить</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Считаем сумму
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Применяем скидку если есть промокод
    if (promoApplied) {
        total = Math.round(total * 0.9); // 10% скидка
    }
    
    totalAmount.textContent = total.toLocaleString() + ' ₽';
    checkoutAmount.textContent = total.toLocaleString() + ' ₽';
}

// Удаление из корзины
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification('🗑️ Товар удален из корзины');
}

// Переключение корзины
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

// Применение промокода
function applyPromo() {
    const input = document.getElementById('promoInput');
    const code = input.value.trim().toUpperCase();
    
    if (code === 'HOLTEAM' || code === 'СКИДКА10') {
        promoApplied = true;
        updateCart();
        showNotification('🎉 Промокод применен! Скидка 10%');
        input.value = '';
    } else if (code === '') {
        showNotification('⚠️ Введите промокод');
    } else {
        showNotification('❌ Неверный промокод');
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ Корзина пуста!');
        return;
    }
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = promoApplied ? Math.round(total * 0.9) : total;
    
    const methodNames = {
        'card': 'Банковская карта',
        'qiwi': 'Qiwi',
        'yoomoney': 'ЮMoney',
        'crypto': 'Криптовалюта'
    };
    
    const confirmMsg = `Подтверждение покупки:\n\n` +
        cart.map(item => `- ${item.name}: ${item.price.toLocaleString()} ₽`).join('\n') +
        `\n\nИтого: ${finalTotal.toLocaleString()} ₽\n` +
        `Способ оплаты: ${methodNames[paymentMethod]}\n\n` +
        `Продолжить оплату?`;
    
    if (confirm(confirmMsg)) {
        showNotification('🔄 Перенаправляем на оплату...');
        
        setTimeout(() => {
            alert(`Заказ оформлен!\n\nВ реальном проекте здесь был бы переход на страницу оплаты.\n\nСумма: ${finalTotal.toLocaleString()} ₽`);
            
            cart = [];
            promoApplied = false;
            updateCart();
            toggleCart();
        }, 1500);
    }
}

// Копирование IP
function copyIP() {
    const ip = document.getElementById('serverIp').textContent;
    
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('✅ IP скопирован!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('✅ IP скопирован!');
    });
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #1e293b;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border-left: 4px solid #fbbf24;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Фильтрация категорий
function filterCategory(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.category-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Переключение вкладок правил
function switchRulesTab(tabName) {
    document.querySelectorAll('.rules-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.rules-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Частицы на фоне
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(251, 191, 36, ${Math.random() * 0.3 + 0.1});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
        `;
        container.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-30px) translateX(5px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

console.log('%c⚔️ Выживание Хол тим', 'color: #fbbf24; font-size: 20px; font-weight: bold;');
console.log('%cIP: play.holteam.ru', 'color: #fbbf24; font-size: 12px;');