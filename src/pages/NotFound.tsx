
import { Button } from "@/components/ui/button";
import { Archive, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/a0142a7c-c258-4bbc-bc33-eb26a36b0e8d.png" 
            alt="Logo République du Mali" 
            className="h-20 w-20" 
          />
        </div>
        
        <h1 className="text-6xl font-bold text-ministry-blue">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Page non trouvée
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/archives" className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Consulter les archives
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
