import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar />

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          {children}
        </div>
      </div>
    </ReactQueryClientProvider>
  );
}
