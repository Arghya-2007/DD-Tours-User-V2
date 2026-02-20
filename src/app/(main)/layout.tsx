import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        // 1. Outermost container locked to screen height to prevent mobile navbar issues
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">

            {/* 2. Desktop Sidebar - Locked to the left natively */}
            <div className="hidden md:block w-64 h-full shrink-0 z-[100]">
                <Sidebar />
            </div>

            {/* 3. Main Column (TopBar + Scrollable Content + BottomNav) */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative">

                {/* TopBar - shrink-0 prevents it from squishing */}
                <div className="shrink-0 z-40">
                    <TopBar />
                </div>

                {/* 4. SCROLLABLE MAIN AREA - Wrapped in our custom Lenis SmoothScroll */}
                <SmoothScroll>
                    {children}
                    <Footer />
                </SmoothScroll>

                {/* 5. Mobile Bottom Nav - Sits natively at the bottom of the column */}
                <div className="md:hidden shrink-0 w-full z-[100]">
                    <BottomNav />
                </div>

            </div>
        </div>
    );
}