import React from "react";

export default function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-bold text-primary mb-6">{children}</h2>
    );
}
