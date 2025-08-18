// /services/config/dispatcher.js
// A tiny registry to avoid importing the Redux store in utility modules.
// This helps break circular dependencies between store, notify, and apiClient.

let _dispatch = null;

export function setDispatcher(dispatchFn) {
  _dispatch = typeof dispatchFn === 'function' ? dispatchFn : null;
}

export function getDispatcher() {
  return _dispatch;
}
