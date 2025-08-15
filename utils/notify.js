// /utils/notify.js
import { store } from '@/store/store'
import { showToast } from '@/features/ui/uiSlice'

export const notify = {
  success: (message, duration) => store.dispatch(showToast({ type: 'success', message, duration })),
  error:   (message, duration) => store.dispatch(showToast({ type: 'error', message, duration })),
  info:    (message, duration) => store.dispatch(showToast({ type: 'info', message, duration })),
}
