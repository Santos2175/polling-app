import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

// useUser hook
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be within UserProvider');
  }

  return context;
};
