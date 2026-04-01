"use client";

import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    currency: mockUser.currency,
    country: mockUser.country,
    financialGoal: mockUser.financialGoal || '',
  });

  const handleSave = () => {
    // Here you would save to backend
    setIsEditing(false);
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
                <h2 className="mt-4 text-xl font-semibold">{formData.name}</h2>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">País</span>
                    </div>
                    <span className="text-sm font-medium">{formData.country}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Moneda</span>
                    </div>
                    <span className="text-sm font-medium">{formData.currency}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Meta</span>
                    </div>
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {formData.financialGoal || 'Sin definir'}
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">País o Región</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda Preferida</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="financialGoal">Meta Financiera (Opcional)</Label>
                <Textarea
                  id="financialGoal"
                  placeholder="Ej: Ahorrar para un viaje, comprar una casa, fondo de emergencia..."
                  value={formData.financialGoal}
                  onChange={(e) => setFormData({ ...formData, financialGoal: e.target.value })}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Define una meta que te motive a mejorar tus finanzas
                </p>
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
