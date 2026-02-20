"use client";

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        // CRITICAL: Sync GSAP's ticker with Lenis to prevent jitter on pinned sections
        const update = (time: number) => {
            lenisRef.current?.lenis?.raf(time * 1000);
        };

        gsap.ticker.add(update);

        // Disables GSAP's lag smoothing to ensure the scroll physics stay perfectly locked
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis
            ref={lenisRef}
            // root={false} tells Lenis to only scroll THIS container, not the whole screen
            root={false}
            // We turn off Lenis's default animation frame because GSAP is driving it now
            autoRaf={false}
            // We pass your exact classes and ID so HomePage.tsx doesn't need to change at all!
            className="flex-1 overflow-y-auto overflow-x-hidden w-full relative pb-24 md:pb-0"
            id="main-scroll-container"
            options={{
                lerp: 0.08, // The "smoothness" factor. Lower = smoother/heavier.
                wheelMultiplier: 1, // Scroll speed
                smoothWheel: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}