# RDW — Site vitrine

Site vitrine en HTML, CSS et JavaScript, sans installation ni compilation.

## Aperçu local

Depuis ce dossier :

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Ouvrir http://127.0.0.1:8765/ ou utiliser Live Server sur `index.html`.

## Version conservée

- Branche de travail : `design/refonte-vitrine`.
- Version publiée : branche `main`.
- Version précédente : branche locale `archive/site-avant-refonte`, commit `91f06b6`.
- Copie indépendante de cette version : `../RDW-version-actuelle`, un worktree Git sur `archive/site-avant-refonte`.

## Formulaire

Le parcours comporte trois étapes : coordonnées, situation et projet. Les types des champs, les questions, les libellés des réponses, leur ordre et leurs valeurs reprennent le formulaire du commit `91f06b6`. Les six groupes utilisent des cases à cocher et acceptent plusieurs réponses. Les identifiants `entry.*` et l’URL du formulaire Google d’origine sont conservés. Chaque réponse cochée est envoyée séparément sous le même identifiant Google, y compris lorsqu’un choix classique et « Autre » sont sélectionnés ensemble.

L’envoi conserve l’intégration directe à Google Forms, connecté à la feuille Google Sheets existante. La requête utilise `no-cors` : le navigateur ne peut pas lire la réponse de Google ni certifier l’enregistrement dans la feuille. Le message final indique une transmission, pas une confirmation d’enregistrement. Une confirmation fiable nécessiterait un endpoint serveur ou Google Apps Script configuré avec les accès appropriés.

La validation s’effectue à chaque étape avec les contraintes du formulaire précédent : les cinq coordonnées sont obligatoires, sans obligation ajoutée aux cases à cocher. Les champs « autre » deviennent obligatoires quand leur option est cochée, comme auparavant. Les réponses restent saisies si le réseau échoue et le bouton d’envoi empêche les doubles clics. Les données personnelles ne sont pas journalisées dans la console ni enregistrées dans le stockage du navigateur.

Les tests automatisés interceptent les requêtes du formulaire : aucune demande de test n’est transmise à Google.

## Ressources et animations

- Le PDF original reste inchangé. `assets/guide-cover.webp` est une image de sa première page.
- `assets/reichstag.webp` et `assets/logo.webp` sont des versions optimisées des images existantes.
- L’assistant ouvre `https://t.me/RDW_assistant_bot` dans un nouvel onglet.
- Les animations utilisent CSS, Web Animations et IntersectionObserver ; elles respectent `prefers-reduced-motion`.
- Polices Manrope et DM Sans via Google Fonts, avec polices système en secours.

Les informations des pages de conditions ont été conservées. La page de confidentialité reflète les champs réellement collectés et l’utilisation existante de Google Forms / Google Sheets.
