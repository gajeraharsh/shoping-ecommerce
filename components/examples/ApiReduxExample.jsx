// /components/examples/ApiReduxExample.jsx
'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useModal } from '@/hooks/useModal'
import { MODAL_TYPES } from '@/features/ui/modalTypes'
import { getProducts, createProduct } from '@/services'

export default function ApiReduxExample() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const toast = useToast()
  const modal = useModal()

  // Example: Fetch products with success/error handling
  const handleFetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts({ limit: 10 })
      setProducts(data.products || [])
      toast.success('Products loaded successfully!')
    } catch (error) {
      // Error toast is automatically shown by API interceptor
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Create product with confirmation modal
  const handleCreateProduct = () => {
    modal.open({
      type: MODAL_TYPES.CONFIRM,
      props: {
        message: 'Are you sure you want to create a new product?',
        onConfirm: async () => {
          try {
            await createProduct({
              name: 'Sample Product',
              price: 99.99,
              description: 'A sample product created via API'
            })
            // Success toast is automatically shown by API interceptor
            handleFetchProducts() // Refresh the list
          } catch (error) {
            // Error toast is automatically shown by API interceptor
            console.error('Failed to create product:', error)
          }
        }
      }
    })
  }

  // Example: Show info modal
  const handleShowInfo = () => {
    modal.open({
      type: MODAL_TYPES.INFO,
      props: {
        title: 'API + Redux System',
        message: 'This demonstrates the scalable API layer with Redux-driven UI components for toasts and modals.'
      }
    })
  }

  // Example: Manual toast triggers
  const handleToastExamples = () => {
    toast.success('This is a success message!')
    setTimeout(() => toast.error('This is an error message!'), 1000)
    setTimeout(() => toast.info('This is an info message!'), 2000)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">API + Redux UI System Demo</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleFetchProducts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Products'}
          </button>
          
          <button
            onClick={handleCreateProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Product
          </button>
          
          <button
            onClick={handleShowInfo}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Show Info Modal
          </button>
          
          <button
            onClick={handleToastExamples}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Toast Examples
          </button>
        </div>

        {products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Products ({products.length})</h3>
            <div className="grid gap-3">
              {products.slice(0, 5).map((product, index) => (
                <div key={product.id || index} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{product.name || `Product ${index + 1}`}</h4>
                  <p className="text-sm text-gray-600">{product.description || 'No description'}</p>
                  <p className="text-sm font-medium">${product.price || '0.00'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
