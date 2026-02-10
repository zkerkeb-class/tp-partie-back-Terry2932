# Exemples de requêtes cURL pour tester l'API Pokémon

## 1. Importer les 151 Pokémons Gen 1

```bash
npm run import-gen1
```

Cela importera tous les pokémons du fichier `data/pokemons.json` sans dupliquer ceux qui existent déjà.

---

## 2. Créer un Pokémon SANS image

### Request:
```bash
curl -X POST http://localhost:3000/pokemons \
  -H "Content-Type: application/json" \
  -d '{
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

### Response (201 Created):
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
  "image": null,
  "imageData": null,
  "createdAt": "2025-02-08T10:30:00.000Z"
}
```

---

## 3. Créer un Pokémon AVEC image

### Request (avec fichier image):
```bash
curl -X POST http://localhost:3000/pokemons/upload \
  -F "image=@/chemin/vers/chikorita.png" \
  -F 'pokemonData={
    "id": 153,
    "name": {
      "english": "Bayleef",
      "japanese": "ベイリーフ",
      "chinese": "月桂叶",
      "french": "Macronium"
    },
    "type": ["Grass"],
    "base": {
      "HP": 60,
      "Attack": 62,
      "Defense": 80,
      "SpecialAttack": 63,
      "SpecialDefense": 80,
      "Speed": 60
    }
  }'
```

### Response (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "id": 153,
  "name": {
    "english": "Bayleef",
    "japanese": "ベイリーフ",
    "chinese": "月桂叶",
    "french": "Macronium"
  },
  "type": ["Grass"],
  "base": {
    "HP": 60,
    "Attack": 62,
    "Defense": 80,
    "SpecialAttack": 63,
    "SpecialDefense": 80,
    "Speed": 60
  },
  "image": null,
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhE...",
  "createdAt": "2025-02-08T10:35:00.000Z"
}
```

---

## 4. Récupérer tous les pokémons (avec pagination)

### Request:
```bash
# Page 1 avec 20 pokémons par page (défaut)
curl -X GET "http://localhost:3000/pokemons"

# Page 2 avec 50 pokémons par page
curl -X GET "http://localhost:3000/pokemons?page=2&limit=50"

# Page 1 avec 100 pokémons par page
curl -X GET "http://localhost:3000/pokemons?limit=100"
```

### Response (200 OK):
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439000",
      "id": 1,
      "name": {
        "english": "Bulbasaur",
        "japanese": "フシギダネ",
        "chinese": "妙蛙种子",
        "french": "Bulbizarre"
      },
      "type": ["Grass", "Poison"],
      "base": {
        "HP": 45,
        "Attack": 49,
        "Defense": 49,
        "SpecialAttack": 65,
        "SpecialDefense": 65,
        "Speed": 45
      },
      "image": "http://localhost:3000/assets/pokemons/1.png",
      "imageData": null,
      "createdAt": "2025-02-08T09:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalPokemons": 151,
    "itemsPerPage": 20
  }
}
```

---

## 5. Récupérer un pokémon par ID

### Request:
```bash
curl -X GET "http://localhost:3000/pokemons/25"
```

### Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439025",
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
  "image": "http://localhost:3000/assets/pokemons/25.png",
  "imageData": null,
  "createdAt": "2025-02-08T09:00:00.000Z"
}
```

---

## 6. Chercher un pokémon par nom

### Request:
```bash
# Chercher par nom anglais (case-insensitive)
curl -X GET "http://localhost:3000/search/pikachu"

# Chercher par nom français
curl -X GET "http://localhost:3000/search/pikachu"

# Chercher par nom partiel
curl -X GET "http://localhost:3000/search/pika"
```

### Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439025",
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
  "image": "http://localhost:3000/assets/pokemons/25.png",
  "imageData": null,
  "createdAt": "2025-02-08T09:00:00.000Z"
}
```

---

## 7. Modifier un pokémon

### Request:
```bash
curl -X PUT http://localhost:3000/pokemons/152 \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "english": "Chikorita Updated",
      "japanese": "チコリータ",
      "chinese": "菊草叶",
      "french": "Germignon"
    },
    "base": {
      "HP": 50,
      "Attack": 55,
      "Defense": 70,
      "SpecialAttack": 55,
      "SpecialDefense": 70,
      "Speed": 50
    }
  }'
```

### Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": 152,
  "name": {
    "english": "Chikorita Updated",
    "japanese": "チコリータ",
    "chinese": "菊草叶",
    "french": "Germignon"
  },
  "type": ["Grass"],
  "base": {
    "HP": 50,
    "Attack": 55,
    "Defense": 70,
    "SpecialAttack": 55,
    "SpecialDefense": 70,
    "Speed": 50
  },
  "image": null,
  "imageData": null,
  "createdAt": "2025-02-08T10:30:00.000Z"
}
```

---

## 8. Supprimer un pokémon

### Request:
```bash
curl -X DELETE "http://localhost:3000/pokemons/152"
```

### Response (200 OK):
```json
{
  "message": "Pokemon deleted successfully",
  "pokemon": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 152,
    "name": {
      "english": "Chikorita Updated",
      "japanese": "チコリータ",
      "chinese": "菊草叶",
      "french": "Germignon"
    },
    "type": ["Grass"],
    "base": {
      "HP": 50,
      "Attack": 55,
      "Defense": 70,
      "SpecialAttack": 55,
      "SpecialDefense": 70,
      "Speed": 50
    },
    "image": null,
    "imageData": null,
    "createdAt": "2025-02-08T10:30:00.000Z"
  }
}
```

---

## Codes de Réponse

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Créé avec succès |
| 400 | Bad Request - Erreur de requête (ex: ID existe déjà) |
| 404 | Not Found - Pokémon non trouvé |
| 500 | Internal Error - Erreur serveur |

---

## Informations Supplémentaires

- **Base URL:** `http://localhost:3000`
- **Port:** 3000
- **Base de données:** MongoDB (localhost:27017/local)
- **Taille max d'image:** 10 MB
- **Formats d'image acceptés:** PNG, JPG, JPEG, GIF, WEBP, BMP, SVG, TIFF, etc.

