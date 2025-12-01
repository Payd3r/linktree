import express from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = express.Router()

const isDev = process.env.NODE_ENV !== 'production'
const productsDataPath =
  process.env.PRODUCTS_DATA_PATH ||
  (isDev
    ? path.join(process.cwd(), 'data/products.json')
    : process.env.PROD_PRODUCTS_DATA_PATH || '/app/backend/data/products.json')

async function readProducts() {
  try {
    const content = await fs.readFile(productsDataPath, 'utf-8')
    // Se il file è vuoto, ritorna array vuoto
    if (!content || content.trim() === '') {
      return []
    }
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // Crea il file se non esiste
      try {
        const dir = path.dirname(productsDataPath)
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(productsDataPath, JSON.stringify([], null, 2), 'utf-8')
        console.log(`File products.json creato in: ${productsDataPath}`)
        return []
      } catch (createErr) {
        console.error('Errore nella creazione del file products.json:', createErr)
        console.error('Path tentato:', productsDataPath)
        console.error('Errore dettagliato:', createErr.message, createErr.stack)
        return []
      }
    }
    // Gestisci errori di parsing JSON
    if (err instanceof SyntaxError) {
      console.error('Errore di parsing JSON in products.json:', err.message)
      // Prova a riscrivere il file con un array vuoto
      try {
        await fs.writeFile(productsDataPath, JSON.stringify([], null, 2), 'utf-8')
        return []
      } catch (writeErr) {
        console.error('Errore nella riscrittura del file products.json:', writeErr)
        return []
      }
    }
    // Per qualsiasi altro errore, logga e ritorna array vuoto invece di lanciare
    console.error('Errore inatteso in readProducts:', err)
    console.error('Path:', productsDataPath)
    console.error('Errore code:', err?.code)
    console.error('Errore message:', err?.message)
    return []
  }
}

async function writeProducts(products) {
  await fs.writeFile(productsDataPath, JSON.stringify(products, null, 2), 'utf-8')
}

function isValidSection(section) {
  return ['bestselling', 'freeguides', 'blog'].includes(section)
}

function isValidCategory(category) {
  return ['guides', 'coaching', 'affiliates'].includes(category)
}

function validateProductPayload(body, { isUpdate = false } = {}) {
  const errors = []

  const {
    section,
    category,
    title,
    description,
    priceStart,
    priceEnd,
    link,
    image,
    ctaText,
    layout
  } = body

  if (!isUpdate || section !== undefined) {
    if (!section || !isValidSection(section)) {
      errors.push('Sezione non valida. Valori ammessi: bestselling, guides, coaching, affiliates')
    }
  }

  if (!isUpdate || category !== undefined || section === 'bestselling') {
    if (section === 'bestselling' && !category) {
      errors.push('Categoria obbligatoria per sezione bestselling')
    }
    if (category && !isValidCategory(category)) {
      errors.push('Categoria non valida. Valori ammessi: guides, coaching, affiliates')
    }
  }

  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string') {
      errors.push('Titolo obbligatorio')
    }
  }

  if (!isUpdate || description !== undefined) {
    if (!description || typeof description !== 'string') {
      errors.push('Descrizione obbligatoria')
    }
  }

  if (!isUpdate || priceStart !== undefined) {
    if (priceStart === undefined || isNaN(Number(priceStart))) {
      errors.push('priceStart deve essere un numero')
    }
  }

  if (!isUpdate || priceEnd !== undefined) {
    if (priceEnd === undefined || isNaN(Number(priceEnd))) {
      errors.push('priceEnd deve essere un numero')
    }
  }

  if (!isUpdate || link !== undefined) {
    if (!link || typeof link !== 'string') {
      errors.push('Link obbligatorio')
    }
  }

  if (!isUpdate || image !== undefined) {
    if (image !== undefined && typeof image !== 'string') {
      errors.push('Image deve essere una stringa')
    }
  }

  if (!isUpdate || ctaText !== undefined) {
    if (ctaText !== undefined && typeof ctaText !== 'string') {
      errors.push('ctaText deve essere una stringa')
    }
  }

  if (!isUpdate || layout !== undefined) {
    if (
      layout !== undefined &&
      layout !== null &&
      layout !== '' &&
      layout !== 'left' &&
      layout !== 'right'
    ) {
      errors.push('Layout non valido. Valori ammessi: left, right')
    }
  }

  return errors
}

router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Path file:', productsDataPath)
    const products = await readProducts()
    console.log('GET /api/products - Products recuperati:', products?.length || 0)
    res.json({ success: true, products })
  } catch (error) {
    console.error('Errore nel recupero products:', error)
    console.error('Stack trace:', error.stack)
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero dei products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const errors = validateProductPayload(req.body, { isUpdate: false })
    if (errors.length) {
      return res.status(400).json({ success: false, errors })
    }

    const {
      section,
      category,
      title,
      description,
      priceStart,
      priceEnd,
      link,
      image,
      ctaText,
      layout
    } = req.body

    const products = await readProducts()
    const idBase = `${section}-${title}`.toLowerCase().replace(/\s+/g, '-')
    let id = idBase
    let counter = 1
    while (products.some(p => p.id === id)) {
      id = `${idBase}-${counter++}`
    }

    const now = new Date().toISOString()
    const newProduct = {
      id,
      section,
      category: section === 'bestselling' ? category : undefined,
      title,
      description,
      priceStart: Number(priceStart),
      priceEnd: Number(priceEnd),
      link,
      image: typeof image === 'string' ? image : '',
      ctaText: typeof ctaText === 'string' && ctaText.trim() ? ctaText.trim() : 'Scopri di più',
      layout: layout === 'right' || layout === 'left' ? layout : 'left',
      createdAt: now,
      updatedAt: now
    }

    const updatedProducts = [newProduct, ...products]
    await writeProducts(updatedProducts)

    res.status(201).json({
      success: true,
      product: newProduct
    })
  } catch (error) {
    console.error('Errore nella creazione product:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Errore nella creazione del product'
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const products = await readProducts()
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product non trovato'
      })
    }

    const errors = validateProductPayload(req.body, { isUpdate: true })
    if (errors.length) {
      return res.status(400).json({ success: false, errors })
    }

    const existing = products[index]
    const updated = {
      ...existing,
      ...req.body,
      section: req.body.section || existing.section,
      category:
        (req.body.section || existing.section) === 'bestselling'
          ? (req.body.category ?? existing.category)
          : undefined,
      priceStart:
        req.body.priceStart !== undefined
          ? Number(req.body.priceStart)
          : existing.priceStart,
      priceEnd:
        req.body.priceEnd !== undefined
          ? Number(req.body.priceEnd)
          : existing.priceEnd,
      image:
        req.body.image !== undefined && typeof req.body.image === 'string'
          ? req.body.image
          : existing.image || '',
      ctaText:
        req.body.ctaText !== undefined && typeof req.body.ctaText === 'string'
          ? req.body.ctaText.trim() || 'Scopri di più'
          : existing.ctaText || 'Scopri di più',
      layout:
        req.body.layout === 'left' || req.body.layout === 'right'
          ? req.body.layout
          : existing.layout || 'left',
      updatedAt: new Date().toISOString()
    }

    products[index] = updated
    await writeProducts(products)

    res.json({
      success: true,
      product: updated
    })
  } catch (error) {
    console.error('Errore nell\'aggiornamento product:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Errore nell\'aggiornamento del product'
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const products = await readProducts()
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product non trovato'
      })
    }

    const [removed] = products.splice(index, 1)
    await writeProducts(products)

    res.json({
      success: true,
      removed,
      remaining: products.length
    })
  } catch (error) {
    console.error('Errore nella cancellazione product:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Errore nella cancellazione del product'
    })
  }
})

export default router


