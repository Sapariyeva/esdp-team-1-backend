import bcrypt from 'bcrypt';
import { ErrorRequestHandler } from 'express';
import { envConfig } from '@/env';

export const createSecretKey = (): ErrorRequestHandler => async (err, req, res, next) => {
    console.log(err);
    try {
        const secretHTTP = envConfig.secretHTTP;
        const hashedSecretHTTP = await bcrypt.hash(secretHTTP, 10);
        res.setHeader('x-secret-key-hash', hashedSecretHTTP);
        next();
    } catch (error) {
        console.error('Error creating secret key:', error);
        res.status(500).json({ error: 'Internal server error' });
        next();
    }
}

export const checkSecretKey = (): ErrorRequestHandler => async (err, req, res, next) => {
    console.log(err);
    try {
        const receivedHash = req.headers['x-secret-key-hash'] as string;

        if (!receivedHash) {
            return res.status(401).json({ error: 'Access denied. Secret key hash is missing.' });
        }

        const secretHTTP = envConfig.secretHTTP;
        const hashedSecretHTTP = await bcrypt.compare(secretHTTP, receivedHash);

        if (!hashedSecretHTTP) {
            return res.status(401).json({ error: 'Access denied. Invalid secret key hash.' });
        }
        return;
    } catch (error) {
        console.error('Error creating secret key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}