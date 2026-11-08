import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "./StatusSelect";

async function InquiryTable() {
  const items = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Company</th><th>Contact</th>
          <th>Route</th><th>Forklift</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.createdAt.toLocaleDateString()}</td>
            <td>{i.companyName}</td>
            <td>{i.name}<br />{i.email} · {i.phone}</td>
            <td>{i.collSuburb} → {i.delSuburb}</td>
            <td>{i.forklift}</td>
            <td><StatusSelect id={i.id} status={i.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Admin() {
  return (
    <main>
      <h1>Inquiries</h1>
      <Suspense fallback={<p>Loading inquiries…</p>}>
        <InquiryTable />
      </Suspense>
    </main>
  );
}           
