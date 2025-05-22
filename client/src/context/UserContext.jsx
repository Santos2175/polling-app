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

  // Update total polls voted
  const onUserVoted = () => {
    const totalPollsVotes = user.totalPollsVotes || 0;
    updateUserStats('totalPollsVotes', totalPollsVotes + 1);
  };

  // Toggle bookmark poll
  const toggleBookmarkId = (id) => {
    const bookmarks = user.bookmarkedPolls || [];

    const index = bookmarks.indexOf(id);

    if (index == -1) {
      // Add the id of poll in bookmarks
      setUser((prev) => ({
        ...prev,
        bookmarkedPolls: [...bookmarks, id],
        totalPollsBookmarked: prev.totalPollsBookmarked + 1,
      }));
    } else {
      // Remove id of poll from bookmarks
      setUser((prev) => ({
        ...prev,
        bookmarkedPolls: bookmarks.filter((bookmarkId) => bookmarkId !== id),
        totalPollsBookmarked: prev.totalPollsBookmarked - 1,
      }));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        onPollCreateOrDelete,
        onUserVoted,
        toggleBookmarkId,
      }}>
      {children}
    </UserContext.Provider>
  );
};
