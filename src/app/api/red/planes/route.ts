import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PlanSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [total, planes] = await Promise.all([
      prisma.connectionPlan.count(),
      prisma.connectionPlan.findMany({ 
        skip, 
        take: limit, 
        orderBy: { name: "asc" }
      }),
    ]);

    return NextResponse.json({ data: planes, meta: { total, page, limit } });
  } catch (error) {
    console.error("GET Planes Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const parsed = PlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    const nuevoPlan = await prisma.connectionPlan.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: nuevoPlan }, { status: 201 });
  } catch (error) {
    console.error("POST Plan Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
