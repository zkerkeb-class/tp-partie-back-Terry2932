import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pokemon from '../schema/pokemon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect('mongodb://localhost:27017/local');
        console.log('Connected to MongoDB successfully');

        // Lire le fichier pokemons.json
        const dataPath = path.join(__dirname, 'pokemons.json');
        const data = fs.readFileSync(dataPath, 'utf-8');
        const pokemons = JSON.parse(data);

        console.log(`Found ${pokemons.length} pokemons to insert`);

        // Vider la collection avant d'insérer les nouvelles données
        await pokemon.deleteMany({});
        console.log('Cleared existing pokemons from database');

        // Insérer tous les pokémons
        const result = await pokemon.insertMany(pokemons);
        console.log(`Successfully inserted ${result.length} pokemons into database`);

        // Déconnecter de MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
