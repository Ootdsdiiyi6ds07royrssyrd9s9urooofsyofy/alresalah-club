import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
}

export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
    const [hash, salt] = storedHash.split('.');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(Buffer.from(hash, 'hex'), buf);
}
