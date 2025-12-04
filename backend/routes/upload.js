import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase()
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${baseName}-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Sono permesse solo immagini (image/*).'))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post(
  '/',
  (req, res, next) => {
    upload.single('image')(req, res, err => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'Immagine troppo grande (max 5MB)'
          })
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Errore upload immagine'
        })
      }
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message || 'Errore upload immagine'
        })
      }
      next()
    })
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nessun file immagine fornito'
      })
    }

    const relativePath = `/uploads/${req.file.filename}`

    return res.status(201).json({
      success: true,
      path: relativePath
    })
  }
)

export default router




