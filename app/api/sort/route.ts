import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sortlist = await prisma.articleSort.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return NextResponse.json({
    code: 200,
    data: sortlist,
  });
}
