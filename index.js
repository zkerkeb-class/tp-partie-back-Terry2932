
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pokemon from './schema/pokemon.js';

import './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limite
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont acceptées'));
        }
    }
});

// Middleware CORS pour permettre les requêtes du front
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware pour parser le JSON avec limite augmentée pour les images base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir les assets statiques (images, etc.)
app.use('/assets', express.static('assets'));

// Servir les fichiers statiques HTML
app.use(express.static(__dirname));

// GET tous les pokemons SANS pagination
app.get('/pokemons/all', async (req, res) => {
    try {
        const pokemons = await pokemon.find({})
            .sort({ id: 1 });

        res.json({
            data: pokemons,
            total: pokemons.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET tous les pokemons avec pagination (151 par défaut, ou limit spécifié)
app.get('/pokemons', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 151;
        const skip = (page - 1) * limit;

        const pokemons = await pokemon.find({})
            .skip(skip)
            .limit(limit)
            .sort({ id: 1 });

        const total = await pokemon.countDocuments({});
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        res.json({
            data: pokemons,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPokemons: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET un pokemon par ID
app.get('/pokemons/:id', async (req, res) => {
    try {
        const poke = await pokemon.findOne({ id: req.params.id });
        if (poke) {
            res.json(poke);
        } else {
            res.status(404).json({ error: 'Pokemon not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET un pokemon par nom (recherche)
app.get('/search/:nom', async (req, res) => {
    try {
        const searchTerm = req.params.nom.toLowerCase();
        
        const poke = await pokemon.findOne({
            $or: [
                { 'name.english': { $regex: searchTerm, $options: 'i' } },
                { 'name.french': { $regex: searchTerm, $options: 'i' } },
                { 'name.japanese': { $regex: searchTerm, $options: 'i' } },
                { 'name.chinese': { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (poke) {
            res.json(poke);
        } else {
            res.status(404).json({ error: 'Pokemon not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST créer un nouveau pokemon avec upload d'image
app.post('/pokemons/upload', upload.single('image'), async (req, res) => {
    try {
        // Vérifier que l'ID n'existe pas déjà
        const existingPokemon = await pokemon.findOne({ id: req.body.id });
        if (existingPokemon) {
            return res.status(400).json({ error: 'Pokemon with this ID already exists' });
        }

        // Préparer les données du pokemon
        const pokemonData = JSON.parse(req.body.pokemonData);

        // Convertir l'image en base64 si elle existe
        let imageData = null;
        if (req.file) {
            imageData = req.file.buffer.toString('base64');
            pokemonData.imageData = `data:${req.file.mimetype};base64,${imageData}`;
        }

        const newPokemon = new pokemon(pokemonData);
        const savedPokemon = await newPokemon.save();
        res.status(201).json(savedPokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST créer un nouveau pokemon
app.post('/pokemons', async (req, res) => {
    try {
        // Vérifier que l'ID n'existe pas déjà
        const existingPokemon = await pokemon.findOne({ id: req.body.id });
        if (existingPokemon) {
            return res.status(400).json({ error: 'Pokemon with this ID already exists' });
        }

        const newPokemon = new pokemon(req.body);
        const savedPokemon = await newPokemon.save();
        res.status(201).json(savedPokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE modifier un pokemon par ID
app.put('/pokemons/:id', async (req, res) => {
    try {
        const updatedPokemon = await pokemon.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedPokemon) {
            res.json(updatedPokemon);
        } else {
            res.status(404).json({ error: 'Pokemon not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE supprimer un pokemon par ID
app.delete('/pokemons/:id', async (req, res) => {
    try {
        const deletedPokemon = await pokemon.findOneAndDelete({ id: req.params.id });

        if (deletedPokemon) {
            res.json({ message: 'Pokemon deleted successfully', pokemon: deletedPokemon });
        } else {
            res.status(404).json({ error: 'Pokemon not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});