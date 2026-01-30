import argon2 from 'argon2';
import { randomBytes, createHash } from 'node:crypto';

export function randomCode(length = 6) {
  const digits = '0123456789';
  return Array.from({length}).map(()=>digits[Math.floor(Math.random()*10)]).join('');
}
export async function hashValue(value: string) { return argon2.hash(value); }
export async function verifyHash(hash: string, plain: string) { return argon2.verify(hash, plain); }
export function sha256(buf: Buffer | string) {
  return createHash('sha256').update(buf).digest('hex');
}
export function randomId(bytes = 16) { return randomBytes(bytes).toString('hex'); }
