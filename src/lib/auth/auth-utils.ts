// src/lib/auth/auth-utils.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token valido per 7 giorni

export interface UserPayload {
  id: string;
  email: string;
  referralCode: string;
}

/**
 * Genera JWT token
 */
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifica JWT token
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifica password
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida password (min 8 caratteri, almeno 1 numero)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /\d/.test(password);
}

/**
 * Valida numero telefono (opzionale, formato italiano)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Opzionale
  const phoneRegex = /^(\+39)?[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
