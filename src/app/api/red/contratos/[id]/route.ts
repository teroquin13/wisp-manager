import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ContratoSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const contrato = await prisma.contract.findUnique({ 
      where: { id },
      include: { customer: true, plan: true, routerNode: true }
    });

    if (!contrato) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: contrato });
  } catch (error) {
    console.error("GET Contrato ID Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.contract.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = ContratoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const updatedContrato = await prisma.contract.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updatedContrato });
  } catch (error) {
    console.error("PUT Contrato Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }

    await prisma.contract.delete({ where: { id } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE Contrato Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al eliminar contrato" }, { status: 500 });
  }
}
