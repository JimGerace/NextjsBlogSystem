import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(ctx: NextRequest) {
  const { username, password } = await ctx.json();
  if (!username || !password) {
    return NextResponse.json({
      code: 400,
      msg: "注册信息项不能为空",
    });
  } else if (username.length < 6 || password.length < 6) {
    return NextResponse.json({
      code: 400,
      msg: "注册信息格式有误!",
    });
  }

  const GET_RES = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!GET_RES) {
    await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    return NextResponse.json({
      code: 200,
      msg: "注册成功!",
    });
  } else {
    return NextResponse.json({
      code: 400,
      msg: "该用户名已被占用",
    });
  }
}
