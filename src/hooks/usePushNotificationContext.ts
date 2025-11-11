import { useContext } from 'react';
import { PushNotificationContext } from '../contexts/PushNotificationContext';

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotificationContext must be used within a PushNotificationProvider');
  }
  return context;
};
