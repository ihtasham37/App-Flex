import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase config from environment or fallback
// Note: In this environment, we use the client config for simplicity
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// App details route for social sharing previews
app.get('/apps/:appId', async (req, res) => {
  const { appId } = req.params;
  const indexPath = path.resolve(__dirname, 'dist', 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return res.send('App is building, please refresh in a moment.');
  }

  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    const docRef = doc(db, 'apps', appId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const appData = docSnap.data();
      const title = `${appData.name} - Download Now`;
      const description = appData.shortDescription || appData.fullDescription?.substring(0, 160) || 'Download the latest version.';
      const image = appData.mainImage;
      const url = `https://${req.get('host')}/apps/${appId}`;

      // Inject Meta Tags
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
      `;

      // Replace the head or existing tags
      const titleTag = /<title>.*?<\/title>/;
      const descTag = /<meta name="description" content=".*?" \/>/;
      
      if (html.match(titleTag)) {
        html = html.replace(titleTag, `<title>${title}</title>`);
      }
      
      // Inject OG and Twitter tags before </head>
      html = html.replace('</head>', `${metaTags}</head>`);
    }
    
    res.send(html);
  } catch (error) {
    console.error('Error injecting meta tags:', error);
    res.sendFile(indexPath);
  }
});

// Serve static files from dist
app.use(express.static(path.resolve(__dirname, 'dist')));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
