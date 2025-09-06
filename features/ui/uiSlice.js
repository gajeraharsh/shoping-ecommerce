// /features/ui/uiSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit'
import { MODAL_TYPES } from './modalTypes'

const initialState = {
  // Toasts
  toasts: [], // { id, type: 'success'|'error'|'info', message, duration }

  // Modals
  modal: {
    open: false,
    type: null,        // one of MODAL_TYPES
    props: {},         // data passed to the modal
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toasts
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload)
      },
      prepare({ type = 'info', message, duration = 3000 }) {
        return { payload: { id: nanoid(), type, message, duration } }
      },
    },
    hideToast(state, action) {
      const id = action.payload
      state.toasts = state.toasts.filter(t => t.id !== id)
    },

    // Modals
    openModal(state, action) {
      const { type = MODAL_TYPES.INFO, props = {} } = action.payload || {}
      state.modal.open = true
      state.modal.type = type
      state.modal.props = props
    },
    closeModal(state) {
      state.modal.open = false
      state.modal.type = null
      state.modal.props = {}
    },
  },
})

export const { showToast, hideToast, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer
