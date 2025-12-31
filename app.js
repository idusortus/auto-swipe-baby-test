// Baby Name Swiper Application
class BabyNameSwiper {
    constructor() {
        this.allNames = [...babyNames];
        this.currentFilter = 'all';
        this.likedNames = [];
        this.currentNames = [];
        this.currentIndex = 0;
        
        this.cardStack = document.getElementById('cardStack');
        this.likedCount = document.getElementById('likedCount');
        this.remainingCount = document.getElementById('remainingCount');
        this.emptyState = document.getElementById('emptyState');
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.filterNames(this.currentFilter);
        this.shuffleNames();
        this.renderCards();
        this.updateStats();
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterNames(this.currentFilter);
                this.shuffleNames();
                this.currentIndex = 0;
                this.renderCards();
                this.updateStats();
                this.hideEmptyState();
            });
        });
        
        // Action buttons
        document.getElementById('passBtn').addEventListener('click', () => {
            this.swipeCard('left');
        });
        
        document.getElementById('likeBtn').addEventListener('click', () => {
            this.swipeCard('right');
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.likedNames = [];
            this.currentIndex = 0;
            this.filterNames(this.currentFilter);
            this.shuffleNames();
            this.renderCards();
            this.updateStats();
            this.hideEmptyState();
        });
    }
    
    filterNames(filter) {
        if (filter === 'all') {
            this.currentNames = [...this.allNames];
        } else {
            this.currentNames = this.allNames.filter(name => name.gender === filter);
        }
    }
    
    shuffleNames() {
        // Fisher-Yates shuffle
        for (let i = this.currentNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentNames[i], this.currentNames[j]] = [this.currentNames[j], this.currentNames[i]];
        }
    }
    
    renderCards() {
        this.cardStack.innerHTML = '';
        
        // Render next 3 cards for stacking effect
        const cardsToRender = Math.min(3, this.currentNames.length - this.currentIndex);
        
        for (let i = cardsToRender - 1; i >= 0; i--) {
            const nameData = this.currentNames[this.currentIndex + i];
            if (nameData) {
                const card = this.createCard(nameData, i === 0);
                this.cardStack.appendChild(card);
                
                // Scale and position for stack effect
                if (i > 0) {
                    card.style.transform = `scale(${1 - i * 0.05}) translateY(${i * -10}px)`;
                    card.style.zIndex = cardsToRender - i;
                    card.style.opacity = 1 - i * 0.2;
                }
            }
        }
    }
    
    createCard(nameData, isTopCard) {
        const card = document.createElement('div');
        card.className = 'card' + (isTopCard ? ' top-card' : '');
        
        card.innerHTML = `
            <div class="name">${nameData.name}</div>
            <div class="gender ${nameData.gender}">${nameData.gender === 'boy' ? '👦 Boy' : '👧 Girl'}</div>
        `;
        
        if (isTopCard) {
            this.addSwipeListeners(card);
        }
        
        return card;
    }
    
    addSwipeListeners(card) {
        // Touch events
        card.addEventListener('touchstart', (e) => this.handleDragStart(e, card), { passive: false });
        card.addEventListener('touchmove', (e) => this.handleDragMove(e, card), { passive: false });
        card.addEventListener('touchend', (e) => this.handleDragEnd(e, card));
        
        // Mouse events
        card.addEventListener('mousedown', (e) => this.handleDragStart(e, card));
        card.addEventListener('mousemove', (e) => this.handleDragMove(e, card));
        card.addEventListener('mouseup', (e) => this.handleDragEnd(e, card));
        card.addEventListener('mouseleave', (e) => {
            if (this.isDragging) {
                this.handleDragEnd(e, card);
            }
        });
    }
    
    handleDragStart(e, card) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        this.isDragging = true;
        card.classList.add('dragging');
        
        const touch = e.type.includes('touch') ? e.touches[0] : e;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }
    
    handleDragMove(e, card) {
        if (!this.isDragging) return;
        
        const touch = e.type.includes('touch') ? e.touches[0] : e;
        this.currentX = touch.clientX - this.startX;
        this.currentY = touch.clientY - this.startY;
        
        const rotation = this.currentX / 20;
        card.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotation}deg)`;
        
        // Show indicators
        const leftIndicator = document.querySelector('.swipe-indicator.left');
        const rightIndicator = document.querySelector('.swipe-indicator.right');
        
        if (this.currentX < -50) {
            leftIndicator.classList.add('show');
            rightIndicator.classList.remove('show');
        } else if (this.currentX > 50) {
            rightIndicator.classList.add('show');
            leftIndicator.classList.remove('show');
        } else {
            leftIndicator.classList.remove('show');
            rightIndicator.classList.remove('show');
        }
        
        if (e.type.includes('touch')) {
            e.preventDefault();
        }
    }
    
    handleDragEnd(e, card) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        card.classList.remove('dragging');
        
        // Hide indicators
        document.querySelectorAll('.swipe-indicator').forEach(ind => ind.classList.remove('show'));
        
        const threshold = 100;
        
        if (Math.abs(this.currentX) > threshold) {
            // Swipe detected
            const direction = this.currentX > 0 ? 'right' : 'left';
            this.animateSwipe(card, direction);
        } else {
            // Return to center
            card.style.transform = '';
        }
        
        this.currentX = 0;
        this.currentY = 0;
    }
    
    swipeCard(direction) {
        const topCard = document.querySelector('.card.top-card');
        if (topCard) {
            this.animateSwipe(topCard, direction);
        }
    }
    
    animateSwipe(card, direction) {
        const moveX = direction === 'right' ? 1000 : -1000;
        const rotation = direction === 'right' ? 50 : -50;
        
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `translate(${moveX}px, -100px) rotate(${rotation}deg)`;
        
        // Show indicator briefly
        const indicator = document.querySelector(`.swipe-indicator.${direction}`);
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
            
            if (direction === 'right') {
                this.likedNames.push(this.currentNames[this.currentIndex]);
            }
            
            this.currentIndex++;
            this.updateStats();
            
            if (this.currentIndex >= this.currentNames.length) {
                this.showEmptyState();
            } else {
                this.renderCards();
            }
        }, 500);
    }
    
    updateStats() {
        this.likedCount.textContent = this.likedNames.length;
        this.remainingCount.textContent = Math.max(0, this.currentNames.length - this.currentIndex);
    }
    
    showEmptyState() {
        this.cardStack.style.display = 'none';
        this.emptyState.style.display = 'block';
    }
    
    hideEmptyState() {
        this.cardStack.style.display = 'block';
        this.emptyState.style.display = 'none';
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BabyNameSwiper();
});
