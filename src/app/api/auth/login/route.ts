import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sbFetch } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 422 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const res = await sbFetch<
    { id: string; email: string; password_hash: string; status: string }[]
  >(
    `contractors?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,status`
  );

  const row = Array.isArray(res.data) ? res.data[0] : null;
  if (!row) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, row.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (row.status !== "active") {
    return NextResponse.json(
      {
        error: "Subscription inactive",
        code: "INACTIVE",
        message: "Complétez le paiement sur /entrepreneurs",
      },
      { status: 403 }
    );
  }

  await setSessionCookie({ contractorId: row.id, email: row.email });
  return NextResponse.json({ success: true });
}
