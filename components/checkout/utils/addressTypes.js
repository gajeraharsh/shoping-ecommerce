import { Home, Building2, MapPin } from 'lucide-react';

export const addressTypes = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'office', label: 'Office', icon: Building2 },
  { value: 'other', label: 'Other', icon: MapPin },
];

export const getTypeIcon = (type) => {
  const typeConfig = addressTypes.find((t) => t.value === type);
  return typeConfig?.icon || MapPin;
};
