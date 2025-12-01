import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import productsRoutes from './routes/products.js'
import uploadRoutes from './routes/upload.js'

const app = express()
const PORT = process.env.PORT || 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, 'public')

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

app.listen(PORT, () => {
  console.log(`Backend linktree in ascolto su http://localhost:${PORT}`)
})


