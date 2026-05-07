"use client";

import { Camera, Save, User, Mail, Globe, Target, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard-header";
import { mockUser } from "@/lib/mock-data";


import {completeProfile,CompleteProfileRequest,getProfile,getUser} from "@/src/services/profileService";
import { useEffect, useState } from "react";



const currencies = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'COP', label: 'Peso Colombiano (COP)' },
  { value: 'ARS', label: 'Peso Argentino (ARS)' },
  { value: 'CLP', label: 'Peso Chileno (CLP)' },
  { value: 'PEN', label: 'Sol Peruano (PEN)' },
];

const countries = [
  'México', 'Estados Unidos', 'España', 'Colombia', 'Argentina', 
  'Chile', 'Perú', 'Ecuador', 'Venezuela', 'Guatemala'
];

export default function ProfilePage() {
 const [user, setUser] = useState<getUser | null>(null);
 const[uptadeuser,setUpdateUser] = useState<CompleteProfileRequest>({
    nombre: '',
    idGenero: 0,
    fechaNacimiento: '',
    salario: 0,
    idOcupacion: 0,
 });

 const [isEditing, setIsEditing] = useState(false);
 const [loading, setLoading] = useState(true);

   useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token");
      }

      const data = await getProfile(token);
      setUser(data);

      setUpdateUser({
        nombre: data.nombre || "",
        idGenero: data.idGenero || 0,
        fechaNacimiento: data.fechaNacimiento ?? "",
        salario: data.salario || 0,
        idOcupacion: data.idOcupacion || 0,
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


 useEffect(() => {
     const fetchProfile = async () => {
       try {
         const token = localStorage.getItem("token");
 
         if (!token) {
           throw new Error("No hay token");
         }
 
         const data = await getProfile(token);
         setUser(data);
       } catch (error) {
         console.error("Error cargando perfil:", error);
       } finally {
         setLoading(false);
       }
     };
 
     fetchProfile();
   }, []);

   if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">No se pudo cargar el usuario</p>;
  }



 const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) return;

    await completeProfile(user.id, uptadeuser, token);

    const refreshedUser = await getProfile(token);

    setUser(refreshedUser);

    setUpdateUser({
      nombre: refreshedUser.nombre ?? "",
      idGenero: refreshedUser.idGenero ?? 0,
      fechaNacimiento: refreshedUser.fechaNacimiento
        ? refreshedUser.fechaNacimiento.substring(0, 10)
        : "",
      salario: refreshedUser.salario ?? 0,
      idOcupacion: refreshedUser.idOcupacion ?? 0,
    });

    setIsEditing(false);
  } catch (error) {
    console.error("Error actualizando perfil:", error);
  }
};

  return (
    <>
      <DashboardHeader 
        title="Mi Perfil"
        subtitle="Gestiona tu información personal"
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-primary/20">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{user?.nombre}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">País</span>
                    </div>
                    <span className="text-sm font-medium"> 'Colombia'</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Salario</span>
                    </div>
                    <span className="text-sm font-medium">
                        ${(user?.salario ?? 0).toFixed(2)}
                        </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Meta</span>
                    </div>
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {'Sin definir'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos de perfil</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={uptadeuser.nombre}
                      onChange={(e) => setUpdateUser({ ...uptadeuser, nombre: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="email"
                        type="email"
                        value={user?.email ?? ""}
                        disabled
                        className="pl-10"
                        />
                    </div>
                    </div>

                <div className="space-y-2">
                <Label>Fecha de nacimiento</Label>
                <Input
                    type="date"
                    value={uptadeuser.fechaNacimiento?.substring(0, 10) ?? ""}
                    onChange={(e) =>
                        setUpdateUser({
                        ...uptadeuser,
                        fechaNacimiento: e.target.value,
                        })
                    }
                    disabled={!isEditing}
                    />
                </div>

            
            </div>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                
                <div className="space-y-2">
                    <Label>Género</Label>
                    <select
                        value={uptadeuser.idGenero}
                        onChange={(e) =>
                        setUpdateUser({
                            ...uptadeuser,
                            idGenero: Number(e.target.value),
                        })
                        }
                        disabled={!isEditing}
                        className="w-full p-2 border rounded"
                    >
                        <option value={0}>Seleccionar</option>
                        <option value={1}>Masculino</option>
                        <option value={2}>Femenino</option>
                    </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Ocupación</Label>
                        <select
                            value={uptadeuser.idOcupacion}
                            onChange={(e) =>
                            setUpdateUser({
                                ...uptadeuser,
                                idOcupacion: Number(e.target.value),
                            })
                            }
                            disabled={!isEditing}
                            className="w-full p-2 border rounded"
                        >
                            <option value={0}>Seleccionar</option>
                            <option value={1}>Estudiante</option>
                            <option value={2}>Empleado</option>
                            <option value={3}>Independiente</option>
                        </select>
                        </div>
                


              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Salario</Label>
                <Input
                    type="number"
                    value={uptadeuser.salario}
                    onChange={(e) =>
                    setUpdateUser({
                        ...uptadeuser,
                        salario: Number(e.target.value),
                    })
                    }
                    disabled={!isEditing}
                />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de tu Cuenta</CardTitle>
            <CardDescription>Estadísticas generales de tu actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">Meses Registrados</p>
                <p className="text-2xl font-bold text-primary">4</p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <p className="text-sm text-muted-foreground">Transacciones</p>
                <p className="text-2xl font-bold text-success">127</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-sm text-muted-foreground">Categorías Activas</p>
                <p className="text-2xl font-bold text-accent">8</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
                <p className="text-sm text-muted-foreground">Presupuestos Creados</p>
                <p className="text-2xl font-bold text-warning">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}