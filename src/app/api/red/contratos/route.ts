import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ContratoSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [total, contratos] = await Promise.all([
      prisma.contract.count(),
      prisma.contract.findMany({ 
        skip, 
        take: limit, 
        orderBy: { createdAt: "desc" },
        include: { customer: true, plan: true, routerNode: true }
      }),
    ]);

    return NextResponse.json({ data: contratos, meta: { total, page, limit } });
  } catch (error) {
    console.error("GET Contratos Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const parsed = ContratoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const nuevoContrato = await prisma.contract.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: nuevoContrato }, { status: 201 });
  } catch (error) {
    console.error("POST Contrato Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
