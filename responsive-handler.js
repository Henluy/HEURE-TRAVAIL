/**
 * Gestionnaire de responsivité dynamique pour l'application HoursTracker
 * Optimise l'affichage du calendrier selon la taille de l'écran
 */

class ResponsiveHandler {
    constructor() {
        this.isInitialized = false;
        this.resizeTimeout = null;
        this.lastWidth = window.innerWidth;
        this.lastHeight = window.innerHeight;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupResponsive());
        } else {
            this.setupResponsive();
        }
        
        this.isInitialized = true;
    }

    setupResponsive() {
        // Configuration initiale
        this.updateViewportUnits();
        this.optimizeCalendarLayout();
        this.handleOrientationChange();
        
        // Écouteurs d'événements
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        
        // Support pour les navigateurs mobiles
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', this.handleViewportResize.bind(this));
        }
        
        console.log('ResponsiveHandler initialisé');
    }

    handleResize() {
        // Debounce pour éviter trop d'appels
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            // Ne traiter que si la taille a vraiment changé
            if (Math.abs(currentWidth - this.lastWidth) > 10 || 
                Math.abs(currentHeight - this.lastHeight) > 10) {
                
                this.updateViewportUnits();
                this.optimizeCalendarLayout();
                this.adjustModalPosition();
                
                this.lastWidth = currentWidth;
                this.lastHeight = currentHeight;
            }
        }, 150);
    }

    handleViewportResize() {
        // Gestion spécifique pour les changements de viewport mobile
        this.updateViewportUnits();
        this.adjustModalPosition();
    }

    handleOrientationChange() {
        // Délai pour laisser le temps au navigateur de s'adapter
        setTimeout(() => {
            this.updateViewportUnits();
            this.optimizeCalendarLayout();
            this.adjustModalPosition();
        }, 300);
    }

    updateViewportUnits() {
        // Mise à jour des unités de viewport pour les navigateurs mobiles
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;
        
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
        
        // Support pour dvh (dynamic viewport height)
        if (window.visualViewport) {
            const dvh = window.visualViewport.height * 0.01;
            document.documentElement.style.setProperty('--dvh', `${dvh}px`);
        }
    }

    optimizeCalendarLayout() {
        const calendar = document.getElementById('calendar');
        const calendarContainer = document.querySelector('.calendar-container');
        
        if (!calendar || !calendarContainer) return;
        
        const containerWidth = calendarContainer.offsetWidth;
        const containerHeight = calendarContainer.offsetHeight;
        const padding = parseInt(getComputedStyle(calendarContainer).padding) * 2;
        
        // Calculer la taille optimale des cases du calendrier
        const availableWidth = containerWidth - padding;
        const availableHeight = containerHeight - 100; // Espace pour les en-têtes et stats
        
        const optimalDaySize = Math.min(
            (availableWidth - (6 * 8)) / 7, // 6 gaps de 8px
            (availableHeight - (5 * 8)) / 6  // 5 gaps de 8px pour 6 rangées
        );
        
        // Appliquer la taille optimale
        if (optimalDaySize > 30 && optimalDaySize < 80) {
            document.documentElement.style.setProperty('--optimal-day-size', `${optimalDaySize}px`);
            
            // Ajuster la taille des polices en conséquence
            const fontSize = Math.max(10, Math.min(16, optimalDaySize * 0.25));
            const hoursSize = Math.max(8, Math.min(12, optimalDaySize * 0.18));
            
            document.documentElement.style.setProperty('--day-font-size', `${fontSize}px`);
            document.documentElement.style.setProperty('--hours-font-size', `${hoursSize}px`);
        }
    }

    adjustModalPosition() {
        const modal = document.getElementById('modal');
        if (!modal || !modal.classList.contains('active')) return;
        
        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;
        
        // Ajuster la position de la modal selon la hauteur disponible
        const viewportHeight = window.innerHeight;
        const modalHeight = modalContent.offsetHeight;
        
        if (viewportHeight < 600 || modalHeight > viewportHeight * 0.8) {
            modal.style.alignItems = 'flex-start';
            modal.style.paddingTop = '10px';
            modalContent.style.maxHeight = `${viewportHeight - 20}px`;
        } else {
            modal.style.alignItems = 'center';
            modal.style.paddingTop = '';
            modalContent.style.maxHeight = '80vh';
        }
    }

    // Méthode pour forcer une mise à jour
    forceUpdate() {
        this.updateViewportUnits();
        this.optimizeCalendarLayout();
        this.adjustModalPosition();
    }

    // Méthode pour obtenir des informations sur l'écran
    getScreenInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            isSmall: window.innerWidth < 480,
            isVerySmall: window.innerWidth < 360,
            isShort: window.innerHeight < 600,
            isVeryShort: window.innerHeight < 500
        };
    }

    // Méthode pour détecter si on est sur mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }

    // Méthode pour optimiser les performances sur mobile
    optimizeForMobile() {
        if (!this.isMobile()) return;
        
        // Désactiver les animations coûteuses sur les très petits écrans
        if (window.innerWidth < 360) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
        
        // Réduire la complexité visuelle
        const calendar = document.getElementById('calendar');
        if (calendar && window.innerWidth < 320) {
            calendar.classList.add('minimal-mode');
        }
    }
}

// Initialisation automatique
if (typeof window !== 'undefined') {
    window.responsiveHandler = new ResponsiveHandler();
}

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveHandler;
}