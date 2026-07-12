import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { sbFetch } from "@/lib/db";
import { PLANS, type PlanId } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ leadId: z.string().uuid() });

function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid leadId" }, { status: 422 });
  }

  const { leadId } = parsed.data;

  const cRes = await sbFetch<
    {
      id: string;
      status: string;
      plan: string;
      trade: string;
      claims_this_month: number;
      claims_month: string | null;
    }[]
  >(
    `contractors?id=eq.${session.contractorId}&select=id,status,plan,trade,claims_this_month,claims_month`
  );
  const contractor = Array.isArray(cRes.data) ? cRes.data[0] : null;
  if (!contractor || contractor.status !== "active") {
    return NextResponse.json({ error: "Subscription inactive" }, { status: 403 });
  }

  const plan = PLANS[(contractor.plan as PlanId) || "starter"] || PLANS.starter;
  let claims = contractor.claims_this_month || 0;
  const mk = monthKey();
  if (contractor.claims_month !== mk) {
    claims = 0;
  }
  if (plan.claimLimit !== null && claims >= plan.claimLimit) {
    return NextResponse.json(
      {
        error: "Monthly limit reached",
        code: "LIMIT",
        limit: plan.claimLimit,
      },
      { status: 403 }
    );
  }

  // Load lead — must be unclaimed
  const lRes = await sbFetch<
    {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      project_type: string;
      city: string | null;
      message: string | null;
      claimed_by: string | null;
    }[]
  >(
    `quote_leads?id=eq.${leadId}&select=id,name,email,phone,project_type,city,message,claimed_by`
  );
  const lead = Array.isArray(lRes.data) ? lRes.data[0] : null;
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (lead.claimed_by) {
    return NextResponse.json(
      { error: "Already claimed", code: "TAKEN" },
      { status: 409 }
    );
  }

  // Atomic-ish claim: only if claimed_by is null
  const claim = await sbFetch(
    `quote_leads?id=eq.${leadId}&claimed_by=is.null`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({
        claimed_by: contractor.id,
        claimed_at: new Date().toISOString(),
        status: "claimed",
      }),
    }
  );

  if (!claim.ok) {
    return NextResponse.json(
      { error: "Claim failed", details: claim.text.slice(0, 200) },
      { status: 502 }
    );
  }

  const claimedRows = claim.data as { id: string }[] | null;
  if (!Array.isArray(claimedRows) || claimedRows.length === 0) {
    return NextResponse.json(
      { error: "Already claimed", code: "TAKEN" },
      { status: 409 }
    );
  }

  await sbFetch(`contractors?id=eq.${contractor.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      claims_this_month: claims + 1,
      claims_month: mk,
    }),
  });

  return NextResponse.json({
    success: true,
    lead: {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      project_type: lead.project_type,
      city: lead.city,
      message: lead.message,
    },
  });
}
