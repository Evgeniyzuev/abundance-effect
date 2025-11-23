'use client';

import { useEffect, useRef } from 'react';

interface TelegramLoginButtonProps {
    botName: string;
    buttonSize?: 'large' | 'medium' | 'small';
    cornerRadius?: number;
    requestAccess?: boolean;
    usePic?: boolean;
    dataOnauth: (user: any) => void;
}

export default function TelegramLoginButton({
    botName,
    buttonSize = 'large',
    cornerRadius,
    requestAccess = true,
    usePic = true,
    dataOnauth,
}: TelegramLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);
        if (cornerRadius !== undefined) {
            script.setAttribute('data-radius', cornerRadius.toString());
        }
        script.setAttribute('data-request-access', requestAccess ? 'write' : 'read');
        script.setAttribute('data-userpic', usePic ? 'true' : 'false');
        script.async = true;

        // Set callback
        (window as any).telegramLoginCallback = dataOnauth;
        script.setAttribute('data-onauth', 'telegramLoginCallback(user)');

        // Append to container
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup
            delete (window as any).telegramLoginCallback;
        };
    }, [botName, buttonSize, cornerRadius, requestAccess, usePic, dataOnauth]);

    return <div ref={containerRef} className="flex justify-center" />;
}
