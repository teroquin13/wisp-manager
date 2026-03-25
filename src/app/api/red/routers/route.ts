import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RouterSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [total, routers] = await Promise.all([
      prisma.routerNode.count(),
      prisma.routerNode.findMany({ 
        skip, 
        take: limit, 
        orderBy: { createdAt: "desc" }
      }),
    ]);

    return NextResponse.json({ data: routers, meta: { total, page, limit } });
  } catch (error) {
    console.error("GET Routers Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const parsed = RouterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const nuevoRouter = await prisma.routerNode.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: nuevoRouter }, { status: 201 });
  } catch (error) {
    console.error("POST Router Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
