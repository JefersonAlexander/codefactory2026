"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, getProfile } from "@/src/services/authService";



export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    
   try {
      const googleToken = credentialResponse.credential;

      if (!googleToken) {
        throw new Error("No se recibió token de Google");
      }

      const loginData = await loginWithGoogle(googleToken);

      console.log("✅ loginData recibido:", loginData);

      const jwt = loginData.accessToken;

      if (!jwt) {
        throw new Error("El backend no devolvió el token JWT");
      }

      localStorage.setItem("token", jwt);

      localStorage.setItem("user", JSON.stringify(loginData.usuario));
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }   
    
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
                <Flame className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">FinZen</h1>
                <p className="text-primary-foreground/80 text-sm">Gestión Financiera Personal</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Bienvenido de vuelta a tu centro de control financiero
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Accede a tu cuenta para continuar gestionando tus finanzas y alcanzando tus metas de ahorro.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur">
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Dashboard Intuitivo</p>
                  <p className="text-sm text-primary-foreground/70">Visualiza tus finanzas de un vistazo</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur">
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Datos Seguros</p>
                  <p className="text-sm text-primary-foreground/70">Tu información siempre protegida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FinZen</span>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta para gestionar tus finanzas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log("Login con Google falló");
                }}
                />
            </GoogleOAuthProvider>


              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    o
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                <Mail className="w-5 h-5 mr-3" />
                Continuar con Email
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Al continuar, aceptas nuestros{" "}
                <Link href="#" className="text-primary hover:underline">
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link href="#" className="text-primary hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes una cuenta?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}