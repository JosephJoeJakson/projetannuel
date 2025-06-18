import React from "react";

export default function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="h2 mb-4">{children}</h2>
    );
}
