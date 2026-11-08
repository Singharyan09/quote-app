import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  companyName: z.string().min(1),
  collStreet: z.string().min(1), collSuburb: z.string().min(1),
  collState: z.string().min(2),  collPostcode: z.string().length(4),
  delStreet: z.string().min(1),  delSuburb: z.string().min(1),
  delState: z.string().min(2),   delPostcode: z.string().length(4),
  forklift: z.enum(["yes", "no", "unsure"]),
  notes: z.string().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { website, ...data } = parsed.data;
  const inquiry = await prisma.inquiry.create({ data });

  // Email failure shouldn't lose the lead, so it's caught separately
  try {
    await resend.emails.send({
      from: "Quotes <onboarding@resend.dev>", // use your verified domain in production
      to: process.env.NOTIFY_EMAIL!,
      replyTo: data.email,
      subject: `New quote request: ${data.companyName}`,
      text: `${data.name} (${data.phone})\n${data.collSuburb} → ${data.delSuburb}\nForklift: ${data.forklift}\n\n${data.notes ?? ""}\n\nView: ${process.env.NEXT_PUBLIC_SITE_URL}/admin`,
    });
  } catch (e) {
    console.error("Email failed", e);
  }

  return NextResponse.json({ ok: true, id: inquiry.id });
}
