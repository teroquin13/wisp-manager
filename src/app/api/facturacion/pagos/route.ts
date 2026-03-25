import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PagoSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [total, pagos] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.findMany({ 
        skip, 
        take: limit, 
        orderBy: { createdAt: "desc" },
        include: { invoice: true, customer: true }
      }),
    ]);

    return NextResponse.json({ data: pagos, meta: { total, page, limit } });
  } catch (error) {
    console.error("GET Pagos Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const parsed = PagoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Error de validación", details: parsed.error.issues }, 
        { status: 400 }
      );
    }

    // Additionally check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id: parsed.data.invoiceId }
    });

    if (!invoice) {
        return NextResponse.json({ error: "La factura enviada no existe" }, { status: 404 });
    }

    const nuevoPago = await prisma.payment.create({
      data: parsed.data,
    });

    // Option: Automatically update invoice status if payment covers the amount
    // ...

    return NextResponse.json({ data: nuevoPago }, { status: 201 });
  } catch (error) {
    console.error("POST Pago Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
