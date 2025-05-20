import { createContext, useState } from 'react';

export const UserContext = createContext();

// User Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to update user
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
