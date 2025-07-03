'use client';

import { Image as ImageIcon } from 'lucide-react';

interface PlaceholderProps {
    className?: string;
}

export default function Placeholder({ className }: PlaceholderProps) {
    return (
        <div className={`placeholder ${className || ''}`}>
            <ImageIcon className="placeholder__icon" />
        </div>
    );
} 