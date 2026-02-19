import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer"; // 👈 Import Footer

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* 👇 Footer goes here, inside the scrollable area but at the bottom */}
        <Footer />
      </div>

      <BottomNav />
    </div>
  );
}