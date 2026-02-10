



Video de présentation du site : https://youtu.be/INjocXP3tIs 





# 🔴 Pokémon Backend API - Documentation Complète

## 📋 Table des matières

1. [Nouveautés](#-nouveautés)
2. [Installation](#-installation)
3. [Démarrage](#-démarrage)
4. [Importation des Pokémons](#-importation-des-pokémons)
5. [Upload d'Image](#-upload-dimage)
6. [Endpoints API](#-endpoints-api)
7. [Schéma de Base de Données](#-schéma-de-base-de-données)
8. [Fichiers Modifiés](#-fichiers-modifiés)

---

## 🆕 Nouveautés

### ✅ Importation des 151 Pokémons Gen 1

Importez facilement tous les 151 pokémons de la première génération dans votre base de données MongoDB sans dupliquer ceux qui existent déjà.

**Commande:**
```bash
npm run import-gen1
```

**Fonctionnalités:**
- ✓ Importe uniquement les pokémons manquants
- ✓ Détecte les doublons automatiquement
- ✓ Rapport détaillé en console
- ✓ Données en 4 langues (Anglais, Japonais, Chinois, Français)

---

### 🖼️ Upload d'Image lors de la Création de Pokémon

Créez des pokémons avec des images enregistrées directement dans MongoDB.

**Endpoint:** `POST /pokemons/upload`

**Fonctionnalités:**
- ✓ Support multipart/form-data
- ✓ Stockage en base64 dans MongoDB
- ✓ Validation des images
- ✓ Limite: 10 MB par image
- ✓ Format: PNG, JPG, GIF, WEBP, BMP, SVG, TIFF, etc.

---

## 🚀 Installation

### Prérequis

- **Node.js** v16+ 
- **MongoDB** installé et en exécution (localhost:27017)
- **npm** ou **yarn**

### Étapes

1. **Cloner/Accéder au projet:**
```bash
cd "c:\Users\teren\ING4_ECE\tech web\tp-partie-back-Terry2932"
```

2. **Installer les dépendances:**
```bash
npm install
```

**Packages installés:**
- ✓ express (5.2.1)
- ✓ mongoose (9.1.6)
- ✓ cors (2.8.5)
- ✓ multer (latest) - **NOUVEAU**
- ✓ dotenv (latest) - **NOUVEAU**
- ✓ nodemon (3.1.11)

---

## 🎬 Démarrage

### Mode Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` avec autoreload.

### Mode Production

```bash
node index.js
```

---

## 📥 Importation des Pokémons

### Option 1: Importer les 151 Pokémons Gen 1

```bash
npm run import-gen1
```

**Exemple de sortie:**
```
✓ Connecté à MongoDB
📦 151 pokémons trouvés dans le fichier
📊 0 pokémons existent déjà dans la base de données
📥 151 pokémons vont être importés
✅ 151 pokémons importés avec succès

📊 Totaux:
  - Pokémons existants: 0
  - Pokémons nouveaux: 151
  - Total en base: 151

✓ Déconnexion de MongoDB
```

### Option 2: Seed Complet (Remplace tout)

```bash
npm run seed
```

Ce script vide la collection puis importe tous les pokémons du fichier `data/pokemons.json`.

---

## 🖼️ Upload d'Image

### Créer un Pokémon avec Image

#### Via cURL:

```bash
curl -X POST http://localhost:3000/pokemons/upload \
  -F "image=@chemin/vers/image.png" \
  -F 'pokemonData={
    "id": 152,
    "name": {
      "english": "Chikorita",
      "japanese": "チコリータ",
      "chinese": "菊草叶",
      "french": "Germignon"
    },
    "type": ["Grass"],
    "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 65,
      "SpecialAttack": 49,
      "SpecialDefense": 65,
      "Speed": 45
    }
  }'
```

#### Via JavaScript/Fetch:

```javascript
const formData = new FormData();

// Ajouter l'image
formData.append('image', fileInput.files[0]);

// Ajouter les données JSON
formData.append('pokemonData', JSON.stringify({
    id: 152,
    name: {
        english: "Chikorita",
        japanese: "チコリータ",
        chinese: "菊草叶",
        french: "Germignon"
    },
    type: ["Grass"],
    base: {
        HP: 45,
        Attack: 49,
        Defense: 65,
        SpecialAttack: 49,
        SpecialDefense: 65,
        Speed: 45
    }
}));

// Envoyer
const response = await fetch('http://localhost:3000/pokemons/upload', {
    method: 'POST',
    body: formData
});

const result = await response.json();
```

#### Via le formulaire HTML:

Ouvrez **test-upload.html** dans votre navigateur (après avoir démarré le serveur).

---

## 📡 Endpoints API

### Pokémons

#### GET `/pokemons` - Lister tous les pokémons

**Paramètres:**
- `page` (query, int) - Numéro de page (défaut: 1)
- `limit` (query, int) - Pokémons par page (défaut: 20)

**Exemple:**
```bash
GET /pokemons?page=1&limit=50
```

**Réponse:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalPokemons": 151,
    "itemsPerPage": 50
  }
}
```

---

#### GET `/pokemons/:id` - Récupérer un pokémon par ID

**Exemple:**
```bash
GET /pokemons/25
```

**Réponse:**
```json
{
  "_id": "...",
  "id": 25,
  "name": {
    "english": "Pikachu",
    "japanese": "ピカチュウ",
    "chinese": "皮卡丘",
    "french": "Pikachu"
  },
  "type": ["Electric"],
  "base": {
    "HP": 35,
    "Attack": 55,
    "Defense": 40,
    "SpecialAttack": 50,
    "SpecialDefense": 50,
    "Speed": 90
  },
  "image": "...",
  "imageData": null,
  "createdAt": "2025-02-08T..."
}
```

---

#### GET `/search/:nom` - Chercher un pokémon

Recherche dans tous les noms (anglais, français, japonais, chinois).

**Exemple:**
```bash
GET /search/pikachu
```

---

#### POST `/pokemons` - Créer un pokémon (sans image)

**Body (JSON):**
```json
{
  "id": 152,
  "name": {
    "english": "Chikorita",
    "japanese": "チコリータ",
    "chinese": "菊草叶",
    "french": "Germignon"
  },
  "type": ["Grass"],
  "base": {
    "HP": 45,
    "Attack": 49,
    "Defense": 65,
    "SpecialAttack": 49,
    "SpecialDefense": 65,
    "Speed": 45
  }
}
```

**Réponse:** 201 Created + JSON du pokémon créé

---

#### POST `/pokemons/upload` - Créer un pokémon (AVEC image) ⭐ **NOUVEAU**

**Body (multipart/form-data):**
- `image` (file) - Image du pokémon
- `pokemonData` (JSON string) - Données du pokémon

Voir [#upload-dimage](#-upload-dimage) pour les exemples.

---

#### PUT `/pokemons/:id` - Modifier un pokémon

**Body (JSON):** Champs à modifier

**Exemple:**
```bash
PUT /pokemons/25
```

```json
{
  "base": {
    "HP": 40,
    "Attack": 60,
    "Defense": 45,
    "SpecialAttack": 55,
    "SpecialDefense": 55,
    "Speed": 95
  }
}
```

---

#### DELETE `/pokemons/:id` - Supprimer un pokémon

**Exemple:**
```bash
DELETE /pokemons/152
```

**Réponse:**
```json
{
  "message": "Pokemon deleted successfully",
  "pokemon": {...}
}
```

---

## 📊 Schéma de Base de Données

```javascript
{
  _id: ObjectId,           // ID MongoDB
  id: Number,              // ID unique du pokémon (1-151 pour Gen1)
  name: {
    english: String,       // Nom en anglais
    japanese: String,      // Nom en japonais
    chinese: String,       // Nom en chinois
    french: String         // Nom en français
  },
  type: [String],          // Types du pokémon: ["Grass"], ["Grass", "Poison"], etc.
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpecialAttack: Number,
    SpecialDefense: Number,
    Speed: Number
  },
  image: String,           // URL de l'image (optionnel)
  imageData: String,       // Image base64 (optionnel) ⭐ **NOUVEAU**
  createdAt: Date          // Date de création ⭐ **NOUVEAU**
}
```

---

## 📝 Fichiers Modifiés & Créés

### ✏️ Fichiers Modifiés

1. **[schema/pokemon.js](schema/pokemon.js)**
   - ✓ Rendu `image` optionnel
   - ✓ Ajouté champ `imageData` pour base64
   - ✓ Ajouté champ `createdAt`

2. **[index.js](index.js)**
   - ✓ Importé multer pour uploads
   - ✓ Configuré stockage en mémoire
   - ✓ Augmenté limites JSON (50 MB)
   - ✓ Ajouté validations images
   - ✓ Nouvelle route `POST /pokemons/upload` ⭐

3. **[package.json](package.json)**
   - ✓ Ajouté `npm run import-gen1`
   - ✓ Ajouté dépendances: multer, dotenv

### 🆕 Fichiers Créés

1. **[data/importGen1Pokemons.js](data/importGen1Pokemons.js)**
   - Script pour importer les 151 pokémons Gen 1
   - Détecte les doublons
   - Rapport détaillé

2. **[IMPORT_GUIDE.md](IMPORT_GUIDE.md)**
   - Guide détaillé d'utilisation
   - Exemples de code
   - Troubleshooting

3. **[API_EXAMPLES.md](API_EXAMPLES.md)**
   - Tous les endpoints documentés
   - Exemples cURL
   - Réponses JSON

4. **[test-upload.html](test-upload.html)** ⭐
   - Formulaire interactif pour tester l'upload
   - Interface belle et intuitive
   - Tests en temps réel

5. **[README.md](README.md)** (ce fichier)
   - Documentation complète

---

## 🧪 Tests

### Test Rapide

1. **Démarrer le serveur:**
```bash
npm run dev
```

2. **Importer les pokémons:**
```bash
npm run import-gen1
```

3. **Tester l'API:**

   **Via cURL:**
   ```bash
   curl http://localhost:3000/pokemons
   ```

   **Via navigateur:**
   - Ouvrez `test-upload.html` (fichier local)
   - Remplissez le formulaire
   - Uploadez une image
   - Créez le pokémon

4. **Vérifier MongoDB:**
```bash
mongosh
use local
db.pokemons.find().limit(1)
```

---

## ⚙️ Configuration

### Fichier `.env` (optionnel)

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/local
API_URL=http://localhost:3000
PORT=3000
```

### CORS

Domaines autorisés:
- `http://localhost:5173` (Vite)
- `http://localhost:5174` (Vite alt)
- `http://localhost:3000` (Frontend local)

À modifier dans [index.js (ligne ~27)](index.js#L27)

---

## 📈 Limites & Performance

| Paramètre | Valeur |
|-----------|--------|
| Taille max image | 10 MB |
| Taille max JSON | 50 MB |
| Items par page (défaut) | 20 |
| Items par page (max) | Illimité |
| Formats images | PNG, JPG, GIF, WEBP, BMP, SVG, TIFF |

---

## 🔒 Sécurité

- ✓ Validation MIME type (images seulement)
- ✓ Limite de taille des fichiers
- ✓ CORS configuré
- ✓ Validation des données MongoDB
- ✓ Pas d'injection SQL (MongoDB native driver)

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module 'multer'"
```bash
npm install multer
```

### Erreur: "Pokemon with this ID already exists"
L'ID existe déjà. Utilisez un ID unique (ex: 152+).

### Erreur: "MongoDB connection failed"
Assurez-vous que MongoDB est lancé:
```bash
mongod
```

### Image ne s'enregistre pas
- Vérifiez que le fichier est une vraie image
- Vérifiez la taille (max 10 MB)
- Vérifiez le Content-Type

---

## 📚 Ressources

- [Express.js](https://expressjs.com/)
- [MongoDB/Mongoose](https://mongoosejs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Pokémon API](https://pokeapi.co/)

---

## 📞 Support

Pour des questions ou des problèmes:

1. Consultez [IMPORT_GUIDE.md](IMPORT_GUIDE.md)
2. Consultez [API_EXAMPLES.md](API_EXAMPLES.md)
3. Testez avec [test-upload.html](test-upload.html)
4. Vérifiez les logs du serveur

---

## 📄 Licence

Ce projet est sous licence ISC.

---

**Dernière mise à jour:** 08/02/2025
**Version:** 2.0 (avec upload d'images & importation Gen1)

