// /components/ui/ModalManager.jsx
'use client'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/features/ui/uiSlice'
import { MODAL_TYPES } from '@/features/ui/modalTypes'

function BaseModal({ title, children, onClose, actions }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-3 text-sm text-gray-700">{children}</div>
        <div className="mt-6 flex items-center justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <BaseModal title="Confirm Action" onClose={onCancel}
      actions={(
        <>
          <button className="px-3 py-2 rounded-xl border" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={onConfirm}>Confirm</button>
        </>
      )}
    >
      {message}
    </BaseModal>
  )
}

function InfoModal({ title = 'Information', message, onClose }) {
  return (
    <BaseModal title={title} onClose={onClose}
      actions={<button className="px-3 py-2 rounded-xl bg-black text-white" onClick={onClose}>OK</button>}
    >
      {message}
    </BaseModal>
  )
}

export default function ModalManager() {
  const dispatch = useDispatch()
  const { open, type, props } = useSelector(s => s.ui.modal)

  if (!open) return null

  const close = () => dispatch(closeModal())

  switch (type) {
    case MODAL_TYPES.CONFIRM:
      return (
        <ConfirmModal
          message={props?.message}
          onConfirm={() => { props?.onConfirm?.(); close(); }}
          onCancel={close}
        />
      )
    case MODAL_TYPES.INFO:
      return (
        <InfoModal
          title={props?.title}
          message={props?.message}
          onClose={close}
        />
      )
    case MODAL_TYPES.CUSTOM:
      // Expect a React component in props.Component
      const C = props?.Component
      return <C {...props} onClose={close} />
    default:
      return null
  }
}
