# 📱 Guide d'utilisation - Pokémon Backend

## 🆕 Nouvelles Fonctionnalités

### 1. Importation des 151 Pokémons Gen 1

Pour importer tous les pokémons Gen 1 (sans les pokémons créés manuellement), exécutez:

```bash
npm run import-gen1
```

Le script va:
- Lire les 151 pokémons du fichier `data/pokemons.json`
- Vérifier ceux qui existent déjà dans la base de données
- Importer seulement les pokémons manquants
- Afficher un rapport détaillé

**Exemple de sortie:**
```
✓ Connecté à MongoDB
📦 151 pokémons trouvés dans le fichier
📊 0 pokémons existent déjà dans la base de données
📥 151 pokémons vont être importés
✅ 151 pokémons importés avec succès
...
```

---

### 2. Upload d'Image lors de la Création d'un Pokémon

Vous pouvez maintenant créer un pokémon avec une image en utilisant la route:

#### **Endpoint:** `POST /pokemons/upload`

#### **Paramètres (multipart/form-data):**

- **image** (file, optionnel): Fichier image (PNG, JPG, GIF, WEBP, etc.)
- **pokemonData** (JSON, requis): Données du pokémon

**Exemple de requête avec cURL:**

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

**Exemple en JavaScript/Fetch:**

```javascript
const formData = new FormData();

// Ajouter l'image
const fileInput = document.querySelector('input[type="file"]');
if (fileInput.files.length > 0) {
    formData.append('image', fileInput.files[0]);
}

// Ajouter les données du pokémon
const pokemonData = {
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
};

formData.append('pokemonData', JSON.stringify(pokemonData));

// Envoyer la requête
const response = await fetch('http://localhost:3000/pokemons/upload', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result);
```

#### **Réponse Success (201 Created):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
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
  },
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "createdAt": "2025-02-08T10:30:00.000Z"
}
```

---

### 3. Modification du Schéma Pokémon

Le schéma Pokémon a été mis à jour:

```javascript
{
  id: Number,                    // ID unique du pokémon
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String
  },
  type: [String],               // Types du pokémon
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpecialAttack: Number,
    SpecialDefense: Number,
    Speed: Number
  },
  image: String,                // URL de l'image (optionnel)
  imageData: String,            // Image en base64 (optionnel)
  createdAt: Date              // Date de création
}
```

---

## 🔒 Limites & Configuration

- **Taille max des fichiers:** 10 MB
- **Formats acceptés:** PNG, JPG, JPEG, GIF, WEBP, BMP, etc.
- **Limite JSON/formulaires:** 50 MB (pour les images base64)

---

## 🚀 Endpoints Existants

Tous les endpoints existants restent disponibles:

- `GET /pokemons` - Lister tous les pokémons (avec pagination)
- `GET /pokemons/:id` - Obtenir un pokémon par ID
- `GET /search/:nom` - Chercher un pokémon par nom
- `POST /pokemons` - Créer un pokémon (sans image)
- `PUT /pokemons/:id` - Modifier un pokémon
- `DELETE /pokemons/:id` - Supprimer un pokémon

---

## 📝 Notes

- L'image est encodée en **base64** et stockée directement dans MongoDB
- Cela permet de ne pas gérer de système fichier séparé
- La taille de la base de données augmente avec les images
- Pour les applications en production, considérez un service de stockage (AWS S3, Cloudinary, etc.)

---

## ❓ Troubleshooting

**Erreur: "Pokemon with this ID already exists"**
→ L'ID que vous utilisez existe déjà. Utilisez un ID unique.

**Erreur: "Seules les images sont acceptées"**
→ Assurez-vous d'envoyer un vrai fichier image.

**Erreur: "File too large"**
→ Le fichier dépasse 10 MB. Compressez-le avant d'envoyer.

