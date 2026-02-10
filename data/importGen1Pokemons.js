import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pokemon from '../schema/pokemon.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importGen1Pokemons = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect('mongodb://localhost:27017/local');
        console.log('✓ Connecté à MongoDB');

        // Lire le fichier pokemons.json
        const dataPath = path.join(__dirname, 'pokemons.json');
        const data = fs.readFileSync(dataPath, 'utf-8');
        const pokemons = JSON.parse(data);

        console.log(`\n📦 ${pokemons.length} pokémons trouvés dans le fichier`);

        // Chercher les pokémons qui existent déjà
        const existingPokemons = await pokemon.find({});
        const existingIds = new Set(existingPokemons.map(p => p.id));
        
        console.log(`\n📊 ${existingIds.size} pokémons existent déjà dans la base de données`);

        // Filtrer les pokémons à importer (ignorer ceux qui existent déjà)
        const pokemonsToImport = pokemons.filter(p => !existingIds.has(p.id));
        
        if (pokemonsToImport.length === 0) {
            console.log('\n✓ Tous les pokémons sont déjà présents dans la base de données');
            await mongoose.disconnect();
            console.log('✓ Déconnexion de MongoDB');
            process.exit(0);
        }

        console.log(`\n📥 ${pokemonsToImport.length} pokémons vont être importés`);

        // Insérer les nouveaux pokémons
        const result = await pokemon.insertMany(pokemonsToImport);
        console.log(`\n✅ ${result.length} pokémons importés avec succès`);

        // Afficher un résumé
        console.log(`\n📊 Totaux:`);
        console.log(`  - Pokémons existants: ${existingIds.size}`);
        console.log(`  - Pokémons nouveaux: ${result.length}`);
        console.log(`  - Total en base: ${existingIds.size + result.length}`);

        // Déconnecter de MongoDB
        await mongoose.disconnect();
        console.log('\n✓ Déconnexion de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error.message);
        process.exit(1);
    }
};

importGen1Pokemons();
