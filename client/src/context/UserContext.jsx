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

  // Update user stats
  const updateUserStats = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  // Update total polls created count locally
  const onPollCreateOrDelete = (type = 'create') => {
    const totalPollsCreated = user.totalPollsCreated || 0;
    updateUserStats(
      'totalPollsCreated',
      type === 'create' ? totalPollsCreated + 1 : totalPollsCreated - 1
    );
  };

  return (
    <UserContext.Provider
      value={{ user, updateUser, clearUser, onPollCreateOrDelete }}>
      {children}
    </UserContext.Provider>
  );
};
