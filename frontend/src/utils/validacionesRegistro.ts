export const isEmailValid = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordStrong = (password: string): boolean =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(password); // al menos 6 caracteres, una mayúscula, una minúscula y un número


