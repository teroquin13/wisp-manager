import { NextResponse } from "next/server";
import { RouterOSClient } from "routeros-client";
import { PrismaClient } from "@prisma/client";

// Workaround para Next.js en APIs sueltas sin el context global
const prisma = new PrismaClient();

export async function GET() {
  const client = new RouterOSClient({
    host: "45.225.224.233",
    user: "tero",
    password: "terokin13",
    port: 60000
  });

  try {
    console.log("Conectando al router MikroTik en 45.225.224.233:60000...");
    const conn = await client.connect();
    
    // Obtenemos la identidad del sistema como prueba
    console.log("Conectado con éxito. Obteniendo /system/identity...");
    const identityMenu = conn.menu('/system/identity');
    const identity = await identityMenu.get();
    
    // Cerramos la conexión de forma segura
    client.close();
    
    // Verificamos si ya existe el router
    let node = await prisma.routerNode.findFirst({
      where: { ipAddress: "45.225.224.233" }
    });

    if (!node) {
      node = await prisma.routerNode.create({
        data: {
          name: "MikroTik Principal",
          ipAddress: "45.225.224.233",
          apiUser: "tero",
          apiPass: "terokin13",
          location: "Servidor Principal"
        }
      });
      console.log("Router guardado en la base de datos:", node.id);
    }

    return NextResponse.json({
      success: true,
      message: "¡Conexión exitosa y router vinculado en la base de datos!",
      identity: identity,
      node: node
    });
  } catch (error: any) {
    console.error("Error al conectar con MikroTik:", error);
    
    // Intentamos cerrar la conexión por si quedó abierta
    client.close().catch(() => {});

    return NextResponse.json(
      { 
        success: false, 
        message: "Falló la conexión al MikroTik",
        error: error.message || String(error) 
      },
      { status: 500 }
    );
  }
}
