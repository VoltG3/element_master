let _registry = null;

/**
 * Ielasa visus JSON failus un izveido masīvu.
 * Tiek izpildīts tikai vienu reizi.
 */
const initRegistry = () => {
    // Ja reģistrs jau eksistē, neko nedarām
    if (_registry) return _registry;

    console.time("Registry Load Time");

    try {
        // 1. Ielādējam JSON datus
        const jsonContext = require.context('./assets/json', true, /\.json$/);
    
        // 2. Ielādējam BILDES
        const imageContext = require.context('./assets/images', true, /\.(png|jpe?g|svg)$/);

        // Palīgfunkcija ceļu apstrādei
        const resolvePath = (rawPath) => {
            if (!rawPath) return null;
            try {
                // Pārveidojam JSON ceļu uz relatīvu Webpack ceļu
                // Piemēram: "/assets/images/blocks/dirt.png" -> "./blocks/dirt.png"
                const cleanPath = rawPath.replace('/assets/images/', './').replace('src/assets/images/', './');
                const relativePath = cleanPath.startsWith('./') ? cleanPath : `./${cleanPath}`;
                
                const imageModule = imageContext(relativePath);
                return imageModule.default || imageModule;
            } catch (e) {
                console.warn(`Image not found: ${rawPath}`);
                return rawPath; // Ja neatrod, atgriežam oriģinālo ceļu
            }
        };

        _registry = jsonContext.keys().map((key) => {
            const data = jsonContext(key);
            const item = data.default || data;

            // Apstrādājam vienu bildi (vecais variants)
            let resolvedTexture = resolvePath(item.texture);

            // Apstrādājam bilžu masīvu (jaunais variants animācijām)
            let resolvedTextures = [];
            if (item.textures && Array.isArray(item.textures)) {
                resolvedTextures = item.textures.map(path => resolvePath(path));
            }

            return {
                ...item,
                texture: resolvedTexture,     // Viena bilde (ja ir)
                textures: resolvedTextures    // Masīvs (ja ir)
            };
        });

        console.log(`✅ Game Registry initialized. Loaded ${_registry.length} items.`);

    } catch (error) {
        console.error("❌ Failed to load Game Registry:", error);
        _registry = [];
    }

    console.timeEnd("Registry Load Time");
    return _registry;
};

// Automātiski inicializējam, kad šis fails tiek importēts pirmo reizi
initRegistry();

// Eksportējam funkciju, lai piekļūtu datiem (getter)
export const getRegistry = () => {
    return _registry;
};

// Eksportējam palīgfunkciju, lai meklētu pēc ID
export const findItemById = (id) => {
    return _registry ? _registry.find(item => item.id === id) : null;
};

export default _registry;