import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRouterUptimeAndCpu } from "@/lib/snmp";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const node = await prisma.routerNode.findUnique({ where: { id: params.id } });
    
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    // Call SNMP helper
    try {
      const stats: any = await getRouterUptimeAndCpu(node.ipAddress);
      return NextResponse.json({
        data: {
          uptime: stats.uptime, // Timeticks
          cpu: stats.cpu,
          status: "ONLINE"
        }
      });
    } catch (snmpError) {
      console.error("SNMP Error for node", node.ipAddress, snmpError);
      return NextResponse.json({
        data: { status: "OFFLINE", error: "Connection timeout" }
      });
    }

  } catch (error) {
    console.error("GET Node Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
