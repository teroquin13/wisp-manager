import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FacturaSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const factura = await prisma.invoice.findUnique({ 
      where: { id },
      include: { customer: true, payments: true }
    });

    if (!factura) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ data: factura });
  } catch (error) {
    console.error("GET Factura ID Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const existing = await prisma.invoice.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
    }

    const body = await req.json();
    
    // Partial updates or full updates
    if (body.dueDate && typeof body.dueDate === 'string') {
      body.dueDate = new Date(body.dueDate);
    }

    const parsed = FacturaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const updatedFactura = await prisma.invoice.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updatedFactura });
  } catch (error) {
    console.error("PUT Factura Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE Factura Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al eliminar facturas" }, { status: 500 });
  }
}
