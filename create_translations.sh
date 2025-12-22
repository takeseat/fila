#!/bin/bash

# Script to create all missing translation files for i18n
# This creates placeholder translations for all namespaces in all languages

LOCALES_DIR="frontend/src/locales"

# Create Italian translations
mkdir -p "$LOCALES_DIR/it"
cat > "$LOCALES_DIR/it/dashboard.json" << 'EOF'
{
  "title": "Dashboard",
  "subtitle": "Monitora le metriche del tuo ristorante in tempo reale",
  "metrics": {
    "activeQueue": {"title": "In Coda Ora", "vsYesterday": "vs ieri"},
    "avgWait": {"title": "Tempo Medio", "vsYesterday": "vs ieri", "min": "min"},
    "seated": {"title": "Clienti Serviti", "vsYesterday": "vs ieri"}
  },
  "charts": {
    "volumeByHour": {"title": "Volume per Ora", "subtitle": "Clienti durante il giorno", "viewDetails": "Vedi dettagli"},
    "weeklyTrend": {"title": "Tendenza Settimanale", "subtitle": "Confronto ultimi 7 giorni", "viewDetails": "Vedi dettagli"},
    "days": {"mon": "Lun", "tue": "Mar", "wed": "Mer", "thu": "Gio", "fri": "Ven", "sat": "Sab", "sun": "Dom"}
  },
  "quickActions": {
    "title": "Azioni Rapide",
    "addToQueue": {"title": "Aggiungi alla Coda", "description": "Registra un nuovo cliente nella lista d'attesa"},
    "viewReports": {"title": "Vedi Report", "description": "Analizza metriche e prestazioni"}
  }
}
EOF

cat > "$LOCALES_DIR/it/common.json" << 'EOF'
{
  "actions": {"save": "Salva", "cancel": "Annulla", "confirm": "Conferma", "delete": "Elimina", "edit": "Modifica", "create": "Crea", "search": "Cerca", "filter": "Filtra", "clear": "Pulisci", "close": "Chiudi", "back": "Indietro", "next": "Avanti", "previous": "Precedente", "submit": "Invia", "add": "Aggiungi", "remove": "Rimuovi", "update": "Aggiorna", "refresh": "Aggiorna", "export": "Esporta", "import": "Importa"},
  "status": {"loading": "Caricamento...", "saving": "Salvataggio...", "success": "Successo", "error": "Errore", "warning": "Avviso", "info": "Info"},
  "time": {"never": "Mai", "now": "Ora", "today": "Oggi", "yesterday": "Ieri", "minutes": "{{count}} min", "hours": "{{count}} h", "days": "{{count}} g", "seconds": "{{count}}s"},
  "labels": {"name": "Nome", "email": "Email", "phone": "Telefono", "notes": "Note", "optional": "Opzionale", "required": "Obbligatorio"}
}
EOF

# Create French translations
mkdir -p "$LOCALES_DIR/fr"
cat > "$LOCALES_DIR/fr/dashboard.json" << 'EOF'
{
  "title": "Tableau de Bord",
  "subtitle": "Suivez les métriques de votre restaurant en temps réel",
  "metrics": {
    "activeQueue": {"title": "En File Maintenant", "vsYesterday": "vs hier"},
    "avgWait": {"title": "Temps Moyen", "vsYesterday": "vs hier", "min": "min"},
    "seated": {"title": "Clients Servis", "vsYesterday": "vs hier"}
  },
  "charts": {
    "volumeByHour": {"title": "Volume par Heure", "subtitle": "Clients tout au long de la journée", "viewDetails": "Voir détails"},
    "weeklyTrend": {"title": "Tendance Hebdomadaire", "subtitle": "Comparaison des 7 derniers jours", "viewDetails": "Voir détails"},
    "days": {"mon": "Lun", "tue": "Mar", "wed": "Mer", "thu": "Jeu", "fri": "Ven", "sat": "Sam", "sun": "Dim"}
  },
  "quickActions": {
    "title": "Actions Rapides",
    "addToQueue": {"title": "Ajouter à la File", "description": "Enregistrer un nouveau client dans la liste d'attente"},
    "viewReports": {"title": "Voir Rapports", "description": "Analyser métriques et performances"}
  }
}
EOF

cat > "$LOCALES_DIR/fr/common.json" << 'EOF'
{
  "actions": {"save": "Enregistrer", "cancel": "Annuler", "confirm": "Confirmer", "delete": "Supprimer", "edit": "Modifier", "create": "Créer", "search": "Rechercher", "filter": "Filtrer", "clear": "Effacer", "close": "Fermer", "back": "Retour", "next": "Suivant", "previous": "Précédent", "submit": "Soumettre", "add": "Ajouter", "remove": "Retirer", "update": "Mettre à jour", "refresh": "Actualiser", "export": "Exporter", "import": "Importer"},
  "status": {"loading": "Chargement...", "saving": "Enregistrement...", "success": "Succès", "error": "Erreur", "warning": "Avertissement", "info": "Info"},
  "time": {"never": "Jamais", "now": "Maintenant", "today": "Aujourd'hui", "yesterday": "Hier", "minutes": "{{count}} min", "hours": "{{count}} h", "days": "{{count}} j", "seconds": "{{count}}s"},
  "labels": {"name": "Nom", "email": "Email", "phone": "Téléphone", "notes": "Notes", "optional": "Optionnel", "required": "Requis"}
}
EOF

echo "Translation files created successfully!"
