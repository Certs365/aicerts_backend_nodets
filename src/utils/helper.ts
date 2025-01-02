// Function to check object is empty
export const isObjectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Function to check valid email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
