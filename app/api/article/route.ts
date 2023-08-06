import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { tokenKey } from "@/utils/config";
import { NextResponse, NextRequest } from "next/server";

interface Param {
  id?: string;
  name: string;
  coverUrl: string;
  content: string;
  sort: string[];
  status?: boolean;
}

async function getArticleMany(name: string) {
  const result = await prisma.articleList.findMany({
    select: {
      id: true,
      name: true,
      sort: true,
      status: true,
      createAt: true,
      updateAt: true,
    },
    where: {
      name: {
        contains: name,
      },
    },
  });
  return result;
}

async function getArticleUnique(id: string) {
  const result = await prisma.articleList.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      sort: true,
      status: true,
      coverUrl: true,
      content: true,
    },
  });

  return result;
}

async function addArticle({ name, coverUrl, content, sort, status }: Param) {
  const article = await prisma.articleList.create({
    data: {
      name,
      coverUrl,
      content,
      sort: sort.join(","),
      status,
    },
  });
  return article;
}

async function updateArticle({
  id,
  name,
  coverUrl,
  content,
  sort,
  status,
}: Param) {
  const result = await prisma.articleList.update({
    where: {
      id,
    },
    data: {
      name,
      coverUrl,
      content,
      sort: sort.join(","),
      status,
      updateAt: new Date(),
    },
  });
  return result;
}

function handleVerifyToken(token: string | null) {
  return new Promise((resolve, reject) => {
    if (!token) {
      resolve("none");
    } else {
      let target = token.replace("Bearn ", "");
      jwt.verify(target, tokenKey, (err) => {
        if (err) {
          resolve("invalid");
        } else {
          resolve("success");
        }
      });
    }
  });
}

export async function GET(req: NextRequest) {
  let token: string | null = req.headers.get("authorization");
  const tokenRes = await handleVerifyToken(token);

  switch (tokenRes) {
    case "none": {
      return NextResponse.json({
        code: 401,
        msg: "token无效，请重新登录!",
      });
    }
    case "invalid": {
      return NextResponse.json({
        code: 401,
        msg: "token失效，请重新登录!",
      });
    }
  }

  let name: string = req.nextUrl.searchParams.get("name") || "";
  let id: string = req.nextUrl.searchParams.get("id") || "";
  let type: string = req.nextUrl.searchParams.get("type") || "";

  switch (type) {
    case "many": {
      const result = await getArticleMany(name);
      return NextResponse.json({
        code: 200,
        data: result,
      });
    }
    default: {
      const result: any = await getArticleUnique(id);
      return NextResponse.json({
        code: 200,
        data: { ...result },
      });
    }
  }
}

export async function POST(ctx: NextRequest) {
  let token: string | null = ctx.headers.get("authorization");
  const tokenRes = await handleVerifyToken(token);

  switch (tokenRes) {
    case "none": {
      return NextResponse.json({
        code: 401,
        msg: "token无效，请重新登录!",
      });
    }
    case "invalid": {
      return NextResponse.json({
        code: 401,
        msg: "token失效，请重新登录!",
      });
    }
  }

  const { id, name, coverUrl, sort, status, content, type } = await ctx.json();
  const info: any = {
    name,
    coverUrl,
    content,
    sort,
  };

  const tip: any = {
    name: "文章名称不能为空",
    coverUrl: "文章封面不能为空",
    content: "文章内容不能为空",
    sort: "文章种类不能为空",
  };

  for (let key in info) {
    if (!info[key]) {
      const data = {
        code: 400,
        msg: tip[key],
      };
      return NextResponse.json(data);
    }
  }

  switch (type) {
    case "edit": {
      const param: Param = { id, name, coverUrl, sort, status, content };
      const result = await updateArticle(param);
      if (result) {
        return NextResponse.json({
          code: 200,
          data: result,
          msg: "编辑成功！",
        });
      } else {
        return NextResponse.json({
          code: 400,
          msg: "系统异常，请稍后再试",
        });
      }
    }
    case "add": {
      const param: Param = { name, coverUrl, sort, status, content };
      const result = await addArticle(param);

      if (result) {
        return NextResponse.json({
          code: 200,
          data: result,
          msg: "添加成功！",
        });
      } else {
        return NextResponse.json({
          code: 400,
          msg: "系统异常，请稍后再试",
        });
      }
    }
  }
}

export async function DELETE(req: NextRequest) {
  let token: string | null = req.headers.get("authorization");
  const tokenRes = await handleVerifyToken(token);

  switch (tokenRes) {
    case "none": {
      return NextResponse.json({
        code: 401,
        msg: "token无效，请重新登录!",
      });
    }
    case "invalid": {
      return NextResponse.json({
        code: 401,
        msg: "token失效，请重新登录!",
      });
    }
  }
  let id: string = req.nextUrl.searchParams.get("id") || "";

  const delInfo = await prisma.articleList.delete({
    where: {
      id,
    },
  });

  if (delInfo) {
    return NextResponse.json({
      code: 200,
      msg: "删除成功!",
    });
  } else {
    return NextResponse.json({
      code: 400,
      msg: "暂无该文章数据",
    });
  }
}
