"use client";
import { useTransition } from "react";
import { updateStatus } from "./actions";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => updateStatus(id, e.target.value as any))}
    >
      {["NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}
