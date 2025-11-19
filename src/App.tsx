import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { PerformanceHUD } from "./components/PerformanceHUD";
import Analytics from "./pages/Analytics";
import CreateMarket from "./pages/CreateMarket";
import Developers from "./pages/Developers";
import Home from "./pages/Home";
import MarketDetail from "./pages/MarketDetail";
import Markets from "./pages/Markets";
import NotFound from "./pages/NotFound";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PerformanceHUD />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/markets/:id" element={<MarketDetail />} />
              <Route path="/create" element={<CreateMarket />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
