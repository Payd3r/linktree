import React, { useEffect, useMemo, useState } from 'react'
import { Product, ProductSection, ProductCategory } from './shared/productTypes'

type BackendProduct = Product

type SectionOption = {
  value: ProductSection
  label: string
}

type CategoryOption = {
  value: ProductCategory
  label: string
}

const sectionOptions: SectionOption[] = [
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'freeguides', label: 'Free Guides' },
  { value: 'blog', label: 'Blog' }
]

const categoryOptions: CategoryOption[] = [
  { value: 'guides', label: 'Guide' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'affiliates', label: 'Affiliate' }
]

const productsApiUrl = `/api/products`

export const Admin = () => {
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [section, setSection] = useState<ProductSection>('bestselling')
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceStart, setPriceStart] = useState('')
  const [priceEnd, setPriceEnd] = useState('')
  const [link, setLink] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [layout, setLayout] = useState<'left' | 'right'>('left')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const isEditing = Boolean(editingId)

  const filteredProducts = useMemo(
    () => products.slice().sort((a, b) => (a.section > b.section ? 1 : -1)),
    [products]
  )

  useEffect(() => {
    void fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(productsApiUrl)
      if (!res.ok) throw new Error(`Errore caricamento products (${res.status})`)
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Errore caricamento products')
      setProducts(data.products || [])
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : 'Errore nel caricamento dei products')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setSection('bestselling')
    setCategory('')
    setTitle('')
    setDescription('')
    setPriceStart('')
    setPriceEnd('')
    setLink('')
    setCtaText('')
    setLayout('left')
    setImageFile(null)
    setImagePreview(null)
  }

  const fillFormForEdit = (product: BackendProduct) => {
    setEditingId(product.id)
    setSection(product.section)
    setCategory((product.category as ProductCategory) || '')
    setTitle(product.title)
    setDescription(product.description)
    setPriceStart(String(product.priceStart ?? ''))
    setPriceEnd(String(product.priceEnd ?? ''))
    setLink(product.link)
    setCtaText(product.ctaText || '')
    setLayout(product.layout || 'left')
    setImageFile(null)
    setImagePreview(product.image || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError('Il titolo è obbligatorio')
      return
    }
    if (!link.trim()) {
      setError('Il link è obbligatorio')
      return
    }
    if (!priceStart || isNaN(Number(priceStart))) {
      setError('Prezzo iniziale non valido')
      return
    }
    if (!priceEnd || isNaN(Number(priceEnd))) {
      setError('Prezzo finale non valido')
      return
    }
    if (section === 'bestselling' && !category) {
      setError('La categoria è obbligatoria per Best Selling')
      return
    }

    try {
      setSaving(true)

      let imagePath: string | undefined = isEditing ? undefined : ''

      // Se c'è un nuovo file immagine, eseguiamo l'upload
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok || !uploadData.success || !uploadData.path) {
          throw new Error(uploadData.error || 'Errore durante l\'upload dell\'immagine')
        }
        imagePath = uploadData.path as string
      }

      const payload: Partial<BackendProduct> = {
        section,
        category: section === 'bestselling' ? (category as ProductCategory) : undefined,
        title: title.trim(),
        description: description.trim(),
        priceStart: Number(priceStart),
        priceEnd: Number(priceEnd),
        link: link.trim(),
        ctaText: ctaText.trim() || 'Scopri di più',
        layout,
        // Se stiamo modificando e non abbiamo caricato una nuova immagine,
        // lasciamo che il backend mantenga l'esistente.
        ...(imagePath !== undefined ? { image: imagePath } : {})
      }

      const url = isEditing ? `${productsApiUrl}/${editingId}` : productsApiUrl
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        throw new Error(
          (data && (data.error || (data.errors && data.errors.join(', ')))) ||
            'Errore nel salvataggio del product'
        )
      }

      setSuccess(isEditing ? 'Prodotto aggiornato con successo' : 'Prodotto creato con successo')
      await fetchProducts()
      resetForm()
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : 'Errore nel salvataggio del product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: BackendProduct) => {
    if (!window.confirm(`Vuoi davvero eliminare il prodotto "${product.title}"?`)) return
    try {
      setDeletingId(product.id)
      setError(null)
      setSuccess(null)

      const res = await fetch(`${productsApiUrl}/${product.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Errore durante l\'eliminazione del product')
      }

      setSuccess('Prodotto eliminato con successo')
      await fetchProducts()
      if (editingId === product.id) resetForm()
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : 'Errore durante l\'eliminazione del product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-white flex-1 relative shadow-sm flex flex-col">
        <header className="border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Products</h1>
            <p className="text-xs md:text-sm text-gray-500">
              Gestisci i prodotti mostrati nel tuo link in bio
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full flex-1 px-4 md:px-8 py-6 space-y-8">
          {(error || success) && (
            <div>
              {error && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}
            </div>
          )}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Modifica prodotto' : 'Nuovo prodotto'}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs md:text-sm text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline"
                >
                  Annulla modifica
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sezione</label>
                  <select
                    value={section}
                    onChange={e => {
                      const value = e.target.value as ProductSection
                      setSection(value)
                      if (value !== 'bestselling') setCategory('')
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {sectionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categoria (solo Best Selling)
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory | '')}
                    disabled={section !== 'bestselling'}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Nessuna</option>
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prezzo da
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={priceStart}
                      onChange={e => setPriceStart(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prezzo a
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={priceEnd}
                      onChange={e => setPriceEnd(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Titolo</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Es: CV Professionale Australia"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Testo bottone (CTA)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Es: Scopri di più"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Layout</label>
                  <select
                    value={layout}
                    onChange={e => setLayout(e.target.value as 'left' | 'right')}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="left">Immagine a sinistra</option>
                    <option value="right">Immagine a destra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Immagine prodotto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0] || null
                      setImageFile(file)
                      if (file) {
                        const previewUrl = URL.createObjectURL(file)
                        setImagePreview(previewUrl)
                      } else {
                        setImagePreview(null)
                      }
                    }}
                    className="w-full text-xs"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <span className="block text-[11px] text-gray-500 mb-1">Preview</span>
                      <img
                        src={imagePreview}
                        alt="Preview immagine prodotto"
                        className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Descrizione breve del prodotto..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Salvataggio...' : isEditing ? 'Salva modifiche' : 'Crea prodotto'}
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Prodotti esistenti</h2>
              <span className="text-xs text-gray-500">
                {products.length} prodotto{products.length === 1 ? '' : 'i'}
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-500 text-sm">Caricamento...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-sm">
                Nessun prodotto salvato. Aggiungine uno sopra.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row md:items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wide text-gray-500">
                          {product.section}
                          {product.category ? ` • ${product.category}` : ''}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
                      {product.description && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-600">
                        {product.priceStart !== undefined &&
                          product.priceEnd !== undefined &&
                          `€${product.priceStart} - €${product.priceEnd}`}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-400 break-all">{product.link}</div>
                    </div>

                    <div className="flex items-center gap-2 md:self-end">
                      <button
                        type="button"
                        onClick={() => fillFormForEdit(product)}
                        className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="px-3 py-1.5 rounded-full border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === product.id ? 'Eliminazione...' : 'Elimina'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}



