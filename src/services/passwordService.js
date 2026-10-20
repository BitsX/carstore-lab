// PBKDF2-SHA256 có salt riêng. Đây vẫn là xác thực mô phỏng trên trình duyệt.
const ITERATIONS = 100000;
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
export async function hashPassword(password, salt) {
  const saltHex = salt || hex(crypto.getRandomValues(new Uint8Array(16)));
  const saltBytes = new Uint8Array(saltHex.match(/.{2}/g).map(v => parseInt(v, 16)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name: 'PBKDF2', salt: saltBytes, iterations: ITERATIONS, hash: 'SHA-256'}, key, 256);
  return saltHex + ':' + hex(new Uint8Array(bits));
}
export async function verifyPassword(password, saved) {
  if (!saved || !saved.includes(':')) return false;
  return (await hashPassword(password, saved.split(':')[0])) === saved;
}
