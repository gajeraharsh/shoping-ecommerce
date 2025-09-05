// /store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'
import ui from '@/features/ui/uiSlice'

const rootReducer = combineReducers({ ui })
export default rootReducer
