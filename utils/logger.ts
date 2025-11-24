export const logger = {
    info: (message: string, data?: any) => {
        console.log(message, data);
        logToServer('info', message, data);
    },
    error: (message: string, data?: any) => {
        console.error(message, data);
        logToServer('error', message, data);
    },
    warn: (message: string, data?: any) => {
        console.warn(message, data);
        logToServer('warn', message, data);
    }
};

const logToServer = async (level: 'info' | 'error' | 'warn', message: string, data?: any) => {
    try {
        await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, message, data }),
        });
    } catch (err) {
        // Fail silently if logging fails to avoid infinite loops
        console.error('Failed to send log to server', err);
    }
};
