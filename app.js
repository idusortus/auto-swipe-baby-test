// Baby Name Swiper Application
class BabyNameSwiper {
    constructor() {
        this.allNames = [];
        this.currentFilter = 'all';
        this.currentTheme = null;
        this.likedNames = [];
        this.currentNames = [];
        this.currentIndex = 0;
        this.currentView = 'splash';
        this.isReviewing = false;
        this.receivedSharedList = null;
        this.startedWithSharedLink = false;
        this.currentMatches = [];
        
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
        this.checkForSharedList();
        
        // If a shared list was received, apply the partner's theme and skip directly to swipe view with pre-selected gender
        if (this.receivedSharedList) {
            // Apply the partner's theme (with fallback to generic if theme not found)
            const themeId = this.receivedSharedList.theme || 'generic';
            if (typeof themes !== 'undefined' && themes[themeId]) {
                this.currentTheme = themes[themeId];
                this.allNames = [...this.currentTheme.names];
                this.applyTheme();
            } else {
                console.warn('Theme not found or themes not loaded:', themeId);
            }
            
            // Pre-select the partner's gender filter
            this.currentFilter = this.receivedSharedList.gender || 'all';
            
            // Skip welcome screen and go directly to swipe view
            this.startSwipe();
        } else {
            this.showSplash();
        }
    }
    
    // Encode liked names to shareable format
    encodeNames() {
        const data = {
            theme: this.currentTheme ? this.currentTheme.id : 'generic',
            gender: this.currentFilter,
            names: this.likedNames.map(n => ({ name: n.name, gender: n.gender }))
        };
        const jsonString = JSON.stringify(data);
        return btoa(encodeURIComponent(jsonString));
    }
    
    // Decode shared names from encoded format
    decodeNames(encoded) {
        try {
            const jsonString = decodeURIComponent(atob(encoded));
            const data = JSON.parse(jsonString);
            
            // Handle old format (array of names only) for backwards compatibility
            if (Array.isArray(data)) {
                return {
                    theme: 'generic',
                    gender: 'all',
                    names: data
                };
            }
            
            // New format with theme and gender
            return data;
        } catch (e) {
            console.error('Failed to decode names:', e);
            return null;
        }
    }
    
    // Check if URL contains shared list
    checkForSharedList() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedList = urlParams.get('list');
        if (sharedList) {
            this.receivedSharedList = this.decodeNames(sharedList);
            this.startedWithSharedLink = true;
        }
    }
    
    // Generate shareable URL
    generateShareURL() {
        const encoded = this.encodeNames();
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?list=${encoded}`;
    }
    
    setupEventListeners() {
        // Splash screen double-tap
        const splashView = document.getElementById('splashView');
        splashView.addEventListener('click', () => this.handleSplashTap());
        
        // Theme selection will be set up when rendering themes
        
        // Continue from theme selection button
        document.getElementById('continueFromThemeBtn').addEventListener('click', () => {
            this.showWelcome();
        });
        
        // Welcome screen choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.startSwipe();
            });
        });
        
        // Action buttons
        document.getElementById('passBtn').addEventListener('click', () => {
            this.swipeCard('left');
        });
        
        document.getElementById('likeBtn').addEventListener('click', () => {
            this.swipeCard('right');
        });
        
        // Done button
        document.getElementById('doneBtn').addEventListener('click', () => {
            this.showResults();
        });
        
        // Show results from empty state
        document.getElementById('showResultsBtn').addEventListener('click', () => {
            this.showResults();
        });
        
        // Results view buttons
        document.getElementById('reviewBtn').addEventListener('click', () => {
            this.reviewNames();
        });
        
        document.getElementById('shareLinkBtn').addEventListener('click', () => {
            this.shareLink();
        });
        
        document.getElementById('compareBtn').addEventListener('click', () => {
            this.showCompareInput();
        });
        
        document.getElementById('emailBtn').addEventListener('click', () => {
            this.shareEmail();
        });
        
        document.getElementById('textBtn').addEventListener('click', () => {
            this.shareText();
        });
        
        // Compare view buttons
        document.getElementById('revealFromLinkBtn').addEventListener('click', () => {
            this.compareWithLink();
        });
        
        document.getElementById('revealCompareBtn').addEventListener('click', () => {
            this.compareWithPartner();
        });
        
        document.getElementById('cancelCompareBtn').addEventListener('click', () => {
            this.showResults();
        });
        
        document.getElementById('backToResultsBtn').addEventListener('click', () => {
            this.showResults();
        });
        
        document.getElementById('shareMatchesBtn').addEventListener('click', () => {
            this.shareMatches();
        });
        
        // Partner link input - remove placeholder on focus, restore on blur if empty
        const partnerLinkInput = document.getElementById('partnerLinkInput');
        const originalPlaceholder = partnerLinkInput.getAttribute('placeholder');
        partnerLinkInput.addEventListener('focus', () => {
            partnerLinkInput.removeAttribute('placeholder');
        });
        partnerLinkInput.addEventListener('blur', () => {
            if (!partnerLinkInput.value.trim()) {
                partnerLinkInput.setAttribute('placeholder', originalPlaceholder);
            }
        });
    }
    
    showSplash() {
        this.currentView = 'splash';
        this.hideAllViews();
        const splashView = document.getElementById('splashView');
        splashView.style.display = 'block';
        splashView.style.opacity = '1';
        splashView.style.transition = '';
        
        // Auto-advance after 4 seconds
        setTimeout(() => {
            if (this.currentView === 'splash') {
                this.showThemeSelection();
            }
        }, 4000);
    }
    
    handleSplashTap() {
        // Single tap proceeds to theme selection with fade out
        const splashView = document.getElementById('splashView');
        splashView.style.transition = 'opacity 0.5s ease';
        splashView.style.opacity = '0';
        
        // Wait for fade transition to complete (matches 0.5s transition duration)
        setTimeout(() => {
            this.showThemeSelection();
        }, 500);
    }
    
    showThemeSelection() {
        this.currentView = 'theme';
        this.hideAllViews();
        document.getElementById('themeView').style.display = 'block';
        this.renderThemes();
    }
    
    renderThemes() {
        const themeGrid = document.getElementById('themeGrid');
        themeGrid.innerHTML = '';
        
        Object.values(themes).forEach(theme => {
            const themeOption = document.createElement('div');
            themeOption.className = 'theme-option';
            themeOption.dataset.themeId = theme.id;
            
            const nameParts = theme.name.split(' ');
            const icon = nameParts[0];
            const displayName = nameParts.slice(1).join(' ');
            
            themeOption.innerHTML = `
                <div class="theme-icon">${icon}</div>
                <div class="theme-name">${displayName}</div>
                <div class="theme-desc">${theme.description}</div>
            `;
            
            themeOption.addEventListener('click', () => {
                this.selectTheme(theme.id, themeOption);
            });
            
            themeGrid.appendChild(themeOption);
        });
    }
    
    selectTheme(themeId, themeElement) {
        // Remove selected class from all theme options
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        if (themeElement) {
            themeElement.classList.add('selected');
        }
        
        // Set the theme and apply it immediately
        this.currentTheme = themes[themeId];
        this.allNames = [...this.currentTheme.names];
        this.applyTheme();
        
        // Show the continue button
        document.getElementById('continueFromThemeBtn').style.display = 'block';
    }
    
    applyTheme() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.currentTheme.colors.primary);
        root.style.setProperty('--secondary-color', this.currentTheme.colors.secondary);
        root.style.setProperty('--card-name-color', this.currentTheme.colors.cardName);
        root.style.setProperty('--boy-bg-color', this.currentTheme.colors.boyBg);
        root.style.setProperty('--boy-text-color', this.currentTheme.colors.boyText);
        root.style.setProperty('--girl-bg-color', this.currentTheme.colors.girlBg);
        root.style.setProperty('--girl-text-color', this.currentTheme.colors.girlText);
        
        // Force browser to recalculate gradient by setting it directly
        // This fixes cache busting issues where CSS variable changes don't update gradients
        // Gradient definition matches styles.css body background (135deg, 0%, 100%)
        document.body.style.background = `linear-gradient(135deg, ${this.currentTheme.colors.primary} 0%, ${this.currentTheme.colors.secondary} 100%)`;
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', this.currentTheme.colors.primary);
        }
    }
    
    // Helper method to convert gender filter to display text
    getGenderDisplayText(filter) {
        switch (filter) {
            case 'boy':
                return 'Boy Names';
            case 'girl':
                return 'Girl Names';
            case 'all':
            default:
                return 'All Names';
        }
    }
    
    showWelcome() {
        this.currentView = 'welcome';
        this.hideAllViews();
        document.getElementById('welcomeView').style.display = 'block';
        this.updateGenderIcons();
        
        // Update welcome text if a shared list was received
        if (this.receivedSharedList) {
            const welcomeText = document.querySelector('.welcome-text');
            if (welcomeText) {
                const themeName = this.currentTheme ? this.currentTheme.name : '✨ Classic';
                const genderText = this.getGenderDisplayText(this.currentFilter);
                welcomeText.innerHTML = `🎉 Your partner shared their baby name picks!<br><br>` +
                                       `<strong>Theme:</strong> ${themeName}<br>` +
                                       `<strong>Category:</strong> ${genderText}<br><br>` +
                                       `Now swipe through and pick your favorites. We'll compare them together at the end!`;
                welcomeText.style.fontWeight = 'normal';
                welcomeText.style.color = this.currentTheme ? this.currentTheme.colors.primary : '#667eea';
            }
        }
    }
    
    startSwipe() {
        this.isReviewing = false;
        this.filterNames(this.currentFilter);
        this.shuffleNames();
        this.currentIndex = 0;
        this.showSwipe();
    }
    
    showSwipe() {
        this.currentView = 'swipe';
        this.hideAllViews();
        document.getElementById('swipeView').style.display = 'block';
        this.updateSwipeIcons();
        this.renderCards();
        this.updateStats();
        this.hideEmptyState();
    }
    
    updateSwipeIcons() {
        if (!this.currentTheme) return;
        
        // Update swipe indicators
        const leftIndicator = document.querySelector('.swipe-indicator.left span');
        const rightIndicator = document.querySelector('.swipe-indicator.right span');
        if (leftIndicator) leftIndicator.textContent = `${this.currentTheme.icons.pass} PASS`;
        if (rightIndicator) rightIndicator.textContent = `${this.currentTheme.icons.like} LIKE`;
        
        // Update action buttons
        const passBtn = document.querySelector('#passBtn span');
        const likeBtn = document.querySelector('#likeBtn span');
        if (passBtn) passBtn.textContent = this.currentTheme.icons.pass;
        if (likeBtn) likeBtn.textContent = this.currentTheme.icons.like;
    }
    
    showResults() {
        this.currentView = 'results';
        this.hideAllViews();
        document.getElementById('resultsView').style.display = 'block';
        this.renderResults();
    }
    
    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });
    }
    
    renderResults() {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        
        if (this.likedNames.length === 0) {
            return; // CSS ::before will show "No names selected" message
        }
        
        this.likedNames.forEach(nameData => {
            const nameItem = document.createElement('div');
            nameItem.className = 'name-item';
            nameItem.textContent = nameData.name;
            resultsList.appendChild(nameItem);
        });
    }
    
    reviewNames() {
        if (this.likedNames.length === 0) {
            // No liked names, so restart with original filtered list
            this.startSwipe();
            return;
        }
        
        this.isReviewing = true;
        this.currentNames = [...this.likedNames];
        this.currentIndex = 0;
        this.showSwipe();
    }
    
    shareLink() {
        if (this.likedNames.length === 0) {
            alert('No names selected yet! Go back and swipe to pick some names first.');
            return;
        }
        
        const shareURL = this.generateShareURL();
        
        // Try to use the native share API if available (mobile)
        if (navigator.share) {
            navigator.share({
                title: 'My Baby Name Picks',
                url: shareURL
            }).catch(() => {
                // If share fails, fall back to clipboard
                this.copyToClipboard(shareURL);
            });
        } else {
            // Fall back to clipboard copy
            this.copyToClipboard(shareURL);
        }
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Link copied to clipboard! Share it with your partner.');
            }).catch(() => {
                this.showLinkInAlert(text);
            });
        } else {
            this.showLinkInAlert(text);
        }
    }
    
    showLinkInAlert(link) {
        prompt('Copy this link to share:', link);
    }
    
    shareEmail() {
        if (this.likedNames.length === 0) {
            alert('No names selected yet! Go back and swipe to pick some names first.');
            return;
        }
        
        const shareURL = this.generateShareURL();
        const subject = encodeURIComponent('Compare Our Baby Names!');
        const body = encodeURIComponent(`Let's compare our baby name choices!\n\n${shareURL}\n\n(Don't worry - you won't see my choices until we both reveal!)`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
    
    shareText() {
        if (this.likedNames.length === 0) {
            alert('No names selected yet! Go back and swipe to pick some names first.');
            return;
        }
        
        const shareURL = this.generateShareURL();
        const message = encodeURIComponent(`Let's compare our baby name choices!\n\n${shareURL}`);
        window.location.href = `sms:?body=${message}`;
    }
    
    shareMatches() {
        if (this.currentMatches.length === 0) {
            alert('No matches to share! You need to have matching names with your partner first.');
            return;
        }
        
        // Create a shareable message with the matched names
        const matchCount = this.currentMatches.length;
        const matchText = this.currentMatches.map(nameData => `• ${nameData.name} (${nameData.gender})`).join('\n');
        const subject = `We have ${matchCount} matching baby ${matchCount === 1 ? 'name' : 'names'}! 🎉`;
        const body = matchText;
        
        // Try to use the native share API if available (mobile)
        if (navigator.share) {
            navigator.share({
                title: subject,
                text: `${subject}\n\n${body}`
            }).catch((error) => {
                // If native share fails or is cancelled, fall back to other methods
                if (error.name !== 'AbortError') {
                    this.shareMatchesAlternative(subject, body);
                }
            });
        } else {
            // Desktop - show options
            this.shareMatchesAlternative(subject, body);
        }
    }
    
    shareMatchesAlternative(subject, body) {
        // Create a simple dialog with options
        const options = [
            '1 - Copy to Clipboard',
            '2 - Share via Email',
            '3 - Share via Text',
            'Cancel'
        ].join('\n');
        
        const choice = prompt(`How would you like to share your matches?\n\n${options}\n\nEnter your choice (1-3):`);
        
        if (choice === '1') {
            // Copy to clipboard
            const fullText = `${subject}\n\n${body}`;
            this.copyToClipboard(fullText);
        } else if (choice === '2') {
            // Share via email
            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(body);
            window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
        } else if (choice === '3') {
            // Share via text
            const message = encodeURIComponent(`${subject}\n\n${body}`);
            window.location.href = `sms:?body=${message}`;
        }
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
                } else {
                    // Top card needs highest z-index to ensure it's always on top
                    card.style.zIndex = cardsToRender;
                }
            }
        }
    }
    
    createCard(nameData, isTopCard) {
        const card = document.createElement('div');
        card.className = 'card' + (isTopCard ? ' top-card' : '');
        
        const boyIcon = this.currentTheme ? this.currentTheme.icons.boy : '👦';
        const girlIcon = this.currentTheme ? this.currentTheme.icons.girl : '👧';
        
        card.innerHTML = `
            <div class="name">${nameData.name}</div>
            <div class="gender ${nameData.gender}">${nameData.gender === 'boy' ? `${boyIcon} Boy` : `${girlIcon} Girl`}</div>
        `;
        
        if (isTopCard) {
            this.addSwipeListeners(card);
        }
        
        return card;
    }
    
    updateGenderIcons() {
        if (!this.currentTheme) return;
        
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(btn => {
            const filter = btn.dataset.filter;
            if (filter === 'boy') {
                btn.innerHTML = `${this.currentTheme.icons.boy} Boy Names`;
            } else if (filter === 'girl') {
                btn.innerHTML = `${this.currentTheme.icons.girl} Girl Names`;
            }
        });
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
        
        // Reveal backend cards when dragging starts
        const allCards = this.cardStack.querySelectorAll('.card:not(.top-card)');
        allCards.forEach(backCard => backCard.classList.add('revealed'));
        
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
        
        // Highlight action buttons based on swipe direction
        const passBtn = document.getElementById('passBtn');
        const likeBtn = document.getElementById('likeBtn');
        
        if (this.currentX < -50) {
            passBtn.classList.add('highlight');
            likeBtn.classList.remove('highlight');
        } else if (this.currentX > 50) {
            likeBtn.classList.add('highlight');
            passBtn.classList.remove('highlight');
        } else {
            passBtn.classList.remove('highlight');
            likeBtn.classList.remove('highlight');
        }
        
        if (e.type.includes('touch')) {
            e.preventDefault();
        }
    }
    
    handleDragEnd(e, card) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        card.classList.remove('dragging');
        
        // Remove highlight from action buttons
        const passBtn = document.getElementById('passBtn');
        const likeBtn = document.getElementById('likeBtn');
        passBtn.classList.remove('highlight');
        likeBtn.classList.remove('highlight');
        
        const threshold = 100;
        
        if (Math.abs(this.currentX) > threshold) {
            // Swipe detected - keep backend cards revealed during animation
            const direction = this.currentX > 0 ? 'right' : 'left';
            this.animateSwipe(card, direction);
        } else {
            // Return to center - hide backend cards
            card.style.transform = '';
            const allCards = this.cardStack.querySelectorAll('.card:not(.top-card)');
            allCards.forEach(backCard => backCard.classList.remove('revealed'));
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
        
        // Highlight the corresponding button briefly
        const btn = direction === 'right' ? document.getElementById('likeBtn') : document.getElementById('passBtn');
        btn.classList.add('highlight');
        
        setTimeout(() => {
            btn.classList.remove('highlight');
            
            if (direction === 'right') {
                // Prevent duplicates by checking if name already exists in likedNames
                const currentName = this.currentNames[this.currentIndex];
                const alreadyLiked = this.likedNames.some(n => n.name === currentName.name && n.gender === currentName.gender);
                if (!alreadyLiked) {
                    this.likedNames.push(currentName);
                }
            }
            
            this.currentIndex++;
            this.updateStats();
            
            if (this.currentIndex >= this.currentNames.length) {
                if (this.isReviewing) {
                    // After reviewing, go back to results
                    this.showResults();
                } else if (this.startedWithSharedLink && this.receivedSharedList) {
                    // Auto-compare when completing after starting with a shared link
                    this.autoCompareAfterCompletion();
                } else {
                    this.showEmptyState();
                }
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
    
    autoCompareAfterCompletion() {
        // Hide the card container and show a splash message
        this.cardStack.style.display = 'none';
        this.emptyState.style.display = 'none';
        
        // Create a temporary splash overlay
        const splashOverlay = document.createElement('div');
        splashOverlay.className = 'completion-splash-overlay';
        splashOverlay.innerHTML = `
            <div class="completion-splash-content">
                <h2>✨ Your choices are complete!</h2>
                <p>Ready to compare with your partner?</p>
                <div class="completion-spinner">🎉</div>
            </div>
        `;
        document.querySelector('.container').appendChild(splashOverlay);
        
        // After 2 seconds, proceed to comparison
        setTimeout(() => {
            splashOverlay.remove();
            this.compareWithLink();
        }, 2000);
    }
    
    hideEmptyState() {
        this.cardStack.style.display = 'block';
        this.emptyState.style.display = 'none';
    }
    
    showCompareInput() {
        this.currentView = 'compareInput';
        this.hideAllViews();
        document.getElementById('compareInputView').style.display = 'block';
        
        // Clear previous input
        document.getElementById('partnerListInput').value = '';
        document.getElementById('partnerLinkInput').value = '';
        
        // If we received a shared list from URL, auto-populate and show option to compare
        if (this.receivedSharedList) {
            document.getElementById('partnerLinkInput').value = 'Received shared list from link!';
            document.getElementById('revealFromLinkBtn').textContent = '🎉 Compare Now!';
        }
    }
    
    compareWithLink() {
        let partnerData;
        
        // Check if we have a shared list from URL
        if (this.receivedSharedList) {
            partnerData = this.receivedSharedList;
        } else {
            // Parse the link input
            const linkInput = document.getElementById('partnerLinkInput').value.trim();
            
            if (!linkInput) {
                alert('Please paste your partner\'s share link!');
                return;
            }
            
            // Extract the encoded list from the URL
            try {
                const url = new URL(linkInput);
                const listParam = url.searchParams.get('list');
                
                if (!listParam) {
                    alert('Invalid link! Make sure you copied the complete share link.');
                    return;
                }
                
                partnerData = this.decodeNames(listParam);
                
                if (!partnerData) {
                    alert('Could not decode the link. Please check that you copied it correctly.');
                    return;
                }
            } catch (e) {
                alert('Invalid link format! Please paste the complete share link.');
                return;
            }
        }
        
        // Extract partner names from the data structure
        // New format: { theme, gender, names: [...] }
        // Old format (backwards compatibility): [...] array of names directly
        const partnerNames = partnerData.names || partnerData;
        
        // Find matches
        const myNamesLower = this.likedNames.map(n => n.name.toLowerCase());
        const matches = this.likedNames.filter(nameData => 
            partnerNames.some(pn => pn.name.toLowerCase() === nameData.name.toLowerCase())
        );
        
        // Clear received shared list after use
        this.receivedSharedList = null;
        
        // Show comparison results with countdown
        this.showCompareResults(matches);
    }
    
    compareWithPartner() {
        const partnerInput = document.getElementById('partnerListInput').value;
        
        if (!partnerInput.trim()) {
            alert('Please enter your partner\'s list of names!');
            return;
        }
        
        // Parse partner's list
        const partnerNames = partnerInput
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => name.toLowerCase());
        
        // Find matches (case-insensitive)
        const myNames = this.likedNames.map(n => n.name.toLowerCase());
        const matches = this.likedNames.filter(nameData => 
            partnerNames.includes(nameData.name.toLowerCase())
        );
        
        // Show comparison results with countdown
        this.showCompareResults(matches);
    }
    
    showCompareResults(matches) {
        this.currentMatches = matches; // Store matches for sharing
        this.currentView = 'compareResults';
        this.hideAllViews();
        document.getElementById('compareResultsView').style.display = 'block';
        
        // Show countdown overlay
        const countdownOverlay = document.getElementById('countdownOverlay');
        const countdownNumber = document.getElementById('countdownNumber');
        const finalResults = document.getElementById('compareFinalResults');
        
        countdownOverlay.style.display = 'flex';
        finalResults.style.display = 'none';
        
        // Countdown animation
        let count = 3;
        countdownNumber.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
            } else if (count === 0) {
                countdownNumber.textContent = '🎉';
            } else {
                clearInterval(countdownInterval);
                // Hide countdown and show results
                countdownOverlay.style.display = 'none';
                finalResults.style.display = 'flex';
                this.renderCompareResults(matches);
            }
        }, 1000);
    }
    
    renderCompareResults(matches) {
        const matchCount = document.getElementById('matchCount');
        const matchesList = document.getElementById('matchesList');
        const noMatches = document.getElementById('noMatches');
        
        if (matches.length === 0) {
            matchCount.style.display = 'none';
            matchesList.style.display = 'none';
            noMatches.style.display = 'block';
        } else {
            matchCount.style.display = 'block';
            matchesList.style.display = 'block';
            noMatches.style.display = 'none';
            
            matchCount.textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}! 🎉`;
            
            matchesList.innerHTML = '';
            matches.forEach((nameData, index) => {
                const matchItem = document.createElement('div');
                matchItem.className = 'match-item';
                matchItem.innerHTML = `
                    <span class="match-number">${index + 1}</span>
                    <span class="match-name">${nameData.name}</span>
                    <span class="match-gender ${nameData.gender}">${nameData.gender === 'boy' ? '👦' : '👧'}</span>
                `;
                matchesList.appendChild(matchItem);
                
                // Add animation delay for staggered appearance
                setTimeout(() => {
                    matchItem.style.opacity = '1';
                    matchItem.style.transform = 'scale(1)';
                }, index * 150);
            });
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BabyNameSwiper();
});
