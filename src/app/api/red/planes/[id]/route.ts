import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PlanSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const plan = await prisma.connectionPlan.findUnique({ 
      where: { id },
      include: { contracts: true }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("GET Plan ID Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.connectionPlan.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = PlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const updatedPlan = await prisma.connectionPlan.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updatedPlan });
  } catch (error) {
    console.error("PUT Plan Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.connectionPlan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    await prisma.connectionPlan.delete({ where: { id } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE Plan Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al eliminar plan" }, { status: 500 });
  }
}
