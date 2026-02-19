// app/template.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Template({ children }: { children: React.ReactNode }) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Every time a route changes, the new page will smoothly slide up and fade in
        gsap.fromTo(
            pageRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
    }, { scope: pageRef });

    return <div ref={pageRef} className="w-full h-full">{children}</div>;
}