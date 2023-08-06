import prisma from "@/lib/db";
import NodeRSA from "node-rsa";
import jwt from "jsonwebtoken";
import { privateKey, tokenKey } from "@/utils/config";
import { NextResponse, NextRequest } from "next/server";

// 生成token
function createdToken(payload: object) {
  return jwt.sign(payload, tokenKey, { expiresIn: "6h" });
}

// RSA -- 解密
function RSADecrypt(word: string) {
  const RSA: NodeRSA = new NodeRSA(privateKey, "pkcs1-private-pem", {
    encryptionScheme: "pkcs1",
  });
  return RSA.decrypt(word, "utf8");
}

export async function POST(ctx: NextRequest) {
  const { username, password } = await ctx.json();
  const GET_RES = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!GET_RES) {
    return NextResponse.json({
      code: 400,
      msg: "暂无该用户信息!",
    });
  }

  if (RSADecrypt(GET_RES.password) === RSADecrypt(password)) {
    const token = createdToken({ id: GET_RES.id, username, password });
    return NextResponse.json({
      code: 200,
      token: `Bearn ${token}`,
      msg: "登录成功！",
    });
  } else {
    return NextResponse.json({
      code: 400,
      msg: "账号或密码有误！",
    });
  }
}
