class HoursTracker {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.data = this.loadData();
        this.notes = this.loadNotes();
        this.theme = localStorage.getItem('theme') || 'light';
        this.currentView = 'calendar';
        this.deferredPrompt = null; // Ajout pour PWA
        this.init();
    }

    init() {
        this.applyTheme();
        this.renderCalendar();
        this.updateStats();
        this.bindEvents();
        this.updateMonthDisplay();
        this.switchView(this.currentView);
        this.setupPWA();
        this.setupResetButton();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Show/hide sections
        const calendarSection = document.querySelector('.calendar-container');
        const statsSection = document.querySelector('.stats');
        const exportSection = document.querySelector('.export-section') || this.createExportSection();

        calendarSection.style.display = view === 'calendar' ? 'block' : 'none';
        statsSection.style.display = view === 'stats' ? 'block' : 'none';
        exportSection.style.display = view === 'export' ? 'block' : 'none';

        // Mettre à jour les statistiques si on affiche la section stats
        if (view === 'stats') {
            this.updateDetailedStats();
        }
    }

    createExportSection() {
        const section = document.createElement('div');
        section.className = 'export-section';
        section.innerHTML = `
            <h2>Export des données</h2>
            <div class="export-options">
                <button id="exportJSON" class="export-btn">📥 Exporter en JSON</button>
                <button id="exportCSV" class="export-btn">📊 Exporter en CSV</button>
            </div>
        `;

        // Add export functionality
        section.querySelector('#exportJSON').addEventListener('click', () => this.exportData('json'));
        section.querySelector('#exportCSV').addEventListener('click', () => this.exportData('csv'));

        document.querySelector('main').appendChild(section);
        return section;
    }

    exportData(format) {
        const data = {
            hours: this.data,
            notes: this.notes
        };

        let content, filename, type;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = 'heures-travail.json';
            type = 'application/json';
        } else {
            // CSV format
            const lines = ['Date,Heures,Note'];
            Object.keys(this.data).sort().forEach(date => {
                const hours = this.data[date];
                const note = this.notes[date] || '';
                lines.push(`${date},${hours},"${note.replace(/"/g, '""')}"`);
            });
            content = lines.join('\n');
            filename = 'heures-travail.csv';
            type = 'text/csv';
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Gestion améliorée des événements de la modale
        const modal = document.getElementById('modal');
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');

        // Empêcher la fermeture lors du clic sur le contenu de la modale
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Validation du champ des heures
        hoursInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(',', '.');
            value = value.replace(/[^0-9.]/g, '');
            
            // Empêcher plusieurs points
            const points = value.match(/\./g);
            if (points && points.length > 1) {
                value = value.substring(0, value.lastIndexOf('.'));
            }
            
            e.target.value = value;
        });

        hoursInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveHours();
            }
        });

        // Gérer Tab entre les champs
        hoursInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                noteInput.focus();
            }
        });

        noteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                hoursInput.focus();
            }
        });

        // Sélection automatique du contenu au focus
        hoursInput.addEventListener('focus', function() {
            this.select();
        });

        // Navigation mois
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateStats();
            this.updateMonthDisplay();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateStats();
            this.updateMonthDisplay();
        });

        // Modal events
        document.getElementById('saveHours').addEventListener('click', () => this.saveHours());
        document.getElementById('deleteHours').addEventListener('click', () => this.deleteHours());
        document.getElementById('cancelModal').addEventListener('click', () => this.closeModal());

        // Boutons rapides
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('hoursInput').value = btn.dataset.hours;
                this.animateButton(btn);
            });
        });

        // Fermer modal en cliquant à côté
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.closeModal();
        });

        // Gestion des touches clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('modal').style.display === 'block') {
                this.closeModal();
            }
        });
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Premier jour du mois
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Commencer par lundi (1) au lieu de dimanche (0)
        const startDate = new Date(firstDay);
        const dayOfWeek = (firstDay.getDay() + 6) % 7; // Convertir pour commencer lundi
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // Générer 42 jours (6 semaines)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date, month);
            calendar.appendChild(dayElement);
        }

        // Animation d'apparition du calendrier
        this.animateCalendar();
    }

    createDayElement(date, currentMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dateKey = this.getDateKey(date);
        const hours = this.data[dateKey] || 0;
        const today = new Date();
        
        // Vérifier si c'est le mois actuel
        if (date.getMonth() !== currentMonth) {
            dayDiv.classList.add('other-month');
        }
        
        // Vérifier si c'est aujourd'hui
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }
        
        // Vérifier si c'est un weekend
        if (date.getDay() === 0 || date.getDay() === 6) {
            dayDiv.classList.add('weekend');
        }
        
        if (hours > 0) {
            dayDiv.classList.add('has-hours');
        }

        dayDiv.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            ${hours > 0 ? `<div class="day-hours">${this.formatHours(hours)}h</div>` : ''}
        `;

        // Ne permettre de cliquer que sur les jours du mois actuel
        if (date.getMonth() === currentMonth) {
            dayDiv.addEventListener('click', () => this.openModal(date));
            dayDiv.style.cursor = 'pointer';
        } else {
            dayDiv.style.cursor = 'default';
        }
        
        return dayDiv;
    }

    openModal(date) {
        this.selectedDate = date;
        const dateKey = this.getDateKey(date);
        const currentHours = this.data[dateKey] || '';
        const currentNote = this.notes[dateKey] || '';
        
        const modal = document.getElementById('modal');
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        
        // Préparer les champs avant l'affichage
        document.getElementById('selectedDate').textContent = this.formatDate(date);
        hoursInput.value = currentHours;
        noteInput.value = currentNote;
        
        // Réinitialiser les styles et afficher la modale
        modal.style.display = 'flex';
        
        // Animation d'ouverture
        requestAnimationFrame(() => {
            modal.classList.add('active');
            
            // Focus sur l'input avec délai pour l'animation
            setTimeout(() => {
                hoursInput.focus();
                hoursInput.select();
            }, 150);
        });
    }

    closeModal() {
        const modal = document.getElementById('modal');
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            this.selectedDate = null;
            
            // Réinitialiser les champs
            hoursInput.value = '';
            noteInput.value = '';
        }, 300);
    }

    saveHours() {
        if (!this.selectedDate) return;
        
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        const inputValue = hoursInput.value.trim().replace(',', '.');
        const noteValue = noteInput.value.trim();
        const dateKey = this.getDateKey(this.selectedDate);
        
        // Validation des heures
        if (inputValue === '') {
            this.showNotification('⚠️ Veuillez entrer un nombre d\'heures', 'warning');
            hoursInput.focus();
            return;
        }
        
        const hours = parseFloat(inputValue);
        if (isNaN(hours)) {
            this.showNotification('⚠️ Valeur invalide', 'warning');
            hoursInput.focus();
            return;
        }
        
        if (hours > 24) {
            this.showNotification('⚠️ Maximum 24h par jour !', 'warning');
            hoursInput.focus();
            return;
        }
        
        if (hours < 0) {
            this.showNotification('⚠️ Les heures ne peuvent pas être négatives', 'warning');
            hoursInput.focus();
            return;
        }
        
        // Sauvegarder les heures et la note
        if (hours > 0) {
            this.data[dateKey] = hours;
            if (noteValue) {
                this.notes[dateKey] = noteValue;
            } else {
                delete this.notes[dateKey];
            }
            this.showNotification('✅ Heures sauvegardées !', 'success');
        } else {
            delete this.data[dateKey];
            delete this.notes[dateKey];
            this.showNotification('🗑️ Heures supprimées !', 'info');
        }
        
        // Sauvegarder et mettre à jour l'interface
        this.saveData();
        this.saveNotes();
        this.renderCalendar();
        this.updateStats();
        this.closeModal();
    }

    deleteHours() {
        if (!this.selectedDate) return;
        
        const dateKey = this.getDateKey(this.selectedDate);
        
        if (this.data[dateKey] || this.notes[dateKey]) {
            delete this.data[dateKey];
            delete this.notes[dateKey];
            this.saveData();
            this.saveNotes();
            this.renderCalendar();
            this.updateStats();
            this.showNotification('🗑️ Heures supprimées !', 'info');
        }
        
        this.closeModal();
    }

    updateStats() {
        const stats = this.getMonthlyStats();
        
        // Animation des chiffres
        this.animateNumber('monthTotal', stats.totalHours);
        this.animateNumber('workDays', stats.workDays);
        this.animateNumber('avgHours', stats.avgHours);
        
        // Mettre à jour les éléments
        document.getElementById('monthTotal').textContent = this.formatHours(stats.totalHours);
        document.getElementById('workDays').textContent = stats.workDays;
        document.getElementById('avgHours').textContent = this.formatHours(stats.avgHours);
    }

    updateDetailedStats() {
        const stats = this.getMonthlyStats();
        const statsSection = document.querySelector('.stats');
        
        // Mettre à jour ou créer la grille de statistiques détaillées
        statsSection.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value" id="workDays">${stats.workDays}</span>
                    <span class="stat-label">Jours travaillés</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="avgHours">${this.formatHours(stats.avgHours)}</span>
                    <span class="stat-label">Moyenne/jour</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.maxHours)}</span>
                    <span class="stat-label">Maximum/jour</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.minHours)}</span>
                    <span class="stat-label">Minimum/jour</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.weekdayHours)}</span>
                    <span class="stat-label">Heures semaine</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.weekendHours)}</span>
                    <span class="stat-label">Heures weekend</span>
                </div>
            </div>
        `;
    }

    updateMonthDisplay() {
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        
        const monthYear = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthYear;
    }

    setupPWA() {
        // Créer le bouton d'installation
        const installButton = document.createElement('button');
        installButton.id = 'installPWA';
        installButton.className = 'install-button';
        installButton.innerHTML = '📱 Installer l\'application';
        installButton.style.display = 'none';
        
        // Vérifier si l'élément header existe avant d'ajouter le bouton
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(installButton);
        }

        // Gérer l'événement d'installation
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            installButton.style.display = 'block';
        });

        installButton.addEventListener('click', async () => {
            if (!this.deferredPrompt) return;
            
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                this.showNotification('🎉 Application installée !', 'success');
                installButton.style.display = 'none';
            }
            
            this.deferredPrompt = null;
        });

        window.addEventListener('appinstalled', () => {
            this.showNotification('🎉 Application installée avec succès !', 'success');
            installButton.style.display = 'none';
            this.deferredPrompt = null;
        });
    }

    setupResetButton() {
        // Créer le bouton de réinitialisation
        const resetButton = document.createElement('button');
        resetButton.id = 'resetApp';
        resetButton.className = 'reset-button';
        resetButton.innerHTML = '🗑️ Réinitialiser l\'application';
        
        // Vérifier si l'élément bottom-nav existe avant d'ajouter le bouton
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.appendChild(resetButton);
        }

        resetButton.addEventListener('click', () => {
            if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser l\'application ?\nToutes les données seront effacées définitivement.')) {
                if (confirm('⚠️ Dernière confirmation : cette action est irréversible.\nVoulez-vous vraiment effacer toutes les données ?')) {
                    // Effacer toutes les données
                    localStorage.clear();
                    this.data = {};
                    this.notes = {};
                    this.theme = 'light';
                    
                    // Réinitialiser l'interface
                    this.applyTheme();
                    this.renderCalendar();
                    this.updateStats();
                    this.showNotification('🗑️ Application réinitialisée !', 'info');
                    
                    // Recharger la page après un court délai
                    setTimeout(() => location.reload(), 1500);
                }
            }
        });
    }

    // Fonctions utilitaires
    getDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    formatDate(date) {
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    }

    formatHours(hours) {
        if (hours === 0) return '0';
        
        // Gérer les décimales de façon intelligente
        if (hours % 1 === 0) {
            return hours.toString();
        } else if (hours % 0.25 === 0) {
            // Afficher .25, .5, .75 de façon claire
            const decimal = hours % 1;
            if (decimal === 0.25) return Math.floor(hours) + '.25';
            if (decimal === 0.5) return Math.floor(hours) + '.5';
            if (decimal === 0.75) return Math.floor(hours) + '.75';
        }
        
        return hours.toFixed(2).replace(/\.?0+$/, '');
    }

    // Fonctions d'animation
    animateCalendar() {
        const days = document.querySelectorAll('.calendar-day');
        days.forEach((day, index) => {
            day.style.opacity = '0';
            day.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                day.style.transition = 'all 0.3s ease';
                day.style.opacity = '1';
                day.style.transform = 'translateY(0)';
            }, index * 20);
        });
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseFloat(element.textContent) || 0;
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || 
                (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(timer);
            }
            
            if (elementId === 'avgHours' || elementId === 'monthTotal') {
                element.textContent = this.formatHours(current);
            } else {
                element.textContent = Math.round(current);
            }
        }, 50);
    }

    // Système de notifications
    showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles inline pour la notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            borderRadius: '25px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            zIndex: '9999',
            opacity: '0',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        // Couleurs selon le type
        const colors = {
            success: '#4ecdc4',
            warning: '#ffe066',
            info: '#667eea',
            error: '#ff6b6b'
        };
        
        notification.style.background = colors[type] || colors.info;
        if (type === 'warning') notification.style.color = '#333';

        document.body.appendChild(notification);

        // Animation d'apparition
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Suppression automatique
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Fonctions de données
    loadData() {
        const saved = localStorage.getItem('hoursData');
        return saved ? JSON.parse(saved) : {};
    }

    loadNotes() {
        const saved = localStorage.getItem('dayNotes');
        return saved ? JSON.parse(saved) : {};
    }

    saveData() {
        localStorage.setItem('hoursData', JSON.stringify(this.data));
    }

    saveNotes() {
        localStorage.setItem('dayNotes', JSON.stringify(this.notes));
    }

    // Fonctions de statistiques avancées
    getMonthlyStats() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let stats = {
            totalHours: 0,
            workDays: 0,
            avgHours: 0,
            maxHours: 0,
            minHours: 24,
            weekendHours: 0,
            weekdayHours: 0
        };
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = this.getDateKey(date);
            const hours = this.data[dateKey] || 0;
            
            if (hours > 0) {
                stats.totalHours += hours;
                stats.workDays++;
                stats.maxHours = Math.max(stats.maxHours, hours);
                stats.minHours = Math.min(stats.minHours, hours);
                
                if (date.getDay() === 0 || date.getDay() === 6) {
                    stats.weekendHours += hours;
                } else {
                    stats.weekdayHours += hours;
                }
            }
        }
        
        stats.avgHours = stats.workDays > 0 ? stats.totalHours / stats.workDays : 0;
        if (stats.workDays === 0) stats.minHours = 0;
        
        return stats;
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    const app = new HoursTracker();
    
    // Exposer l'app globalement pour le debug
    window.hoursApp = app;
    
    console.log('📱 Suivi Heures Pro initialisé !');
});

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ Service Worker enregistré');
            })
            .catch(error => {
                console.log('❌ Échec Service Worker:', error);
            });
    });
}
