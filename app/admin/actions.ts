"use server";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateStatus(id: string, status: Status) {
	await prisma.inquiry.update({ where: { id }, data: { status } });
	revalidatePath("/admin");
}
