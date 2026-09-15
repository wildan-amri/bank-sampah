import NasabahSidebar from "@/components/layout/NasabahSidebar";
import Navbar from "@/components/layout/Navbar";

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      <NasabahSidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}