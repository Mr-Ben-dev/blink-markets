import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold gradient-text">404</h1>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-foreground-secondary mb-8 max-w-md">
          The market you're looking for doesn't exist. It might have been closed or the URL is incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/markets">
              <Search className="mr-2 h-4 w-4" />
              Browse Markets
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
