// Configurações globais
const CONFIG = {
    testimonials: {
        autoPlay: false,
        interval: 10000,
        totalItems: 7
    },
    transformations: {
        autoPlay: false,
        interval: 10000,
        totalItems: 4
    },
    about: {
        autoPlay: true,
        interval: 8000,
        totalItems: 3
    },
    pixKey: 'aninhasillva150@gmail.com'
};

// Estado da aplicação
let currentTestimonial = 0;
let currentTransformation = 0;
let currentAbout = 0;
let testimonialInterval = null;
let transformationInterval = null;
let aboutInterval = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressiveImageLoading();
    initializeCarousel();
    initializeTransformationCarousel();
    initializeAboutCarousel();
    initializeDonationGoal();
    initializeAnimations();
    initializePIXCopy();
    console.log('Site do Refúgio da Tia Rê carregado com sucesso!');
});

// ===== CARREGAMENTO PROGRESSIVO DE IMAGENS =====

function initializeProgressiveImageLoading() {
    // Lista de imagens em ordem de prioridade (de cima para baixo)
    const imagePriority = [
        // Prioridade 1: Logo e banners principais (carregam imediatamente)
        'imagens/logosemfundo2.png',
        'imagens/banner1novo.webp',
        'imagens/banner2novo.webp',
        'imagens/logo.webp',
        
        // Prioridade 2: Imagens do carrossel Quem Somos
        'imagens/cachorro.webp',
        'imagens/obra.webp',
        'imagens/cachorros.webp',
        
        // Prioridade 3: Imagens do carrossel de transformações (carregam logo após)
        'imagens/antes1.webp',
        'imagens/depois1.webp',
        'imagens/antes 2.webp',
        'imagens/depois 2.webp',
        'imagens/antes 3.webp',
        'imagens/depois 3.webp',
        'imagens/antes 4.webp',
        'imagens/depois 4.webp',
        
        // Prioridade 3: Imagens dos depoimentos (carregam em seguida)
        'imagens/1.webp',
        'imagens/2.webp',
        'imagens/3.webp',
        'imagens/4.webp',
        'imagens/8.webp',
        'imagens/9.webp',
        'imagens/10.webp',
        
        // Prioridade 4: Outras imagens (carregam por último)
        'imagens/pixxx.png'
    ];
    
    // Função para carregar uma imagem
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });
    }
    
    // Função para carregar imagens em lotes com delay
    async function loadImagesInBatches() {
        const batchSize = 3; // Carrega 3 imagens por vez
        const delayBetweenBatches = 100; // 100ms entre lotes
        
        for (let i = 0; i < imagePriority.length; i += batchSize) {
            const batch = imagePriority.slice(i, i + batchSize);
            
            // Carrega o lote atual
            const promises = batch.map(src => loadImage(src).catch(err => {
                console.warn(`Falha ao carregar imagem: ${src}`, err);
                return null;
            }));
            
            await Promise.all(promises);
            
            // Aguarda um pouco antes do próximo lote (exceto para o primeiro lote)
            if (i + batchSize < imagePriority.length) {
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }
        }
        
        console.log('✅ Todas as imagens foram carregadas progressivamente!');
    }
    
    // Carrega as imagens críticas imediatamente
    const criticalImages = [
        'imagens/logosemfundo2.png',
        'imagens/banner1novo.webp',
        'imagens/banner2novo.webp',
        'imagens/logo.webp'
    ];
    
    // Carrega imagens críticas primeiro
    Promise.all(criticalImages.map(src => loadImage(src).catch(err => {
        console.warn(`Falha ao carregar imagem crítica: ${src}`, err);
        return null;
    }))).then(() => {
        console.log('✅ Imagens críticas carregadas!');
        // Inicia o carregamento progressivo das demais imagens
        loadImagesInBatches();
    });
    
    // Função para pré-carregar imagens dos carrosséis
    function preloadCarouselImages() {
        const carouselImages = [
            // Imagens de transformação
            'imagens/antes1.webp', 'imagens/depois1.webp',
            'imagens/antes 2.webp', 'imagens/depois 2.webp',
            'imagens/antes 3.webp', 'imagens/depois 3.webp',
            'imagens/antes 4.webp', 'imagens/depois 4.webp',
            // Imagens de depoimentos
            'imagens/1.webp', 'imagens/2.webp', 'imagens/3.webp', 'imagens/4.webp',
            'imagens/8.webp', 'imagens/9.webp', 'imagens/10.webp'
        ];
        
        carouselImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Pré-carrega imagens dos carrosséis em background
    setTimeout(preloadCarouselImages, 500);
}

// ===== CAROUSEL DE DEPOIMENTOS =====

function initializeCarousel() {
    createCarouselIndicators();
    
    // Garante que o primeiro depoimento seja mostrado
    showTestimonial(0);
    
    if (CONFIG.testimonials.autoPlay) {
        startAutoPlay();
    }
    
    // Event listeners para controles
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Pausa autoplay quando mouse está sobre o carousel
    const carousel = document.getElementById('testimonialsCarousel');
    if (carousel) {
        if (CONFIG.testimonials.autoPlay) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Adiciona suporte para touch/swipe
        initializeTestimonialTouch(carousel);
    }
}

// ===== CAROUSEL DE TRANSFORMAÇÕES =====

function initializeTransformationCarousel() {
    createTransformationIndicators();
    if (CONFIG.transformations.autoPlay) {
        startTransformationAutoPlay();
    }
    
    // Pausa autoplay quando mouse está sobre o carousel
    const transformationCarousel = document.getElementById('transformationCarousel');
    if (transformationCarousel) {
        transformationCarousel.addEventListener('mouseenter', stopTransformationAutoPlay);
        transformationCarousel.addEventListener('mouseleave', startTransformationAutoPlay);
        
        // Adiciona suporte para touch/swipe
        initializeTransformationTouch(transformationCarousel);
    }
}

function createTransformationIndicators() {
    const indicatorsContainer = document.getElementById('transformationIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < CONFIG.transformations.totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = `transformation-indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToTransformation(i));
        indicator.setAttribute('aria-label', `Ir para história ${i + 1}`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Suporte para navegação por teclado nos indicadores
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToTransformation(i);
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

function showTransformation(index) {
    const transformations = document.querySelectorAll('.transformation-item');
    const indicators = document.querySelectorAll('.transformation-indicator');
    
    // Remove classe active de todos
    transformations.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adiciona classe active ao atual
    if (transformations[index]) {
        transformations[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTransformation = index;
}

function nextTransformation() {
    const next = (currentTransformation + 1) % CONFIG.transformations.totalItems;
    goToTransformation(next);
}

function prevTransformation() {
    const prev = currentTransformation === 0 ? CONFIG.transformations.totalItems - 1 : currentTransformation - 1;
    goToTransformation(prev);
}

function goToTransformation(index) {
    if (index >= 0 && index < CONFIG.transformations.totalItems) {
        showTransformation(index);
    }
}

function startTransformationAutoPlay() {
    if (transformationInterval) {
        clearInterval(transformationInterval);
    }
    
    transformationInterval = setInterval(() => {
        nextTransformation();
    }, CONFIG.transformations.interval);
}

function stopTransformationAutoPlay() {
    if (transformationInterval) {
        clearInterval(transformationInterval);
        transformationInterval = null;
    }
}

// ===== CAROUSEL QUEM SOMOS =====

function initializeAboutCarousel() {
    createAboutIndicators();
    initializeAboutTouch();
    if (CONFIG.about.autoPlay) {
        startAboutAutoPlay();
    }
}

function createAboutIndicators() {
    const indicatorsContainer = document.querySelector('.about-indicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < CONFIG.about.totalItems; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'about-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToAbout(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function showAbout(index) {
    const slides = document.querySelectorAll('.about-slide');
    const indicators = document.querySelectorAll('.about-indicator');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    currentAbout = index;
}

function nextAbout() {
    const next = (currentAbout + 1) % CONFIG.about.totalItems;
    goToAbout(next);
}

function prevAbout() {
    const prev = currentAbout === 0 ? CONFIG.about.totalItems - 1 : currentAbout - 1;
    goToAbout(prev);
}

function goToAbout(index) {
    if (index >= 0 && index < CONFIG.about.totalItems) {
        showAbout(index);
        if (CONFIG.about.autoPlay) {
            stopAboutAutoPlay();
            startAboutAutoPlay();
        }
    }
}

function startAboutAutoPlay() {
    if (aboutInterval) clearInterval(aboutInterval);
    aboutInterval = setInterval(() => {
        nextAbout();
    }, CONFIG.about.interval);
}

function stopAboutAutoPlay() {
    if (aboutInterval) {
        clearInterval(aboutInterval);
        aboutInterval = null;
    }
}

function initializeAboutTouch() {
    const carousel = document.getElementById('aboutCarousel');
    if (!carousel) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAboutAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
        
        e.preventDefault();
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        endX = e.changedTouches[0].clientX;
        handleAboutSwipe();
        isDragging = false;
        if (CONFIG.about.autoPlay) {
            startAboutAutoPlay();
        }
    }, { passive: true });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        stopAboutAutoPlay();
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
        handleAboutSwipe();
        isDragging = false;
        if (CONFIG.about.autoPlay) {
            startAboutAutoPlay();
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    function handleAboutSwipe() {
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextAbout();
            } else {
                prevAbout();
            }
        }
    }
}

// ===== META DE DOAÇÃO COM ATUALIZAÇÃO AUTOMÁTICA =====

function initializeDonationGoal() {
    // Configuração da meta
    const goalConfig = {
        targetAmount: 15000,
        startAmount: 4500, // 30% de R$ 15.000
        startDate: new Date(), // Começa hoje
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias a partir de hoje
        startDonations: 374
    };
    
    // Carrega valores salvos ou usa valores iniciais
    loadSavedProgress(goalConfig);
    
    // Atualiza a cada 30 segundos para simular crescimento gradual
    setInterval(() => {
        updateDonationProgress(goalConfig);
    }, 30000);
}


function updateDonationProgress(config) {
    const now = new Date();
    const totalDays = Math.ceil((config.endDate - config.startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.max(0, Math.ceil((now - config.startDate) / (1000 * 60 * 60 * 24)));
    
    // Se ainda não passou nenhum dia, começa com 30%
    if (daysPassed === 0) {
        const currentAmount = config.startAmount; // R$ 15.000
        const percentage = 30;
        const totalDonations = config.startDonations;
        
        updateDonationUI(currentAmount, percentage, totalDonations, config.targetAmount);
        return;
    }
    
    // Calcula o progresso baseado no tempo (crescimento linear ao longo de 30 dias)
    const timeProgress = Math.min(daysPassed / totalDays, 1);
    const baseProgress = 0.3 + (timeProgress * 0.7); // 30% + (tempo * 70%)
    
    // Adiciona pequena variação aleatória para simular flutuações naturais
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% de variação
    const finalProgress = Math.min(Math.max(baseProgress + randomVariation, 0.3), 1);
    
    // Calcula valores
    const currentAmount = Math.floor(config.targetAmount * finalProgress);
    const percentage = Math.floor(finalProgress * 100);
    const additionalDonations = Math.floor((currentAmount - config.startAmount) / 50); // ~R$50 por doação
    const totalDonations = config.startDonations + additionalDonations;
    
    
    // Atualiza a interface
    updateDonationUI(currentAmount, percentage, totalDonations, config.targetAmount);
}

function updateDonationUI(amount, percentage, donations, target) {
    // Formata valores
    const formattedAmount = formatCurrency(amount);
    const formattedTarget = formatCurrency(target);
    const formattedDonations = formatNumber(donations);
    
    // Atualiza elementos
    const amountElement = document.getElementById('amountRaised');
    const percentageElement = document.getElementById('progressPercentage');
    const donationsElement = document.getElementById('donationsCount');
    
    if (amountElement) {
        amountElement.textContent = formattedAmount;
    }
    
    if (percentageElement) {
        percentageElement.textContent = percentage + '%';
    }
    
    if (donationsElement) {
        donationsElement.textContent = formattedDonations + ' doações';
    }
    
    // Atualiza o círculo de progresso
    updateProgressCircle(percentage);
    
    // Salva os valores para persistência
    saveProgress(amount, percentage, donations);
}

function updateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (circle) {
        const radius = 40; // Novo raio do círculo menor
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// ===== PERSISTÊNCIA E MENSAGENS DE DOAÇÃO =====

function loadSavedProgress(config) {
    const savedData = localStorage.getItem('refugioDonationProgress');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const lastUpdate = new Date(data.lastUpdate);
        const now = new Date();
        
        // Se passou mais de 1 hora, atualiza o progresso
        if (now - lastUpdate > 60 * 60 * 1000) {
            updateDonationProgress(config);
        }
        
        // Atualiza a interface com os valores salvos
        updateDonationUI(data.currentAmount, data.percentage, data.totalDonations, config.targetAmount);
        updateProgressCircle(data.percentage);
    } else {
        // Primeira vez - inicia com 30%
        updateDonationProgress(config);
    }
}

function saveProgress(currentAmount, percentage, totalDonations) {
    const data = {
        currentAmount,
        percentage,
        totalDonations,
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem('refugioDonationProgress', JSON.stringify(data));
}


function showDonationMessage(amount) {
    const messagesContainer = document.getElementById('donationMessages');
    if (!messagesContainer) return;
    
    const message = document.createElement('div');
    message.className = 'donation-message';
    message.innerHTML = `🎉 Doação recebida: ${formatCurrency(amount)}`;
    
    messagesContainer.appendChild(message);
    
    // Mostra a mensagem
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    // Remove a mensagem após 4 segundos
    setTimeout(() => {
        message.classList.add('hide');
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 500);
    }, 4000);
}

// ===== TOUCH SUPPORT PARA DEPOIMENTOS =====

function initializeTestimonialTouch(carousel) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        if (CONFIG.testimonials.autoPlay) {
            stopAutoPlay();
        }
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Sensibilidade do swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo
                nextTestimonial();
            } else {
                // Swipe para direita - anterior
                prevTestimonial();
            }
        }
        
        isDragging = false;
        // Só reinicia o autoplay se estiver habilitado
        if (CONFIG.testimonials.autoPlay) {
            startAutoPlay();
        }
    });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        if (CONFIG.testimonials.autoPlay) {
            stopAutoPlay();
        }
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        endX = e.clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
        
        isDragging = false;
        // Só reinicia o autoplay se estiver habilitado
        if (CONFIG.testimonials.autoPlay) {
            startAutoPlay();
        }
    });
    
    // Previne seleção de texto durante o drag
    carousel.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

// ===== TOUCH SUPPORT PARA TRANSFORMAÇÕES =====

function initializeTransformationTouch(carousel) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopTransformationAutoPlay();
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Sensibilidade do swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo
                nextTransformation();
            } else {
                // Swipe para direita - anterior
                prevTransformation();
            }
        }
        
        isDragging = false;
        startTransformationAutoPlay();
    });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        stopTransformationAutoPlay();
        
        // Captura a posição atual
        const activeItem = carousel.querySelector('.transformation-item.active');
        if (activeItem) {
            const transform = window.getComputedStyle(activeItem).transform;
            const matrix = new DOMMatrix(transform);
            currentTranslateX = matrix.m41;
            prevTranslateX = currentTranslateX;
        }
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentX = e.clientX;
        const diffX = currentX - startX;
        const moveX = prevTranslateX + diffX;
        
        // Aplica a animação durante o arraste
        const activeItem = carousel.querySelector('.transformation-item.active');
        const nextItem = carousel.querySelector('.transformation-item.next') || 
                        carousel.querySelector('.transformation-item:nth-child(' + ((currentTransformation + 1) % CONFIG.transformations.totalItems + 1) + ')');
        const prevItem = carousel.querySelector('.transformation-item.prev') || 
                        carousel.querySelector('.transformation-item:nth-child(' + (currentTransformation === 0 ? CONFIG.transformations.totalItems : currentTransformation) + ')');
        
        if (activeItem) {
            activeItem.style.transform = `translateX(${moveX}px)`;
            activeItem.style.transition = 'none';
        }
        
        // Mostra o próximo item durante o arraste
        if (diffX < 0 && nextItem) { // Arrastando para esquerda
            nextItem.style.display = 'block';
            nextItem.style.transform = `translateX(${moveX + carousel.offsetWidth}px)`;
            nextItem.style.transition = 'none';
            nextItem.style.opacity = '0.7';
        } else if (diffX > 0 && prevItem) { // Arrastando para direita
            prevItem.style.display = 'block';
            prevItem.style.transform = `translateX(${moveX - carousel.offsetWidth}px)`;
            prevItem.style.transition = 'none';
            prevItem.style.opacity = '0.7';
        }
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        endX = e.clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        // Reseta as animações
        const activeItem = carousel.querySelector('.transformation-item.active');
        const nextItem = carousel.querySelector('.transformation-item.next') || 
                        carousel.querySelector('.transformation-item:nth-child(' + ((currentTransformation + 1) % CONFIG.transformations.totalItems + 1) + ')');
        const prevItem = carousel.querySelector('.transformation-item.prev') || 
                        carousel.querySelector('.transformation-item:nth-child(' + (currentTransformation === 0 ? CONFIG.transformations.totalItems : currentTransformation) + ')');
        
        if (activeItem) {
            activeItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            activeItem.style.transform = '';
        }
        
        if (nextItem) {
            nextItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            nextItem.style.transform = '';
            nextItem.style.opacity = '';
        }
        
        if (prevItem) {
            prevItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            prevItem.style.transform = '';
            prevItem.style.opacity = '';
        }
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextTransformation();
            } else {
                prevTransformation();
            }
        }
        
        isDragging = false;
        startTransformationAutoPlay();
    });
    
    // Previne seleção de texto durante o drag
    carousel.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

function createCarouselIndicators() {
    const indicatorsContainer = document.getElementById('testimonialIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < CONFIG.testimonials.totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = `testimonial-indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToTestimonial(i));
        indicator.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Suporte para navegação por teclado nos indicadores
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToTestimonial(i);
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    
    // Remove classe active de todos (mesmo princípio do transformation)
    testimonials.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adiciona classe active ao atual
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % CONFIG.testimonials.totalItems;
    goToTestimonial(next);
}

function prevTestimonial() {
    const prev = currentTestimonial === 0 ? CONFIG.testimonials.totalItems - 1 : currentTestimonial - 1;
    goToTestimonial(prev);
}

function goToTestimonial(index) {
    if (index >= 0 && index < CONFIG.testimonials.totalItems) {
        showTestimonial(index);
        if (CONFIG.testimonials.autoPlay) {
            restartAutoPlay();
        }
    }
}

function startAutoPlay() {
    if (CONFIG.testimonials.autoPlay) {
        stopAutoPlay(); // Limpa interval anterior
        testimonialInterval = setInterval(nextTestimonial, CONFIG.testimonials.interval);
    }
}

function stopAutoPlay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

function handleKeyboardNavigation(e) {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    // Verifica se o foco está no carousel ou seus controles
    const isCarouselFocused = carousel.contains(document.activeElement) || 
                             document.activeElement.classList.contains('testimonial-btn') ||
                             document.activeElement.classList.contains('testimonial-indicator');
    
    if (isCarouselFocused) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevTestimonial();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextTestimonial();
                break;
            case 'Home':
                e.preventDefault();
                goToTestimonial(0);
                break;
            case 'End':
                e.preventDefault();
                goToTestimonial(CONFIG.testimonials.totalItems - 1);
                break;
        }
    }
}

function initializePIXCopy() {
    const copyButtons = document.querySelectorAll('#copy-pix');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => copyPixKey(button));
    });
}

async function copyPixKey(button) {
    const pixKey = CONFIG.pixKey;
    
    try {
        // Tenta usar a API moderna de clipboard
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(pixKey);
            showCopySuccess(button);
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = pixKey;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showCopySuccess(button);
            } else {
                throw new Error('Falha ao copiar');
            }
        }
    } catch (error) {
        console.error('Erro ao copiar chave PIX:', error);
        showCopyError(button);
    }
}

function showCopySuccess(button) {
    const originalText = '📋 Copiar Chave PIX';
    const originalClass = button.className;
    
    button.innerText = '✓ Copiado!';
    button.classList.add('copy-success');
    
    // Feedback tátil se disponível
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Mostra SweetAlert2 com imagem no lugar do título
    setTimeout(() => {
        Swal.fire({
            imageUrl: 'https://s2.glbimg.com/B92wGNJIh44B8yV05Bd39zk_VrI=/620x465/s.glbimg.com/jo/g1/f/original/2016/12/16/abas2.jpeg',
            imageWidth: 1,
            imageHeight: 1,
            imageAlt: 'Imagem de confirmação',
            html: '✅ Chave PIX copiada com sucesso!<br>Obrigado por ajudar nossos moradores! ❤️',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                image: 'rounded-image'
            },
            didOpen: () => {
                document.querySelector('.rounded-image').style.borderRadius = '50%';
            }
        });
    }, 500);
    
    // Volta ao estado original após 3 segundos
    setTimeout(() => {
        button.innerText = originalText;
        button.className = originalClass;
        // Remove qualquer estilo inline para voltar ao CSS original
        button.style.background = '';
    }, 3000);
}

function showCopyError(button) {
    const originalText = button.innerText;
    
    button.innerText = '❌ Erro ao copiar';
    button.style.background = '#f44336';
    
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = '';
    }, 2000);
    
    // Mostra SweetAlert2 com imagem no lugar do título
    Swal.fire({
        imageUrl: 'https://s2.glbimg.com/B92wGNJIh44B8yV05Bd39zk_VrI=/620x465/s.glbimg.com/jo/g1/f/original/2016/12/16/abas2.jpeg',
        imageWidth: 1,
        imageHeight: 1,
        imageAlt: 'Imagem de erro',
        html: `❌ Não foi possível copiar automaticamente.<br>Chave PIX: ${CONFIG.pixKey}`,
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
        customClass: {
            image: 'rounded-image'
        },
        didOpen: () => {
            document.querySelector('.rounded-image').style.borderRadius = '50%';
        }
    });
}
// ===== SCROLL SUAVE =====





// ===== ANIMAÇÕES E EFEITOS VISUAIS =====

function initializeAnimations() {
    // Intersection Observer para animações on scroll
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observa elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.stat-item, .testimonial-item, .value-item, .footer-section'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
    
    // Efeito parallax sutil no banner (se suportado)
    initializeParallax();
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Anima o elemento
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Para de observar o elemento após animação
            setTimeout(() => {
                entry.target.style.transition = '';
            }, 600);
        }
    });
}

function initializeParallax() {
    // Desabilitado para evitar problemas de rolagem
    return;
    
    const banner = document.querySelector('.banner-image');
    if (!banner) return;
    
    // Verifica se o usuário não prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Aplica efeito parallax sutil
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        banner.style.transform = `translateY(${parallax}px)`;
    });
}

// ===== UTILITÁRIOS =====

// Debounce function para otimizar eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para detectar dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para logging de eventos (útil para analytics)
function trackEvent(eventName, properties = {}) {
    console.log(`Event: ${eventName}`, properties);
    
            // Aqui você pode integrar com Google Analytics, Facebook Pixel, TikTok Pixel, etc.
        // Exemplo: gtag('event', eventName, properties);
}

// ===== EVENT LISTENERS ADICIONAIS =====

// Otimização para redimensionamento de tela
window.addEventListener('resize', debounce(() => {
    // Reajusta elementos se necessário
    if (CONFIG.testimonials.autoPlay) {
        if (isMobile()) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
}, 250));

// Detecta quando a aba fica inativa/ativa
document.addEventListener('visibilitychange', () => {
    if (CONFIG.testimonials.autoPlay) {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
});

// ===== ACESSIBILIDADE =====

// Melhora a navegação por teclado
document.addEventListener('keydown', (e) => {
    // Esc fecha modais ou para autoplay
    if (e.key === 'Escape' && CONFIG.testimonials.autoPlay) {
        stopAutoPlay();
    }
    
    // Tab trap para elementos focáveis
    handleTabTrap(e);
});

function handleTabTrap(e) {
    if (e.key !== 'Tab') return;
    
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// ===== PERFORMANCE =====

// Função para otimizar carregamento de imagens (sem lazy loading)
function optimizeImageLoading() {
    // Adiciona classe 'loaded' quando a imagem termina de carregar
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// Otimiza carregamento de imagens
optimizeImageLoading();

// ===== FUNÇÕES EXPOSTAS GLOBALMENTE =====

// Exporta funções que podem ser chamadas pelo HTML
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.nextTransformation = nextTransformation;
window.prevTransformation = prevTransformation;
window.nextAbout = nextAbout;
window.prevAbout = prevAbout;
window.goToAbout = goToAbout;
window.copyPixKey = copyPixKey;

// Função removida - agora scrollToDonation abre o modal de doação

// ===== ERROR HANDLING =====

// Captura erros JavaScript
window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
    // Em produção, você enviaria isso para um serviço de logging
});

// Captura erros de Promise rejeitadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
    e.preventDefault();
});

// ===== INICIALIZAÇÃO FINAL =====

// Marca que o script foi carregado
window.CasaSãoMateusLoaded = true;

// Log de inicialização
console.log('Casa São Mateus- Sistema carregado com sucesso! 🐱');
console.log('Versão: 1.0.0');
console.log('Desenvolvido com ❤️ para salvar vidas');

// Service Worker registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registra service worker para cache offline (implementar se necessário)
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===== MODAL DE DOAÇÃO =====

let selectedDonationAmount = null;

function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Força o modal a aparecer
        modal.style.display = 'flex';
    }
}

function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset selection
        selectedDonationAmount = null;
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('customAmount').value = '';
    }
    
    // Hide loading and show modal content
    hideDonationLoading();
}

function selectDonation(amount) {
    selectedDonationAmount = amount;
    
    // Remove selection from all buttons
    document.querySelectorAll('.donation-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    
    // Clear custom amount
    document.getElementById('customAmount').value = '';
}

function proceedToDonation() {
    let amount = selectedDonationAmount;
    
    // Check if custom amount is filled
    const customAmount = document.getElementById('customAmount').value;
    if (customAmount && customAmount > 0) {
        amount = parseFloat(customAmount);
    }
    
    if (!amount || amount <= 0) {
        alert('Por favor, selecione um valor ou digite um valor personalizado.');
        return;
    }
    
    // Show loading
    showDonationLoading();
    
    // Get current UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            utmParams[param] = value;
        }
    });
    
    // Build PIX URL
    let pixUrl = 'gerarpix/index.php?amount=' + amount;
    
    // Add UTM parameters
    Object.keys(utmParams).forEach(key => {
        pixUrl += '&' + key + '=' + encodeURIComponent(utmParams[key]);
    });
    
    // Small delay to show loading, then redirect
    setTimeout(() => {
        window.location.href = pixUrl;
    }, 1500);
}

function scrollToDonation() {
    const pixButton = document.querySelector('#copy-pix');
    
    if (pixButton) {
        pixButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.warn('Elemento com ID "copy-pix" não encontrado.');
    }
}

// Função para redirecionamento direto com valores fixos
function proceedToDonationDirect(amount) {
    // Show loading
    showDonationLoading();
    
    // Get UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            utmParams[param] = value;
        }
    });
    
    // Build PIX URL
    let pixUrl = `gerarpix/index.php?amount=${amount}`;
    
    // Add UTM parameters
    Object.keys(utmParams).forEach(key => {
        pixUrl += `&${key}=${encodeURIComponent(utmParams[key])}`;
    });
    
    // Small delay to show loading, then redirect
    setTimeout(() => {
        window.location.href = pixUrl;
    }, 1500);
}

// Função auxiliar para obter parâmetros da URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
}

// Função para mostrar loading no modal
function showDonationLoading() {
    const loading = document.getElementById('donationLoading');
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    const modalHeader = document.querySelector('.modal-header');
    
    if (loading) {
        loading.style.display = 'flex';
        if (modalBody) modalBody.style.display = 'none';
        if (modalFooter) modalFooter.style.display = 'none';
        if (modalHeader) modalHeader.style.display = 'none';
    }
}

// Função para esconder loading no modal
function hideDonationLoading() {
    const loading = document.getElementById('donationLoading');
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    const modalHeader = document.querySelector('.modal-header');
    
    if (loading) {
        loading.style.display = 'none';
        if (modalBody) modalBody.style.display = 'block';
        if (modalFooter) modalFooter.style.display = 'block';
        if (modalHeader) modalHeader.style.display = 'block';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('donationModal');
    if (event.target === modal) {
        closeDonationModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDonationModal();
    }
});

// Exporta funções para uso global
window.openDonationModal = openDonationModal;
window.closeDonationModal = closeDonationModal;
window.selectDonation = selectDonation;
window.proceedToDonation = proceedToDonation;
window.proceedToDonationDirect = proceedToDonationDirect;
window.scrollToDonation = scrollToDonation;
