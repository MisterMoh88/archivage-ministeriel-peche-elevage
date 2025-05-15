
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LockIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to the home page if the user is already connected
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      // On success, the AuthContext will handle redirection
    } catch (error: any) {
      console.error("Login handler error:", error);
      
      // More specific error messages based on the error type
      if (error.message?.includes("Invalid login credentials")) {
        setErrorMessage("Email ou mot de passe incorrect");
      } else if (error.message?.includes("Database error")) {
        setErrorMessage("Erreur temporaire du serveur. Veuillez réessayer dans quelques instants.");
        toast.error("Une erreur de connexion à la base de données est survenue. Notre équipe technique a été informée.");
      } else {
        setErrorMessage(error.message || "Une erreur est survenue lors de la connexion");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <img src="/lovable-uploads/a0142a7c-c258-4bbc-bc33-eb26a36b0e8d.png" alt="Logo République du Mali" className="h-24 w-24" />
            <h1 className="mt-4 text-2xl font-bold text-ministry-darkBlue dark:text-white text-center">
              Système d'Archivage Électronique
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Ministère de l'Élevage et de la Pêche
            </p>
          </div>
        </div>

        <Card className="border-ministry-blue/20 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder au système
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom.prenom@elevage-peche.gouv.ml"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-ministry-blue hover:bg-ministry-darkBlue"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-ministry-blue underline underline-offset-4">
                Mot de passe oublié?
              </a>
            </div>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
              <LockIcon className="h-3 w-3" /> Accès sécurisé
            </div>
            {/* Information de connexion pour l'administrateur (à supprimer en production) */}
            <div className="mt-4 p-2 border border-dashed border-gray-300 rounded text-xs text-gray-500">
              <p className="font-semibold">Compte administrateur (temporaire):</p>
              <p>Email: mahamadoutraorecp@yahoo.com</p>
              <p>Mot de passe: Admin@2025</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
