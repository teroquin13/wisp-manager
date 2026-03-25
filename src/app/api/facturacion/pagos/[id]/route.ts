import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PagoSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const pago = await prisma.payment.findUnique({ 
      where: { id },
      include: { invoice: true, customer: true }
    });

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: pago });
  } catch (error) {
    console.error("GET Pago ID Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.payment.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = PagoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const updatedPago = await prisma.payment.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updatedPago });
  } catch (error) {
    console.error("PUT Pago Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.payment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    await prisma.payment.delete({ where: { id } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE Pago Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al eliminar pago" }, { status: 500 });
  }
}
