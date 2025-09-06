// /utils/notify.js
import { getDispatcher } from '@/services/config/dispatcher'
import { showToast } from '@/features/ui/uiSlice'

export const notify = {
  success: (message, duration) => {
    const dispatch = getDispatcher();
    if (dispatch) dispatch(showToast({ type: 'success', message, duration }));
  },
  error: (message, duration) => {
    const dispatch = getDispatcher();
    if (dispatch) dispatch(showToast({ type: 'error', message, duration }));
  },
  info: (message, duration) => {
    const dispatch = getDispatcher();
    if (dispatch) dispatch(showToast({ type: 'info', message, duration }));
  },
}
