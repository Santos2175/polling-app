// Utilty function to check valid email address
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

// Utility function to get initials of fullName
export const getInitials = (name) => {
  if (!name) return;

  let initials = '';
  let words = name.split(' ');
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0].toUpperCase();
  }

  return initials;
};
