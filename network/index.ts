import api from "./config";

export function loginIn(data: object) {
  return api({
    url: "/api/login",
    method: "POST",
    data,
  });
}

export function RegisterIn(data: object) {
  return api({
    url: "/api/register",
    method: "POST",
    data,
  });
}

export function ArticleList(params: object) {
  return api({
    url: "/api/article",
    method: "GET",
    params,
  });
}

export function ArticleDetail(params: object) {
  return api({
    url: "/api/article",
    method: "GET",
    params,
  });
}

export function ArticleSort() {
  return api({
    url: "/api/sort",
    method: "GET",
  });
}

export function UpdateArticle(data: Object) {
  return api({
    url: "/api/article",
    method: "POST",
    data,
  });
}

export function DelArticle(params: Object) {
  return api({
    url: "/api/article",
    method: "DELETE",
    params,
  });
}
