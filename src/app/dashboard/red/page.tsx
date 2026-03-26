import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RadioTower, Activity } from "lucide-react";
import prisma from "@/lib/prisma";
import { AddRouterDialog } from "./add-router-dialog";

export default async function RedPage() {
  const nodes = await prisma.routerNode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contracts: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Red y Nodos Router</h1>
          <p className="text-muted-foreground mt-1">Administra tus conexiones a MikroTik y puntos de acceso.</p>
        </div>
        <AddRouterDialog />
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Nodo</TableHead>
              <TableHead>Dirección IP</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="text-right">Clientes Conectados</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay nodos registrados en la red.
                </TableCell>
              </TableRow>
            ) : (
              nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <RadioTower className="h-4 w-4 text-muted-foreground" />
                    {node.name}
                  </TableCell>
                  <TableCell>{node.ipAddress}</TableCell>
                  <TableCell>{node.location || "N/A"}</TableCell>
                  <TableCell className="text-right">{node._count.contracts}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                      <Activity className="h-3 w-3" />
                      En línea
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
