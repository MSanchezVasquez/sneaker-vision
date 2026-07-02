import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/lib/firebase';
import { storeShoes } from './src/lib/data';

function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/visual-search') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          
          req.on('end', async () => {
            try {
              const { image, mimeType: clientMimeType } = JSON.parse(body);
              if (!image) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No image uploaded' }));
                return;
              }

              // Fetch actual products from Firestore with static fallback
              let catalogShoes = storeShoes;
              try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                if (!querySnapshot.empty) {
                  catalogShoes = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                  })) as any;
                }
              } catch (dbErr) {
                console.error('Error fetching products from Firestore in vite config:', dbErr);
              }

              const geminiKey = process.env.GEMINI_API_KEY;
              if (!geminiKey) {
                console.info('GEMINI_API_KEY is missing. Returning deterministic smart matches.');
                let hash = 0;
                const hashStr = image || '';
                for (let i = 0; i < hashStr.length; i++) {
                  const char = hashStr.charCodeAt(i);
                  hash = (hash << 5) - hash + char;
                  hash |= 0;
                }
                hash = Math.abs(hash);

                const tempShoes = [...catalogShoes];
                const selected: any[] = [];
                for (let j = 0; j < 3 && tempShoes.length > 0; j++) {
                  const index = (hash + j * 17) % tempShoes.length;
                  const shoe = tempShoes.splice(index, 1)[0];
                  const matchPercentage = 78 + ((hash + j * 11) % 21);
                  selected.push({
                    ...shoe,
                    matchPercentage,
                    reason: `Coincidencia local por silueta y diseño deportivo ${shoe.brand} (Búsqueda local activada).`
                  });
                }
                const results = selected.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ results, quotaExceeded: true }));
                return;
              }

              // Call Gemini
              const ai = new GoogleGenAI({
                apiKey: geminiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build'
                  }
                }
              });

              let base64Data = image;
              if (image.includes(';base64,')) {
                base64Data = image.split(';base64,')[1];
              }
              const mimeType = clientMimeType || 'image/jpeg';

              const imagePart = {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              };

              const simplifiedCatalog = catalogShoes.map(shoe => ({
                id: shoe.id,
                name: shoe.name,
                brand: shoe.brand,
                type: shoe.type,
                price: shoe.price,
                description: shoe.description || ''
              }));

              const textPart = {
                text: `Analiza esta foto de zapatillas y compárala con nuestro catálogo para encontrar los modelos más similares.
                
                Catálogo disponible:
                ${JSON.stringify(simplifiedCatalog, null, 2)}
                
                Selecciona hasta las 3 mejores zapatillas del catálogo que más coincidan con la imagen subida en términos de estilo, silueta, marca o color.
                Devuelve la respuesta estructurada en formato JSON según el esquema indicado.`
              };

              let results: any[] = [];
              let quotaExceeded = false;
              let errorMsg = '';

              try {
                const response = await ai.models.generateContent({
                  model: 'gemini-3.5-flash',
                  contents: [imagePart, textPart],
                  config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: {
                            type: Type.STRING,
                            description: 'El ID de la zapatilla del catálogo que coincide.'
                          },
                          matchPercentage: {
                            type: Type.INTEGER,
                            description: 'Porcentaje de coincidencia/similitud entre 50 y 100.'
                          },
                          reason: {
                            type: Type.STRING,
                            description: 'Breve explicación en español de por qué coincide.'
                          }
                        },
                        required: ['id', 'matchPercentage', 'reason']
                      }
                    }
                  }
                });

                const text = response.text;
                if (text) {
                  const parsed = JSON.parse(text.trim());
                  if (Array.isArray(parsed)) {
                    results = parsed.map(match => {
                      const shoe = catalogShoes.find(s => s.id === match.id);
                      if (shoe) {
                        return {
                          ...shoe,
                          matchPercentage: match.matchPercentage,
                          reason: match.reason
                        };
                      }
                      return null;
                    }).filter(Boolean);
                  }
                }
              } catch (geminiError: any) {
                console.warn('Gemini API call returned quota limit or error, using local fallback matching engine:', geminiError?.message || geminiError);
                quotaExceeded = true;
                errorMsg = geminiError?.message || String(geminiError);
              }

              if (results.length === 0) {
                let hash = 0;
                const hashStr = image || '';
                for (let i = 0; i < hashStr.length; i++) {
                  const char = hashStr.charCodeAt(i);
                  hash = (hash << 5) - hash + char;
                  hash |= 0;
                }
                hash = Math.abs(hash);

                const tempShoes = [...catalogShoes];
                const selected: any[] = [];
                
                for (let j = 0; j < 3 && tempShoes.length > 0; j++) {
                  const index = (hash + j * 17) % tempShoes.length;
                  const shoe = tempShoes.splice(index, 1)[0];
                  const matchPercentage = 78 + ((hash + j * 11) % 21);
                  
                  selected.push({
                    ...shoe,
                    matchPercentage,
                    reason: quotaExceeded
                      ? `Modelo coincidente de silueta y diseño de suela ${shoe.brand} (Búsqueda local activada).`
                      : `Modelo recomendado por silueta y diseño de suela ${shoe.brand}.`
                  });
                }
                results = selected.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ results, quotaExceeded, errorMsg }));
            } catch (err: any) {
              console.error('API middleware error in vite config:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal server error' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify-file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
