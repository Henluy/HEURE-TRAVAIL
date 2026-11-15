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
                realTimeTotal: 'Total en temps réel',
                exportPDF: 'Exporter en PDF',
                pdfTitle: 'Heures de travail',
                pdfGenerated: 'Généré le',
                colDate: 'Date',
                colHours: 'Heures',
                colNote: 'Note',
                total: 'Total',
                noData: 'Aucune heure enregistrée',
                dangerZone: 'Zone sensible'
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
                realTimeTotal: 'Real-time total',
                exportPDF: 'Export as PDF',
                pdfTitle: 'Working hours',
                pdfGenerated: 'Generated on',
                colDate: 'Date',
                colHours: 'Hours',
                colNote: 'Note',
                total: 'Total',
                noData: 'No hours recorded',
                dangerZone: 'Danger zone'
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
                realTimeTotal: 'Totale in tempo reale',
                exportPDF: 'Esporta in PDF',
                pdfTitle: 'Ore di lavoro',
                pdfGenerated: 'Generato il',
                colDate: 'Data',
                colHours: 'Ore',
                colNote: 'Nota',
                total: 'Totale',
                noData: 'Nessuna ora registrata',
                dangerZone: 'Zona pericolosa'
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

        // Le sélecteur doit afficher la langue réellement utilisée
        const langSelector = document.getElementById('languageSelector');
        if (langSelector) {
            langSelector.value = this.currentLanguage;
        }
        document.documentElement.lang = this.currentLanguage;

        // Mettre à jour le mois affiché
        this.updateMonthDisplay();
        
        // Mettre à jour les statistiques détaillées si visibles
        if (this.currentView === 'stats') {
            this.updateDetailedStats();
        }
        
        // Mettre à jour la section export (même cachée, sinon elle reste dans l'ancienne langue)
        this.updateExportSection();
        
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
        document.querySelector('main').appendChild(section);
        return section;
    }

    // Mettre à jour le contenu de la section export (et rebrancher les boutons)
    updateExportSectionContent(section) {
        section.innerHTML = `
            <h2>${this.t('exportTitle')}</h2>
            <div class="export-options">
                <button id="exportJSON" class="export-btn" type="button">📥 ${this.t('exportJSON')}</button>
                <button id="exportCSV" class="export-btn" type="button">📊 ${this.t('exportCSV')}</button>
                <button id="exportPDF" class="export-btn" type="button">📝 ${this.t('exportPDF')}</button>
            </div>
            <div class="danger-zone">
                <h3>${this.t('dangerZone')}</h3>
            </div>
        `;
        section.querySelector('#exportJSON').addEventListener('click', () => this.exportData('json'));
        section.querySelector('#exportCSV').addEventListener('click', () => this.exportData('csv'));
        section.querySelector('#exportPDF').addEventListener('click', () => this.exportData('pdf'));

        // Le bouton de réinitialisation vit dans la zone sensible de l'export
        const resetBtn = document.getElementById('resetApp');
        if (resetBtn) {
            section.querySelector('.danger-zone').appendChild(resetBtn);
        }
    }

    // Mettre à jour la section export
    updateExportSection() {
        const section = document.querySelector('.export-section');
        if (section) {
            this.updateExportSectionContent(section);
        }
    }

    // Les heures au format de la langue (virgule décimale en FR/IT)
    formatHoursLocale(hours) {
        const text = this.formatHours(hours);
        return this.currentLanguage === 'en' ? text : text.replace('.', ',');
    }

    // Date AAAA-MM-JJ -> JJ/MM/AAAA
    formatDateKey(dateKey) {
        const [y, m, d] = dateKey.split('-');
        return `${d}/${m}/${y}`;
    }

    exportData(format) {
        const dates = Object.keys(this.data).sort();
        let content, filename, type;

        if (format === 'json') {
            content = JSON.stringify({ hours: this.data, notes: this.notes }, null, 2);
            filename = 'heures-travail.json';
            type = 'application/json';
        } else if (format === 'csv') {
            // Point-virgule + BOM UTF-8 : s'ouvre correctement dans Excel (FR/IT)
            const sep = this.currentLanguage === 'en' ? ',' : ';';
            const quote = value => `"${String(value).replace(/"/g, '""')}"`;
            const lines = [[this.t('colDate'), this.t('colHours'), this.t('colNote')].map(quote).join(sep)];
            dates.forEach(date => {
                lines.push([date, this.formatHoursLocale(this.data[date]), this.notes[date] || ''].map(quote).join(sep));
            });
            content = '﻿' + lines.join('\r\n');
            filename = 'heures-travail.csv';
            type = 'text/csv;charset=utf-8';
        } else if (format === 'pdf') {
            content = this.buildPdf(dates);
            filename = 'heures-travail.pdf';
            type = 'application/pdf';
        } else {
            return;
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Laisser le temps au téléchargement de démarrer (Safari/iOS)
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Construit un vrai fichier PDF (A4, Helvetica) regroupé par mois
    buildPdf(dates) {
        const toPdfText = (value) => {
            const map = { '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', '…': '...', '€': '\x80' };
            let out = '';
            for (const ch of String(value)) {
                const code = ch.codePointAt(0);
                if (map[ch]) out += map[ch];
                else if (code === 9 || code === 10 || code === 13) out += ' ';
                else if (code >= 32 && code < 127) out += ch;
                else if (code >= 160 && code <= 255) out += ch;
                else out += '?';
            }
            return out.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        };
        const wrap = (text, max) => {
            const words = String(text).replace(/\s+/g, ' ').trim().split(' ');
            const lines = [];
            let line = '';
            words.forEach(word => {
                if ((line + ' ' + word).trim().length > max && line) {
                    lines.push(line);
                    line = word;
                } else {
                    line = (line + ' ' + word).trim();
                }
            });
            if (line) lines.push(line);
            return lines.length ? lines : [''];
        };

        // Lignes à écrire : { cells: [[x, texte]], size, bold, gap }
        const rows = [];
        const now = new Date();
        rows.push({ cells: [[50, this.t('pdfTitle')]], size: 18, bold: true, gap: 26 });
        rows.push({ cells: [[50, `${this.t('pdfGenerated')} ${this.formatDateKey(this.getDateKey(now))}`]], size: 10, gap: 24 });

        if (dates.length === 0) {
            rows.push({ cells: [[50, this.t('noData')]], size: 11, gap: 16 });
        }

        let grandTotal = 0;
        const byMonth = {};
        dates.forEach(date => {
            const month = date.slice(0, 7);
            (byMonth[month] = byMonth[month] || []).push(date);
        });
        Object.keys(byMonth).forEach(month => {
            const [y, m] = month.split('-').map(Number);
            let monthTotal = 0;
            rows.push({ cells: [[50, `${this.t('months')[m - 1]} ${y}`]], size: 13, bold: true, gap: 20, keepWithNext: 2 });
            rows.push({ cells: [[50, this.t('colDate')], [150, this.t('colHours')], [220, this.t('colNote')]], size: 10, bold: true, gap: 15 });
            byMonth[month].forEach(date => {
                const hours = Number(this.data[date]) || 0;
                monthTotal += hours;
                const noteLines = wrap(this.notes[date] || '', 60);
                noteLines.forEach((noteLine, i) => {
                    const cells = i === 0
                        ? [[50, this.formatDateKey(date)], [150, `${this.formatHoursLocale(hours)} h`], [220, noteLine]]
                        : [[220, noteLine]];
                    rows.push({ cells, size: 10, gap: 14 });
                });
            });
            grandTotal += monthTotal;
            rows.push({ cells: [[50, this.t('total')], [150, `${this.formatHoursLocale(monthTotal)} h`]], size: 10, bold: true, gap: 26 });
        });
        if (Object.keys(byMonth).length > 1) {
            rows.push({ cells: [[50, this.t('total')], [150, `${this.formatHoursLocale(grandTotal)} h`]], size: 12, bold: true, gap: 18 });
        }

        // Mise en page sur plusieurs pages A4
        const pages = [];
        let ops = [];
        let y = 800;
        rows.forEach((row, index) => {
            const needed = row.gap + (row.keepWithNext ? 40 : 0);
            if (y - needed < 50 && ops.length) {
                pages.push(ops.join('\n'));
                ops = [];
                y = 800;
            }
            row.cells.forEach(([x, text]) => {
                ops.push(`BT /${row.bold ? 'F2' : 'F1'} ${row.size} Tf ${x} ${y} Td (${toPdfText(text)}) Tj ET`);
            });
            y -= row.gap;
        });
        pages.push(ops.join('\n'));

        // Assemblage des objets PDF
        const objects = [];
        objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
        objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
        objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
        const kids = [];
        pages.forEach((stream, i) => {
            const pageId = 5 + i * 2;
            const contentId = pageId + 1;
            kids.push(`${pageId} 0 R`);
            objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
            objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
        });
        objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;

        let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
        const offsets = [];
        for (let id = 1; id < objects.length; id++) {
            offsets[id] = pdf.length;
            pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
        }
        const xref = pdf.length;
        pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
        for (let id = 1; id < objects.length; id++) {
            pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
        }
        pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

        // Chaque caractère = un octet (Latin-1 / WinAnsi)
        const bytes = new Uint8Array(pdf.length);
        for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
        return bytes;
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
                const input = document.getElementById('hoursInput');
                input.value = btn.dataset.hours;
                this.validateHoursInput(input);
                this.updateRealTimeTotal();
                this.animateButton(btn);
            });
        });

        // Fermer modal en cliquant à côté
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.closeModal();
        });

        // Gestion des touches clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('modal').classList.contains('active')) {
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
        
        // 1. Premier jour du mois
        const firstDay = new Date(year, month, 1);

        // 2. Calculer l'offset pour toujours commencer au LUNDI précédent ou du 1er
        // JS: getDay() -> 0 = Dim, 1 = Lun, ..., 6 = Sam
        // Si 1er du mois = Dimanche, recule de 6 jours ; sinon recule de (getDay() - 1)
        let startOffset = firstDay.getDay() === 0 ? -6 : 1 - firstDay.getDay();
        const startDate = new Date(year, month, 1 + startOffset);

        // 3. Générer 42 jours à partir de ce lundi
        for (let i = 0; i < 42; i++) {
            // Création robuste : année/mois/jour + i
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            const dayElement = this.createDayElement(date, month);
            calendar.appendChild(dayElement);
        }
        // => Ce code garantit l'affichage de TOUS les jours du mois dans la grille, peu importe le jour de début !

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

        if (this.notes[dateKey]) {
            dayDiv.classList.add('has-note');
            dayDiv.title = this.notes[dateKey];
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
        clearTimeout(this.closeModalTimer);
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
        
        // Total en temps réel dès l'ouverture
        this.updateRealTimeTotal();

        // Réinitialiser les styles et afficher la modale
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        
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
        modal.setAttribute('aria-hidden', 'true');
        
        clearTimeout(this.closeModalTimer);
        this.closeModalTimer = setTimeout(() => {
            if (modal.classList.contains('active')) return; // rouverte entre-temps
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
        if (!this.selectedDate) {
            return;
        }
        
        const hoursInput = document.getElementById('hoursInput');
        const noteInput = document.getElementById('dayNote');
        const inputValue = hoursInput.value.trim().replace(',', '.');
        const noteValue = noteInput.value.trim();
        const dateKey = this.getDateKey(this.selectedDate);
        
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
        if (hours > 0) {
            this.data[dateKey] = hours;
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
        this.saveData();
        this.saveNotes();
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
        
        // Animation des chiffres (la valeur finale exacte est toujours écrite à la fin)
        this.animateNumber('monthTotal', stats.totalHours);
        this.animateNumber('workDays', stats.workDays);
        this.animateNumber('avgHours', stats.avgHours);
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
        // Utiliser le bouton d'installation existant dans le HTML
        const installButton = document.getElementById('installPWA');
        if (!installButton) return;

        // Gérer l'événement d'installation
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            installButton.style.display = 'inline-block';
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
        resetButton.type = 'button';
        resetButton.innerHTML = `🗑️ ${this.t('resetApp')}`;

        // Placé dans la zone sensible de l'onglet Export (plus dans la barre du bas,
        // où il cachait le bas de l'écran et risquait un clic par erreur)
        const dangerZone = document.querySelector('.export-section .danger-zone');
        if (dangerZone) {
            dangerZone.appendChild(resetButton);
        }

        resetButton.addEventListener('click', () => {
            if (confirm(`⚠️ ${this.t('resetConfirm')}`)) {
                if (confirm(`⚠️ ${this.t('resetFinalConfirm')}`)) {
                    // Effacer uniquement les données de CETTE app : le localStorage est
                    // partagé par tous les sites henluy.github.io/*
                    ['hoursData', 'dayNotes', 'theme', 'language'].forEach(key => localStorage.removeItem(key));
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
        this.numberTimers = this.numberTimers || {};
        clearInterval(this.numberTimers[elementId]);
        delete this.numberTimers[elementId];

        const element = document.getElementById(elementId);
        if (!element) return;

        const format = (value) => (elementId === 'avgHours' || elementId === 'monthTotal')
            ? this.formatHours(value)
            : String(Math.round(value));

        const startValue = parseFloat(String(element.textContent).replace(',', '.')) || 0;
        if (startValue === targetValue || !Number.isFinite(startValue)) {
            element.textContent = format(targetValue);
            return;
        }

        const steps = 20;
        let step = 0;
        this.numberTimers[elementId] = setInterval(() => {
            step++;
            // L'élément peut avoir été recréé (changement de langue, vue stats)
            const current = document.getElementById(elementId);
            if (step >= steps || !current) {
                clearInterval(this.numberTimers[elementId]);
                delete this.numberTimers[elementId];
                if (current) current.textContent = format(targetValue);
                return;
            }
            const value = startValue + (targetValue - startValue) * (step / steps);
            current.textContent = format(Math.round(value * 100) / 100);
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
        return this.loadJSON('hoursData');
    }

    loadNotes() {
        return this.loadJSON('dayNotes');
    }

    loadJSON(key) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (error) {
            console.warn(`Données illisibles pour ${key}, ignorées`, error);
            return {};
        }
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
        
        // Calculer le nouveau total du mois de la date choisie
        // (on peut cliquer un jour du mois précédent/suivant)
        const stats = this.getMonthlyStats(this.selectedDate || this.currentDate);
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
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + direction, 1);
        this.renderCalendar();
        this.updateStats();
        this.updateMonthDisplay();
        if (this.currentView === 'stats') {
            this.updateDetailedStats();
        }
        
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
        if (this.numberTimers) {
            clearInterval(this.numberTimers.monthTotal);
            delete this.numberTimers.monthTotal;
        }
        const monthTotalElement = document.getElementById('monthTotal');
        if (monthTotalElement) {
            // Mise à jour directe sans animation
            monthTotalElement.textContent = this.formatHours(stats.totalHours);
        }
    }

    // Test de validation pour vérifier l'affichage du total
    validateMonthlyTotal() {
        // Pendant l'animation, la valeur affichée est intermédiaire : rien à valider
        if (this.numberTimers && this.numberTimers.monthTotal) return;
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
    getMonthlyStats(refDate = this.currentDate) {
        const year = refDate.getFullYear();
        const month = refDate.getMonth();
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
            const hours = Number(this.data[dateKey]) || 0;
            
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
