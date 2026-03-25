"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-background">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Panel de Control</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-right hidden md:block">
            <p className="leading-none mb-1">Administrador</p>
            <p className="text-xs text-muted-foreground">SuperAdmin</p>
          </div>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
