import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        // The root background color. No complex flexbox here to prevent layout stretching.
        <div className="bg-[#050505] text-white selection:bg-[#FF4500] selection:text-white min-h-screen relative">

            {/* 1. FIXED SIDEBAR - Completely separate from the page flow */}
            <Sidebar />

            {/* 2. MAIN CONTENT - Pushed to the right by 64 units (16rem/256px) on desktop */}
            <div className="md:ml-64 min-h-screen flex flex-col w-full md:w-[calc(100%-16rem)]">

                {/* Topbar stays at the top of the content column */}
                <TopBar />

                {/* Main Scrollable Canvas */}
                {/* Added pb-24 to ensure content doesn't get hidden behind the mobile bottom nav */}
                <main className="flex-1 w-full relative pb-24 md:pb-0">
                    {children}
                </main>

                <Footer />
            </div>

            {/* 3. FIXED BOTTOM NAV - Only visible on mobile */}
            <BottomNav />

        </div>
    );
}