"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddRouterDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      ipAddress: formData.get("ipAddress"),
      apiUser: formData.get("apiUser"),
      apiPass: formData.get("apiPass"),
      location: formData.get("location"),
    };

    try {
      const res = await fetch("/api/red/routers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al agregar el nodo");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Nodo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vincular Equipo MikroTik</DialogTitle>
          <DialogDescription>
            Ingresa las credenciales de tu router MikroTik. Asegúrate de incluir la IP Pública y el puerto si lo cambiaste (ej. 45.225.224.233:60000).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm font-medium text-red-500">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Equipo (Identificador)</Label>
            <Input id="name" name="name" placeholder="Ej: Nodo Principal CCR-1009" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipAddress">Dirección IP o Dominio (Pública)</Label>
            <Input id="ipAddress" name="ipAddress" placeholder="Ej: 45.225.224.233:60000" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiUser">Usuario API (WebFig/REST)</Label>
            <Input id="apiUser" name="apiUser" placeholder="Ej: admin" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiPass">Contraseña API</Label>
            <Input id="apiPass" name="apiPass" type="password" placeholder="••••••••" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación (Opcional)</Label>
            <Input id="location" name="location" placeholder="Ej: Torre Central" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Conectando..." : "Vincular Router"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
