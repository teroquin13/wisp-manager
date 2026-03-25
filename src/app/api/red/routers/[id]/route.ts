import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RouterSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const router = await prisma.routerNode.findUnique({ 
      where: { id },
      include: { contracts: true }
    });

    if (!router) {
      return NextResponse.json({ error: "Router no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: router });
  } catch (error) {
    console.error("GET Router ID Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.routerNode.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Router no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = RouterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const updatedRouter = await prisma.routerNode.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updatedRouter });
  } catch (error) {
    console.error("PUT Router Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.routerNode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Router no encontrado" }, { status: 404 });
    }

    await prisma.routerNode.delete({ where: { id } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE Router Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al eliminar router" }, { status: 500 });
  }
}
