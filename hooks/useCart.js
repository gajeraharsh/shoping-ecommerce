// /hooks/useCart.js
'use client'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ensureCart,
  fetchCart,
  addLineItem as addLineItemThunk,
  updateLineItem as updateLineItemThunk,
  deleteLineItem as deleteLineItemThunk,
  selectCart,
  selectCartItems,
  selectCartTotals,
  selectCartStatus,
  selectCartError,
} from '@/features/cart/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const cart = useSelector(selectCart)
  const items = useSelector(selectCartItems)
  const totals = useSelector(selectCartTotals)
  const status = useSelector(selectCartStatus)
  const error = useSelector(selectCartError)

  // Do NOT auto-ensure here; Providers already ensures cart on app boot and after login

  const refresh = useCallback(() => {
    if (cart?.id) dispatch(fetchCart(cart.id))
    else dispatch(ensureCart())
  }, [dispatch, cart?.id])

  const ensure = useCallback(() => dispatch(ensureCart()), [dispatch])

  const addToCart = useCallback(
    ({ variant_id, quantity = 1, metadata }) => {
      return dispatch(addLineItemThunk({ variant_id, quantity, metadata }))
    },
    [dispatch]
  )

  const updateQuantity = useCallback(
    ({ line_id, quantity, metadata }) => {
      return dispatch(updateLineItemThunk({ line_id, quantity, metadata }))
    },
    [dispatch]
  )

  const removeItem = useCallback(
    ({ line_id }) => {
      return dispatch(deleteLineItemThunk({ line_id }))
    },
    [dispatch]
  )

  const getItemsCount = useCallback(() => {
    return items.reduce((acc, i) => acc + i.quantity, 0)
  }, [items])

  return {
    cart,
    items,
    totals,
    status,
    error,
    refresh,
    ensure,
    addToCart,
    updateQuantity,
    removeItem,
    getItemsCount,
  }
}
