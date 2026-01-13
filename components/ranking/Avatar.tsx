'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

interface AvatarProps {
    username: string | undefined;
    size?: number;
    className?: string;
    rounded?: boolean;
    style?: React.CSSProperties;
}

const Avatar = React.memo<AvatarProps>(function Avatar({
    username,
    size = 40,
    className = '',
    rounded = true,
    style = {},
}) {
    const avatarSvg = useMemo(() => {
        const safeUsername = username?.toString() || '';

        if (!safeUsername) {
            return `
                <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#CCCCCC" />
                    <text x="50" y="50" font-family="Arial, sans-serif" font-size="45" font-weight="bold"
                        text-anchor="middle" dominant-baseline="central" fill="#888888">?</text>
                </svg>
            `;
        }

        let hash = 0;
        for (let i = 0; i < safeUsername.length; i++) {
            hash = (hash << 5) - hash + safeUsername.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
        }

        const hue = Math.abs(hash % 360);
        const saturation = 70 + Math.abs((hash >> 8) % 30);
        const lightness = 70 + Math.abs((hash >> 16) % 15);
        const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const textColor = lightness > 50 ? '#333' : '#fff';

        const parts = safeUsername.trim().split(/\s+/);
        const displayText =
            parts.length >= 2
                ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                : (parts[0][0]?.toUpperCase() ?? '?');

        const fontSize = displayText.length === 1 ? '45' : '38';

        return `
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="${bgColor}" />
                <text x="50" y="50" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
                    text-anchor="middle" dominant-baseline="central" fill="${textColor}">
                    ${displayText}
                </text>
            </svg>
        `;
    }, [username]);

    const dataUrl = useMemo(
        () => `data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`,
        [avatarSvg]
    );

    return (
        <Image
            src={dataUrl}
            alt={`${username || 'User'}'s avatar`}
            width={size}
            height={size}
            className={`${rounded ? 'rounded-full' : 'rounded-md'} ${className}`}
            style={style}
            unoptimized
        />
    );
});

export default Avatar;
