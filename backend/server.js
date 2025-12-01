import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import productsRoutes from './routes/products.js'
import uploadRoutes from './routes/upload.js'

const app = express()
const PORT = process.env.PORT || 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, 'public')

// Inizializza products.json all'avvio
async function initializeProductsFile() {
  const isDev = process.env.NODE_ENV !== 'production'
  const productsDataPath =
    process.env.PRODUCTS_DATA_PATH ||
    (isDev
      ? path.join(process.cwd(), 'data/products.json')
      : process.env.PROD_PRODUCTS_DATA_PATH || '/app/backend/data/products.json')
  
  try {
    // Verifica se esiste e se è un file o una directory
    const stats = await fs.stat(productsDataPath)
    if (stats.isDirectory()) {
      console.warn(`products.json è una directory invece di un file, rimozione: ${productsDataPath}`)
      await fs.rmdir(productsDataPath)
      await fs.writeFile(productsDataPath, JSON.stringify([], null, 2), 'utf-8')
      console.log(`File products.json creato dopo rimozione directory: ${productsDataPath}`)
    } else {
      console.log(`File products.json trovato: ${productsDataPath}`)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        const dir = path.dirname(productsDataPath)
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(productsDataPath, JSON.stringify([], null, 2), 'utf-8')
        console.log(`File products.json creato all'avvio: ${productsDataPath}`)
      } catch (createErr) {
        console.error('Errore nella creazione di products.json all\'avvio:', createErr)
      }
    } else {
      console.error('Errore nell\'accesso a products.json:', err)
    }
  }
}

app.use(cors())
app.use(express.json())

// Serviamo i file statici (inclusi gli upload) da /public
app.use('/uploads', express.static(path.join(publicDir, 'uploads')))
app.use('/images', express.static(path.join(publicDir, 'images')))

app.use('/api/products', productsRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
  res.json({
    name: 'linktree-backend',
    status: 'ok',
    products: '/api/products',
    upload: '/api/upload',
    static: {
      uploads: '/uploads',
      images: '/images'
    }
  })
})

// Inizializza e avvia il server
async function startServer() {
  await initializeProductsFile()
  
  app.listen(PORT, () => {
    console.log(`Backend linktree in ascolto su http://localhost:${PORT}`)
  })
}

startServer().catch(err => {
  console.error('Errore nell\'avvio del server:', err)
  process.exit(1)
})


