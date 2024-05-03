import crypto from 'crypto';

export function generateSessionToken(length: number = 64): string {
    return crypto.randomBytes(length).toString('hex');
}