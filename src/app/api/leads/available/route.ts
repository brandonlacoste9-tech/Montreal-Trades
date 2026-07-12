import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sbFetch } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cRes = await sbFetch<
    { id: string; status: string; plan: string; trade: string; name: string }[]
  >(
    `contractors?id=eq.${session.contractorId}&select=id,status,plan,trade,name`
  );
  const contractor = Array.isArray(cRes.data) ? cRes.data[0] : null;
  if (!contractor || contractor.status !== "active") {
    return NextResponse.json({ error: "Inactive" }, { status: 403 });
  }

  // Open leads (masked until claim) — last 50
  const open = await sbFetch<
    {
      id: string;
      project_type: string;
      city: string | null;
      language: string;
      created_at: string;
      message: string | null;
    }[]
  >(
    `quote_leads?claimed_by=is.null&status=eq.new&order=created_at.desc&limit=50&select=id,project_type,city,language,created_at,message`
  );

  const mine = await sbFetch<
    {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      project_type: string;
      city: string | null;
      message: string | null;
      claimed_at: string | null;
    }[]
  >(
    `quote_leads?claimed_by=eq.${contractor.id}&order=claimed_at.desc&limit=30&select=id,name,email,phone,project_type,city,message,claimed_at`
  );

  return NextResponse.json({
    contractor: {
      name: contractor.name,
      trade: contractor.trade,
      plan: contractor.plan,
    },
    open: Array.isArray(open.data) ? open.data : [],
    claimed: Array.isArray(mine.data) ? mine.data : [],
  });
}
