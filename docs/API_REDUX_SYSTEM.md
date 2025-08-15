# Scalable API + Redux UI System Documentation

## Overview

This system provides a comprehensive, scalable architecture for API management and UI state handling in your Next.js e-commerce application. It includes:

- **Centralized API layer** with Axios interceptors
- **Redux-powered UI state** for toasts and modals
- **Feature-based service modules** for organized API calls
- **Global toast and modal management**
- **Convenient hooks** for easy integration

## Architecture

```
/services
  /config
    apiClient.js           # Axios instance factory + interceptors
    setupApi.js            # One-time initializer
  /constants
    endpoints.js           # API endpoint constants
  /modules
    /auth
      authService.js       # Auth API calls
    /category
      categoryService.js   # Category API calls
    /product
      productService.js    # Product API calls
  index.js                 # Export all services

/store
  store.js                 # Redux store configuration
  rootReducer.js           # Combined reducers

/features
  /ui
    uiSlice.js             # Toasts + modals state & actions
    modalTypes.js          # Modal name registry

/components/ui
  ModalManager.jsx         # Global modal renderer
  ToastHost.jsx            # Global toast system

/hooks
  useModal.js              # Modal helpers
  useToast.js              # Toast helpers

/utils
  notify.js                # Fire toasts from anywhere

/app
  providers.jsx            # Redux Provider wrapper
```

## Quick Start

### 1. Using Toasts

```javascript
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const toast = useToast()
  
  const handleSuccess = () => {
    toast.success('Operation completed successfully!')
  }
  
  const handleError = () => {
    toast.error('Something went wrong!')
  }
  
  const handleInfo = () => {
    toast.info('Here is some information', 5000) // custom duration
  }
}
```

### 2. Using Modals

```javascript
import { useModal } from '@/hooks/useModal'
import { MODAL_TYPES } from '@/features/ui/modalTypes'

function MyComponent() {
  const modal = useModal()
  
  const handleConfirm = () => {
    modal.open({
      type: MODAL_TYPES.CONFIRM,
      props: {
        message: 'Are you sure you want to delete this item?',
        onConfirm: () => {
          // Handle confirmation
          console.log('Confirmed!')
        }
      }
    })
  }
  
  const handleInfo = () => {
    modal.open({
      type: MODAL_TYPES.INFO,
      props: {
        title: 'Information',
        message: 'This is an informational message.'
      }
    })
  }
}
```

### 3. Using API Services

```javascript
import { getProducts, createProduct } from '@/services'

function ProductManager() {
  const [products, setProducts] = useState([])
  
  // Fetch products - success/error toasts handled automatically
  const loadProducts = async () => {
    try {
      const data = await getProducts({ limit: 10 })
      setProducts(data.products)
    } catch (error) {
      // Error toast shown automatically by interceptor
      console.error('Failed to load products:', error)
    }
  }
  
  // Create product with success message
  const addProduct = async (productData) => {
    try {
      await createProduct(productData)
      // Success toast shown automatically: "Product created successfully"
      loadProducts() // Refresh list
    } catch (error) {
      // Error toast shown automatically
    }
  }
}
```

## API Configuration

### Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

### Customizing API Behavior

The API client supports meta configuration for controlling UX:

```javascript
// Show success toast for this request
await apiClient.post('/endpoint', data, {
  meta: { successMessage: 'Custom success message!' }
})

// Suppress error toast for this request
await apiClient.get('/endpoint', {
  meta: { silent: true }
})
```

## Advanced Usage

### Custom Modal Components

```javascript
// Create a custom modal component
function CustomModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 shadow-xl">
        <h3>Custom Modal</h3>
        <p>{data.message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

// Use the custom modal
modal.open({
  type: MODAL_TYPES.CUSTOM,
  props: {
    Component: CustomModal,
    data: { message: 'Hello from custom modal!' }
  }
})
```

### Global Notifications

Use the `notify` utility to trigger toasts from anywhere (including outside React components):

```javascript
import { notify } from '@/utils/notify'

// In a service, utility, or anywhere
function someUtilityFunction() {
  try {
    // Some operation
    notify.success('Operation completed!')
  } catch (error) {
    notify.error('Operation failed!')
  }
}
```

### Adding New Service Modules

1. Create a new service file:

```javascript
// /services/modules/order/orderService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getOrders = (params = {}) =>
  apiClient.get(ENDPOINTS.ORDER.LIST, { params })

export const createOrder = (payload) =>
  apiClient.post(ENDPOINTS.ORDER.CREATE, payload, {
    meta: { successMessage: 'Order created successfully' },
  })
```

2. Add endpoints:

```javascript
// /services/constants/endpoints.js
export const ENDPOINTS = {
  // ... existing endpoints
  ORDER: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAILS: (id) => `/orders/${id}`,
  },
}
```

3. Export from services index:

```javascript
// /services/index.js
export * from './modules/order/orderService'
```

## Styling

The toast and modal components use Tailwind CSS classes. You can customize the styling by modifying:

- `/components/ui/ToastHost.jsx` - Toast appearance
- `/components/ui/ModalManager.jsx` - Modal appearance

## Integration Notes

- The system is already integrated into your Next.js app via `/app/providers.jsx`
- Redux store is configured with the UI slice for toasts and modals
- All components are client-side rendered with `'use client'` directive
- The system works alongside your existing context providers

## Example Component

See `/components/examples/ApiReduxExample.jsx` for a complete working example demonstrating all features.

## Benefits

1. **Centralized State Management** - All UI interactions managed through Redux
2. **Automatic Error Handling** - API errors automatically show toast notifications
3. **Consistent UX** - Standardized toast and modal patterns across the app
4. **Developer Experience** - Simple hooks and utilities for common tasks
5. **Scalable Architecture** - Easy to extend with new services and UI components
6. **Type Safety** - Structured approach with constants and clear interfaces
