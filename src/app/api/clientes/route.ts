import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ClienteSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [total, clientes] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.findMany({ 
        skip, 
        take: limit, 
        orderBy: { createdAt: "desc" } 
      }),
    ]);

    return NextResponse.json({ data: clientes, meta: { total, page, limit } });
  } catch (error) {
    console.error("GET Clientes Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const parsed = ClienteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const newCliente = await prisma.customer.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: newCliente }, { status: 201 });
  } catch (error) {
    console.error("POST Cliente Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
