
import express from 'express';
import pokemon from './schema/pokemon.js';

import './connect.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// GET tous les pokemons avec pagination (20 par 20)
app.get('/pokemons', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const pokemons = await pokemon.find({})
            .skip(skip)
            .limit(limit)
            .sort({ id: 1 });

        const total = await pokemon.countDocuments({});
        const totalPages = Math.ceil(total / limit);

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