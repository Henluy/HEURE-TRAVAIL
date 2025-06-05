class HoursTracker {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.data = this.loadData();
        this.notes = this.loadNotes();
        this.theme = localStorage.getItem('theme') || 'light';
        this.currentView = 'calendar';
        this.deferredPrompt = null; // Ajout pour PWA
        this.currentLanguage = localStorage.getItem('language') || 'fr';
        this.translations = this.initTranslations();
        this.init();
    }

    // Système d'internationalisation
    initTranslations() {
        return {
            fr: {
                // Interface principale
                appTitle: 'Suivi Heures Pro',
                monthTotal: 'Total du mois',
                calendar: 'Calendrier',
                statistics: 'Statistiques',
                export: 'Export',
                
                // Jours de la semaine
                days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                daysLong: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
                
                // Mois
                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                
                // Modal
                hoursFor: 'Heures du',
                hoursPlaceholder: 'Ex: 7.5',
                notePlaceholder: 'Note du jour (optionnel)',
                save: 'Sauver',
                delete: 'Supprimer',
                cancel: 'Annuler',
                
                // Statistiques
                workDays: 'Jours travaillés',
                avgPerDay: 'Moyenne/jour',
                maxPerDay: 'Maximum/jour',
                minPerDay: 'Minimum/jour',
                weekdayHours: 'Heures semaine',
                weekendHours: 'Heures weekend',
                
                // Export
                exportTitle: 'Export des données',
                exportJSON: 'Exporter en JSON',
                exportCSV: 'Exporter en CSV',
                
                // Messages d'erreur et notifications
                enterHours: 'Veuillez entrer un nombre d\'heures',
                invalidValue: 'Valeur invalide',
                maxHours: 'Maximum 24h par jour !',
                negativeHours: 'Les heures ne peuvent pas être négatives',
                hoursSaved: 'Heures sauvegardées !',
                hoursDeleted: 'Heures supprimées !',
                appInstalled: 'Application installée !',
                appInstalledSuccess: 'Application installée avec succès !',
                resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser l\'application ?\nToutes les données seront effacées définitivement.',
                resetFinalConfirm: 'Dernière confirmation : cette action est irréversible.\nVoulez-vous vraiment effacer toutes les données ?',
                appReset: 'Application réinitialisée !',
                installApp: 'Installer l\'application',
                resetApp: 'Réinitialiser l\'application',
                
                // Validation en temps réel
                invalidFormat: 'Format invalide (utilisez des chiffres et un point/virgule)',
                tooManyDecimals: 'Trop de points décimaux',
                realTimeTotal: 'Total en temps réel'
            },
            en: {
                // Main interface
                appTitle: 'Hours Tracker Pro',
                monthTotal: 'Month total',
                calendar: 'Calendar',
                statistics: 'Statistics',
                export: 'Export',
                
                // Days of the week
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                daysLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                
                // Months
                months: ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'],
                
                // Modal
                hoursFor: 'Hours for',
                hoursPlaceholder: 'Ex: 7.5',
                notePlaceholder: 'Day note (optional)',
                save: 'Save',
                delete: 'Delete',
                cancel: 'Cancel',
                
                // Statistics
                workDays: 'Work days',
                avgPerDay: 'Average/day',
                maxPerDay: 'Maximum/day',
                minPerDay: 'Minimum/day',
                weekdayHours: 'Weekday hours',
                weekendHours: 'Weekend hours',
                
                // Export
                exportTitle: 'Data export',
                exportJSON: 'Export as JSON',
                exportCSV: 'Export as CSV',
                
                // Error messages and notifications
                enterHours: 'Please enter number of hours',
                invalidValue: 'Invalid value',
                maxHours: 'Maximum 24h per day!',
                negativeHours: 'Hours cannot be negative',
                hoursSaved: 'Hours saved!',
                hoursDeleted: 'Hours deleted!',
                appInstalled: 'App installed!',
                appInstalledSuccess: 'App installed successfully!',
                resetConfirm: 'Are you sure you want to reset the application?\nAll data will be permanently deleted.',
                resetFinalConfirm: 'Final confirmation: this action is irreversible.\nDo you really want to delete all data?',
                appReset: 'Application reset!',
                installApp: 'Install app',
                resetApp: 'Reset application',
                
                // Real-time validation
                invalidFormat: 'Invalid format (use digits and a dot/comma)',
                tooManyDecimals: 'Too many decimal points',
                realTimeTotal: 'Real-time total'
            },
            it: {
                // Interfaccia principale
                appTitle: 'Tracker Ore Pro',
                monthTotal: 'Totale del mese',
                calendar: 'Calendario',
                statistics: 'Statistiche',
                export: 'Esporta',
                
                // Giorni della settimana
                days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
                daysLong: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
                
                // Mesi
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                
                // Modal
                hoursFor: 'Ore del',
                hoursPlaceholder: 'Es: 7.5',
                notePlaceholder: 'Nota del giorno (opzionale)',
                save: 'Salva',
                delete: 'Elimina',
                cancel: 'Annulla',
                
                // Statistiche
                workDays: 'Giorni lavorati',
                avgPerDay: 'Media/giorno',
                maxPerDay: 'Massimo/giorno',
                minPerDay: 'Minimo/giorno',
                weekdayHours: 'Ore feriali',
                weekendHours: 'Ore weekend',
                
                // Export
                exportTitle: 'Esportazione dati',
                exportJSON: 'Esporta in JSON',
                exportCSV: 'Esporta in CSV',
                
                // Messaggi di errore e notifiche
                enterHours: 'Inserisci il numero di ore',
                invalidValue: 'Valore non valido',
                maxHours: 'Massimo 24h al giorno!',
                negativeHours: 'Le ore non possono essere negative',
                hoursSaved: 'Ore salvate!',
                hoursDeleted: 'Ore eliminate!',
                appInstalled: 'App installata!',
                appInstalledSuccess: 'App installata con successo!',
                resetConfirm: 'Sei sicuro di voler reimpostare l\'applicazione?\nTutti i dati saranno eliminati definitivamente.',
                resetFinalConfirm: 'Conferma finale: questa azione è irreversibile.\nVuoi davvero eliminare tutti i dati?',
                appReset: 'Applicazione reimpostata!',
                installApp: 'Installa app',
                resetApp: 'Reimposta applicazione',
                
                // Validazione in tempo reale
                invalidFormat: 'Formato non valido (usa cifre e un punto/virgola)',
                tooManyDecimals: 'Troppi punti decimali',
                realTimeTotal: 'Totale in tempo reale'
            }
        };
    }

    // Obtenir une traduction
    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations['fr'][key] || key;
    }

    // Changer de langue
    changeLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateInterface();
            this.renderCalendar();
            this.updateStats();
            this.showNotification(`🌍 ${this.t('appTitle')}`, 'success');
        }
    }

    // Mettre à jour l'interface avec les traductions
    updateInterface() {
        // Titre de l'application
        document.querySelector('h1').textContent = `⏰ ${this.t('appTitle')}`;
        
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems[0].innerHTML = `📅 ${this.t('calendar')}`;
        navItems[1].innerHTML = `📊 ${this.t('statistics')}`;
        navItems[2].innerHTML = `📤 ${this.t('export')}`;
        
        // En-têtes du calendrier
        const headerDays = document.querySelectorAll('.calendar-header-day');
        headerDays.forEach((day, index) => {
            day.textContent = this.t('days')[index];
        });
        
        // Total du mois - Correction pour assurer la cohérence
        const monthTotalLabel = document.querySelector('.total-hours');
        if (monthTotalLabel) {
            // Recalculer le total au lieu d'utiliser la valeur affichée
            const stats = this.getMonthlyStats();
            const correctTotal = this.formatHours(stats.totalHours);
            monthTotalLabel.innerHTML = `${this.t('monthTotal')}: <span id="monthTotal">${correctTotal}</span>h`;
        }
        
        // Boutons
        const installBtn = document.getElementById('installPWA');
        if (installBtn) {
            installBtn.innerHTML = `📱 ${this.t('installApp')}`;
        }
        
        const resetBtn = document.getElementById('resetApp');
        if (resetBtn) {
            resetBtn.innerHTML = `🗑️ ${this.t('resetApp')}`;
        }
        
        // Mettre à jour le mois affiché
        this.updateMonthDisplay();
        
        // Mettre à jour les statistiques détaillées si visibles
        if (this.currentView === 'stats') {
            this.updateDetailedStats();
        }
        
        // Mettre à jour la section export si visible
        if (this.currentView === 'export') {
            this.updateExportSection();
        }
        
        // Validation finale du total mensuel
        this.validateMonthlyTotal();
    }

    init() {
        this.applyTheme();
        this.updateInterface();
        this.renderCalendar();
        this.updateStats(); // Assurer le calcul initial du total
        this.bindEvents();
        this.updateMonthDisplay();
        this.switchView(this.currentView);
        this.setupPWA();
        this.setupResetButton();
        this.setupLanguageSelector();
        this.setupResponsiveModal();
        this.setupResponsiveHandlers();
        this.validateMonthlyTotal(); // Test de validation initial
    }

    // Configuration du sélecteur de langue
    setupLanguageSelector() {
        // Créer le sélecteur de langue s'il n'existe pas
        let langSelector = document.getElementById('languageSelector');
        if (!langSelector) {
            langSelector = document.createElement('select');
            langSelector.id = 'languageSelector';
            langSelector.className = 'language-selector';
            langSelector.innerHTML = `
                <option value="fr" ${this.currentLanguage === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                <option value="it" ${this.currentLanguage === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
            `;
            
            // Ajouter le sélecteur dans le header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(langSelector);
            }
        }
        
        // Événement de changement de langue
        langSelector.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
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
        this.updateExportSectionContent(section);

        // Add export functionality
        section.querySelector('#exportJSON').addEventListener('click', () => this.exportData('json'));
        section.querySelector('#exportCSV').addEventListener('click', () => this.exportData('csv'));

        document.querySelector('main').appendChild(section);
        return section;
    }

    // Mettre à jour le contenu de la section export
    updateExportSectionContent(section) {
        section.innerHTML = `
            <h2>${this.t('exportTitle')}</h2>
            <div class="export-options">
                <button id="exportJSON" class="export-btn">📥 ${this.t('exportJSON')}</button>
                <button id="exportCSV" class="export-btn">📊 ${this.t('exportCSV')}</button>
            </div>
        `;
    }

    // Mettre à jour la section export
    updateExportSection() {
        const section = document.querySelector('.export-section');
        if (section) {
            this.updateExportSectionContent(section);
            // Re-bind events
            section.querySelector('#exportJSON').addEventListener('click', () => this.exportData('json'));
            section.querySelector('#exportCSV').addEventListener('click', () => this.exportData('csv'));
        }
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

        // Validation améliorée du champ des heures avec feedback en temps réel
        hoursInput.addEventListener('input', (e) => {
            this.validateHoursInput(e.target);
            this.updateRealTimeTotal();
        });
        
        // Validation lors de la perte de focus
        hoursInput.addEventListener('blur', (e) => {
            this.validateHoursInput(e.target, true);
        });
        
        // Ajouter un indicateur de total en temps réel dans la modal
        this.addRealTimeTotal();
        
        // Mettre à jour les placeholders et labels de la modal
        this.updateModalLabels();

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

        // Navigation mois - Amélioration pour permettre modification des mois passés
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateToMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateToMonth(1);
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

        // Calculer le premier jour du mois courant
        const firstDayOfMonth = new Date(year, month, 1);
        
        // Calculer le lundi de la première semaine qui contient le 1er du mois
        // getDay() retourne 0=dimanche, 1=lundi, ..., 6=samedi
        // On convertit pour que lundi = 0, mardi = 1, ..., dimanche = 6
        const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
        
        // Calculer la date de début du calendrier (toujours un lundi)
        const calendarStartDate = new Date(firstDayOfMonth);
        calendarStartDate.setDate(firstDayOfMonth.getDate() - firstDayWeekday);
        
        // Debug: vérifier que nous commençons bien un lundi
        console.log('Calendrier pour:', year, month + 1);
        console.log('Premier jour du mois:', firstDayOfMonth.toDateString());
        console.log('Date de début du calendrier:', calendarStartDate.toDateString());
        console.log('Jour de la semaine de début:', calendarStartDate.getDay(), '(doit être 1 pour lundi)');

        // Générer exactement 42 jours (6 semaines complètes)
        // Cela garantit que tous les jours sont affichés, même si le mois
        // commence un samedi ou dimanche
        for (let dayIndex = 0; dayIndex < 42; dayIndex++) {
            // Créer une nouvelle date pour chaque jour
            const currentDate = new Date(calendarStartDate);
            currentDate.setDate(calendarStartDate.getDate() + dayIndex);
            
            // Créer l'élément DOM pour ce jour
            const dayElement = this.createDayElement(currentDate, month);
            calendar.appendChild(dayElement);
        }

        // Vérifier que nous avons bien 42 éléments
        const generatedDays = calendar.children.length;
        console.log('Jours générés:', generatedDays);
        
        if (generatedDays !== 42) {
            console.warn('Attention: nombre de jours incorrect!', generatedDays);
        }

        // Animation d'apparition du calendrier
        this.animateCalendar();
        
        // Optimisation responsive après le rendu
        setTimeout(() => {
            // Appliquer les optimisations responsives
            if (typeof this.optimizeCalendarForScreen === 'function') {
                this.optimizeCalendarForScreen();
            }
            
            // Forcer une mise à jour du gestionnaire responsive si disponible
            if (this.responsiveHandler && typeof this.responsiveHandler.forceUpdate === 'function') {
                this.responsiveHandler.forceUpdate();
            }
        }, 50);
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

        // Permettre de cliquer sur TOUS les jours visibles (mois courant ET mois passés/futurs)
        dayDiv.addEventListener('click', () => this.openModal(date));
        dayDiv.style.cursor = 'pointer';
        
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
        
        // Mettre à jour les labels de la modal
        this.updateModalLabels();
        
        // Réinitialiser la validation visuelle
        this.resetInputValidation(hoursInput);
        
        // Réinitialiser les styles et afficher la modale
        modal.style.display = 'flex';
        
        // Animation d'ouverture
        requestAnimationFrame(() => {
            modal.classList.add('active');
            
            // Ajuster la position de la modale si nécessaire
            this.adjustModalPosition();
            
            // Focus sur l'input avec délai pour l'animation
            setTimeout(() => {
                hoursInput.focus();
                hoursInput.select();
                // Scroll vers le haut si nécessaire sur mobile
                this.ensureModalVisibility();
            }, 150);
        });
    }

    closeModal() {
        const modal = document.getElementById('modal');
        const modalContent = modal?.querySelector('.modal-content');
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        
        // Réinitialiser les styles personnalisés de la modale
        if (modal) {
            modal.style.alignItems = '';
            modal.style.paddingTop = '';
            modal.style.padding = '';
        }
        if (modalContent) {
            modalContent.style.maxHeight = '';
            modalContent.style.width = '';
            modalContent.style.padding = '';
            modalContent.scrollTop = 0;
        }
        
        // Réinitialiser la validation visuelle
        this.resetInputValidation(hoursInput);
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            this.selectedDate = null;
            
            // Réinitialiser les champs
            hoursInput.value = '';
            noteInput.value = '';
            
            // Réinitialiser le total en temps réel
            const realTimeTotal = document.getElementById('realTimeTotal');
            if (realTimeTotal) {
                realTimeTotal.classList.remove('visible');
            }
        }, 300);
    }

    saveHours() {
        console.log('🔧 DEBUG: saveHours appelée');
        if (!this.selectedDate) {
            console.log('❌ DEBUG: Aucune date sélectionnée');
            return;
        }
        
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        const inputValue = hoursInput.value.trim().replace(',', '.');
        const noteValue = noteInput.value.trim();
        const dateKey = this.getDateKey(this.selectedDate);
        
        console.log('🔧 DEBUG: Date sélectionnée:', this.selectedDate);
        console.log('🔧 DEBUG: Clé de date:', dateKey);
        console.log('🔧 DEBUG: Valeur saisie:', inputValue);
        
        // Validation des heures avec messages multilingues
        if (inputValue === '') {
            this.showNotification(`⚠️ ${this.t('enterHours')}`, 'warning');
            hoursInput.focus();
            return;
        }
        
        const hours = parseFloat(inputValue);
        if (isNaN(hours)) {
            this.showNotification(`⚠️ ${this.t('invalidValue')}`, 'warning');
            hoursInput.focus();
            return;
        }
        
        if (hours > 24) {
            this.showNotification(`⚠️ ${this.t('maxHours')}`, 'warning');
            hoursInput.focus();
            return;
        }
        
        if (hours < 0) {
            this.showNotification(`⚠️ ${this.t('negativeHours')}`, 'warning');
            hoursInput.focus();
            return;
        }
        
        // Sauvegarder les heures et la note
        console.log('🔧 DEBUG: Heures validées:', hours);
        if (hours > 0) {
            this.data[dateKey] = hours;
            console.log('🔧 DEBUG: Données avant sauvegarde:', this.data);
            if (noteValue) {
                this.notes[dateKey] = noteValue;
            } else {
                delete this.notes[dateKey];
            }
            this.showNotification(`✅ ${this.t('hoursSaved')}`, 'success');
        } else {
            delete this.data[dateKey];
            delete this.notes[dateKey];
            this.showNotification(`🗑️ ${this.t('hoursDeleted')}`, 'info');
        }
        
        // Sauvegarder et mettre à jour l'interface - Correction du total mensuel
        console.log('🔧 DEBUG: Appel saveData()');
        this.saveData();
        this.saveNotes();
        console.log('🔧 DEBUG: Données après sauvegarde localStorage:', localStorage.getItem('hoursData'));
        this.renderCalendar();
        this.updateStats(); // Recalculer les statistiques après sauvegarde
        this.forceUpdateMonthTotal(); // Forcer la mise à jour du total affiché
        this.validateMonthlyTotal(); // Valider l'affichage
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
            this.updateStats(); // Recalculer après suppression
            this.forceUpdateMonthTotal(); // Forcer la mise à jour du total
            this.validateMonthlyTotal(); // Valider l'affichage
            this.showNotification(`🗑️ ${this.t('hoursDeleted')}`, 'info');
        }
        
        this.closeModal();
    }

    updateStats() {
        const stats = this.getMonthlyStats();
        
        // Animation des chiffres
        this.animateNumber('monthTotal', stats.totalHours);
        this.animateNumber('workDays', stats.workDays);
        this.animateNumber('avgHours', stats.avgHours);
        
        // Mettre à jour les éléments avec vérification
        const monthTotalElement = document.getElementById('monthTotal');
        const workDaysElement = document.getElementById('workDays');
        const avgHoursElement = document.getElementById('avgHours');
        
        if (monthTotalElement) {
            monthTotalElement.textContent = this.formatHours(stats.totalHours);
        }
        if (workDaysElement) {
            workDaysElement.textContent = stats.workDays;
        }
        if (avgHoursElement) {
            avgHoursElement.textContent = this.formatHours(stats.avgHours);
        }
        
        // Validation automatique après mise à jour
        setTimeout(() => this.validateMonthlyTotal(), 100);
    }

    updateDetailedStats() {
        const stats = this.getMonthlyStats();
        const statsSection = document.querySelector('.stats');
        
        // Mettre à jour ou créer la grille de statistiques détaillées avec traductions
        statsSection.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value" id="workDays">${stats.workDays}</span>
                    <span class="stat-label">${this.t('workDays')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="avgHours">${this.formatHours(stats.avgHours)}</span>
                    <span class="stat-label">${this.t('avgPerDay')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.maxHours)}</span>
                    <span class="stat-label">${this.t('maxPerDay')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.minHours)}</span>
                    <span class="stat-label">${this.t('minPerDay')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.weekdayHours)}</span>
                    <span class="stat-label">${this.t('weekdayHours')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatHours(stats.weekendHours)}</span>
                    <span class="stat-label">${this.t('weekendHours')}</span>
                </div>
            </div>
        `;
    }

    updateMonthDisplay() {
        const monthYear = `${this.t('months')[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
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
                this.showNotification(`🎉 ${this.t('appInstalled')}`, 'success');
                installButton.style.display = 'none';
            }
            
            this.deferredPrompt = null;
        });

        window.addEventListener('appinstalled', () => {
            this.showNotification(`🎉 ${this.t('appInstalledSuccess')}`, 'success');
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
            if (confirm(`⚠️ ${this.t('resetConfirm')}`)) {
                if (confirm(`⚠️ ${this.t('resetFinalConfirm')}`)) {
                    // Effacer toutes les données
                    localStorage.clear();
                    this.data = {};
                    this.notes = {};
                    this.theme = 'light';
                    
                    // Réinitialiser l'interface
                    this.applyTheme();
                    this.renderCalendar();
                    this.updateStats();
                    this.forceUpdateMonthTotal(); // Assurer la mise à jour après reset
                    this.validateMonthlyTotal(); // Valider après reset
                    this.showNotification(`🗑️ ${this.t('appReset')}`, 'info');
                    
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
        const dayIndex = (date.getDay() + 6) % 7; // Convertir dimanche=0 vers lundi=0
        const dayName = this.t('daysLong')[dayIndex];
        const monthName = this.t('months')[date.getMonth()];
        return `${dayName} ${date.getDate()} ${monthName}`;
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
                
                // S'assurer que l'opacity reste à 1 après l'animation
                setTimeout(() => {
                    day.style.opacity = '1';
                }, 300);
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

    // Validation en temps réel des heures
    validateHoursInput(input, showErrors = false) {
        let value = input.value.replace(',', '.');
        
        // Nettoyer la valeur - garder seulement chiffres et un point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        
        // Empêcher plusieurs points
        const points = cleanValue.match(/\./g);
        if (points && points.length > 1) {
            value = cleanValue.substring(0, cleanValue.lastIndexOf('.'));
        } else {
            value = cleanValue;
        }
        
        input.value = value;
        
        // Validation visuelle
        const isValid = this.isValidHours(value);
        const saveButton = document.getElementById('saveHours');
        
        // Changer la couleur du champ selon la validité
        if (value === '') {
            input.classList.remove('invalid', 'valid');
            saveButton.disabled = true;
        } else if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            saveButton.disabled = false;
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            saveButton.disabled = true;
            
            if (showErrors) {
                this.showValidationError(value);
            }
        }
        
        return isValid;
    }
    
    // Vérifier si les heures sont valides
    isValidHours(value) {
        if (value === '') return false;
        
        const hours = parseFloat(value);
        return !isNaN(hours) && hours >= 0 && hours <= 24;
    }
    
    // Afficher l'erreur de validation appropriée
    showValidationError(value) {
        const hours = parseFloat(value);
        
        if (isNaN(hours)) {
            this.showNotification(`⚠️ ${this.t('invalidFormat')}`, 'warning');
        } else if (hours > 24) {
            this.showNotification(`⚠️ ${this.t('maxHours')}`, 'warning');
        } else if (hours < 0) {
            this.showNotification(`⚠️ ${this.t('negativeHours')}`, 'warning');
        }
    }
    
    // Réinitialiser la validation visuelle
    resetInputValidation(input) {
        input.classList.remove('invalid', 'valid');
        const saveButton = document.getElementById('saveHours');
        saveButton.disabled = false;
    }
    
    // Ajouter l'indicateur de total en temps réel
    addRealTimeTotal() {
        const modal = document.querySelector('.modal-content');
        let totalIndicator = document.getElementById('realTimeTotal');
        
        if (!totalIndicator) {
            totalIndicator = document.createElement('div');
            totalIndicator.id = 'realTimeTotal';
            totalIndicator.className = 'real-time-total';
            
            // Insérer avant les boutons rapides
            const quickButtons = modal.querySelector('.quick-buttons');
            modal.insertBefore(totalIndicator, quickButtons);
        }
        
        this.updateRealTimeTotal();
    }
    
    // Mettre à jour le total en temps réel
    updateRealTimeTotal() {
        const totalIndicator = document.getElementById('realTimeTotal');
        if (!totalIndicator) return;
        
        const hoursInput = document.getElementById('hoursInput');
        const inputValue = hoursInput.value.replace(',', '.');
        const currentHours = parseFloat(inputValue) || 0;
        
        // Calculer le nouveau total du mois
        const stats = this.getMonthlyStats();
        let newTotal = stats.totalHours;
        
        // Si on modifie une date existante, soustraire l'ancienne valeur
        if (this.selectedDate) {
            const dateKey = this.getDateKey(this.selectedDate);
            const oldHours = this.data[dateKey] || 0;
            newTotal = newTotal - oldHours + currentHours;
        }
        
        totalIndicator.innerHTML = `
            <div class="total-preview">
                <span class="total-label">${this.t('realTimeTotal')}:</span>
                <span class="total-value">${this.formatHours(newTotal)}h</span>
            </div>
        `;
    }
    
    // Mettre à jour les labels de la modal
    updateModalLabels() {
        const modal = document.querySelector('.modal-content');
        if (!modal) return;
        
        // Titre de la modal
        const title = modal.querySelector('h3');
        if (title && this.selectedDate) {
            title.innerHTML = `📝 ${this.t('hoursFor')} <span id="selectedDate">${this.formatDate(this.selectedDate)}</span>`;
        }
        
        // Placeholders
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        
        if (hoursInput) {
            hoursInput.placeholder = this.t('hoursPlaceholder');
        }
        
        if (noteInput) {
            noteInput.placeholder = this.t('notePlaceholder');
        }
        
        // Boutons
        const saveBtn = document.getElementById('saveHours');
        const deleteBtn = document.getElementById('deleteHours');
        const cancelBtn = document.getElementById('cancelModal');
        
        if (saveBtn) saveBtn.innerHTML = `💾 ${this.t('save')}`;
        if (deleteBtn) deleteBtn.innerHTML = `🗑️ ${this.t('delete')}`;
        if (cancelBtn) cancelBtn.innerHTML = `❌ ${this.t('cancel')}`;
    }

    // Configuration de la gestion responsive de la modale
    setupResponsiveModal() {
        // Gérer les changements de taille de fenêtre
        window.addEventListener('resize', () => {
            const modal = document.getElementById('modal');
            if (modal && modal.classList.contains('active')) {
                this.adjustModalPosition();
                this.ensureModalVisibility();
            }
        });

        // Gérer l'apparition/disparition du clavier virtuel sur mobile
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', () => {
                const modal = document.getElementById('modal');
                if (modal && modal.classList.contains('active')) {
                    this.handleVirtualKeyboard();
                }
            });
        }

        // Fallback pour les navigateurs sans visualViewport
        let initialViewportHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            const modal = document.getElementById('modal');
            if (modal && modal.classList.contains('active')) {
                const currentHeight = window.innerHeight;
                const heightDifference = initialViewportHeight - currentHeight;
                
                // Si la hauteur a diminué de plus de 150px, probablement le clavier
                if (heightDifference > 150) {
                    this.handleVirtualKeyboard();
                } else {
                    this.resetModalPosition();
                }
            }
        });
    }

    // Ajuster la position de la modale selon la taille d'écran
    adjustModalPosition() {
        const modal = document.getElementById('modal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (!modal || !modalContent) return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Pour les très petits écrans en hauteur
        if (viewportHeight < 600) {
            modal.style.alignItems = 'flex-start';
            modal.style.paddingTop = '10px';
            modalContent.style.maxHeight = '90vh';
        } else {
            modal.style.alignItems = 'center';
            modal.style.paddingTop = '20px';
            modalContent.style.maxHeight = '80vh';
        }

        // Pour les écrans très étroits
        if (viewportWidth < 480) {
            modal.style.padding = '10px';
            modalContent.style.width = '95%';
            modalContent.style.padding = '20px';
        } else {
            modal.style.padding = '20px';
            modalContent.style.width = '90%';
            modalContent.style.padding = '30px';
        }
    }

    // Gérer l'apparition du clavier virtuel
    handleVirtualKeyboard() {
        const modal = document.getElementById('modal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (!modal || !modalContent) return;

        // Ajuster la position pour que la modale reste visible
        modal.style.alignItems = 'flex-start';
        modal.style.paddingTop = '10px';
        modalContent.style.maxHeight = '70vh';
        
        // S'assurer que le champ actif reste visible
        setTimeout(() => {
            const activeElement = document.activeElement;
            if (activeElement && modalContent.contains(activeElement)) {
                activeElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 100);
    }

    // Réinitialiser la position de la modale
    resetModalPosition() {
        const modal = document.getElementById('modal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (!modal || !modalContent) return;

        // Remettre les styles par défaut
        modal.style.alignItems = 'center';
        modal.style.paddingTop = '20px';
        modalContent.style.maxHeight = '80vh';
    }

    // S'assurer que la modale est visible
    ensureModalVisibility() {
        const modal = document.getElementById('modal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (!modal || !modalContent) return;

        // Vérifier si la modale dépasse de la fenêtre
        const rect = modalContent.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom > viewportHeight) {
            // Scroll vers le haut si nécessaire
            modalContent.scrollTop = 0;
            
            // Ajuster la position si elle dépasse encore
            if (rect.height > viewportHeight * 0.9) {
                modal.style.alignItems = 'flex-start';
                modal.style.paddingTop = '5px';
                modalContent.style.maxHeight = '95vh';
            }
        }

        // Focus sur le champ d'heures si ce n'est pas déjà fait
        const hoursInput = document.getElementById('hoursInput');
        if (hoursInput && document.activeElement !== hoursInput) {
            hoursInput.focus();
        }
    }

    // Nouvelle méthode de navigation entre mois avec mise à jour complète
    navigateToMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
        this.updateStats();
        this.updateMonthDisplay();
        this.forceUpdateMonthTotal(); // Assurer la mise à jour du total
        this.validateMonthlyTotal(); // Valider l'affichage
        
        // Animation de transition pour feedback visuel
        const calendar = document.getElementById('calendar');
        calendar.style.opacity = '0.7';
        setTimeout(() => {
            calendar.style.opacity = '1';
        }, 150);
    }

    // Forcer la mise à jour du total mensuel affiché
    forceUpdateMonthTotal() {
        const stats = this.getMonthlyStats();
        const monthTotalElement = document.getElementById('monthTotal');
        
        if (monthTotalElement) {
            // Mise à jour directe sans animation pour corriger l'affichage
            monthTotalElement.textContent = this.formatHours(stats.totalHours);
            
            // Mettre à jour aussi le label complet si nécessaire
            const monthTotalLabel = document.querySelector('.total-hours');
            if (monthTotalLabel) {
                monthTotalLabel.innerHTML = `${this.t('monthTotal')}: <span id="monthTotal">${this.formatHours(stats.totalHours)}</span>h`;
            }
        }
    }

    // Test de validation pour vérifier l'affichage du total
    validateMonthlyTotal() {
        const stats = this.getMonthlyStats();
        const displayedTotal = document.getElementById('monthTotal')?.textContent || '0';
        const expectedTotal = this.formatHours(stats.totalHours);
        
        if (displayedTotal !== expectedTotal) {
            console.warn(`⚠️ Incohérence détectée - Total affiché: ${displayedTotal}, Total calculé: ${expectedTotal}`);
            // Correction automatique
            this.forceUpdateMonthTotal();
        }
        
        // Log pour debug en mode développement
        if (window.location.hostname === 'localhost') {
            console.log(`📊 Validation total mensuel - Calculé: ${expectedTotal}h, Affiché: ${displayedTotal}h`);
        }
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

    // Configuration des gestionnaires de responsivité
    setupResponsiveHandlers() {
        // Vérifier si le gestionnaire de responsivité est disponible
        if (typeof window.responsiveHandler !== 'undefined') {
            // Intégrer avec le gestionnaire de responsivité
            this.responsiveHandler = window.responsiveHandler;
            
            // Ajouter des écouteurs personnalisés pour l'application
            window.addEventListener('resize', () => {
                // Forcer la mise à jour du calendrier après redimensionnement
                setTimeout(() => {
                    this.optimizeCalendarForScreen();
                }, 200);
            });
            
            // Optimisation initiale
            this.optimizeCalendarForScreen();
        }
        
        // Gestionnaire de redimensionnement pour la modal
        this.setupModalResponsive();
        
        // Optimisation pour les écrans tactiles
        this.setupTouchOptimizations();
    }

    // Optimiser le calendrier selon la taille de l'écran
    optimizeCalendarForScreen() {
        const calendar = document.getElementById('calendar');
        const calendarContainer = document.querySelector('.calendar-container');
        
        if (!calendar || !calendarContainer) return;
        
        const screenInfo = this.responsiveHandler ? this.responsiveHandler.getScreenInfo() : {
            width: window.innerWidth,
            height: window.innerHeight,
            isSmall: window.innerWidth < 480,
            isVerySmall: window.innerWidth < 360,
            isShort: window.innerHeight < 600
        };
        
        // Ajuster les classes CSS selon la taille d'écran
        calendar.classList.toggle('compact-mode', screenInfo.isSmall);
        calendar.classList.toggle('minimal-mode', screenInfo.isVerySmall);
        calendar.classList.toggle('short-screen', screenInfo.isShort);
        
        // Ajuster la taille des polices dynamiquement
        if (screenInfo.isVerySmall) {
            document.documentElement.style.setProperty('--dynamic-font-scale', '0.8');
        } else if (screenInfo.isSmall) {
            document.documentElement.style.setProperty('--dynamic-font-scale', '0.9');
        } else {
            document.documentElement.style.setProperty('--dynamic-font-scale', '1');
        }
    }

    // Configuration responsive pour la modal
    setupModalResponsive() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        // Observer les changements de taille de la modal
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { height } = entry.contentRect;
                    const viewportHeight = window.innerHeight;
                    
                    // Ajuster la position si la modal est trop haute
                    if (height > viewportHeight * 0.8) {
                        modal.style.alignItems = 'flex-start';
                        modal.style.paddingTop = '10px';
                    }
                }
            });
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                resizeObserver.observe(modalContent);
            }
        }
    }

    // Optimisations pour les écrans tactiles
    setupTouchOptimizations() {
        // Détecter si c'est un appareil tactile
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            
            // Améliorer la zone de toucher pour les petits éléments
            const calendarDays = document.querySelectorAll('.calendar-day');
            calendarDays.forEach(day => {
                day.style.minHeight = Math.max(44, parseInt(getComputedStyle(day).minHeight)) + 'px';
            });
            
            // Optimiser les boutons de navigation
            const navButtons = document.querySelectorAll('.month-nav button');
            navButtons.forEach(button => {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
            });
        }
    }

    // Méthode pour forcer une mise à jour responsive
    forceResponsiveUpdate() {
        if (this.responsiveHandler) {
            this.responsiveHandler.forceUpdate();
        }
        this.optimizeCalendarForScreen();
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
