import { useSelector } from 'react-redux';

// Typed selector hook for Redux
export const useAppSelector = (selector) => useSelector(selector);

export default useAppSelector;
