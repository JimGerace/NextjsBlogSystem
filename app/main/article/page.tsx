"use client";
import "./article.scss";
import { useCallback, useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Button, Table, Tag, Switch, Modal, Spin } from "antd";
import AddArticle from "@/components/AddArticle";
import { formDate, TipToast } from "@/utils/tools";
import { useRouter } from "next/navigation";
import { ArticleList, ArticleDetail, DelArticle } from "@/network/index";

const { Search } = Input;
const { Column } = Table;
const { confirm } = Modal;

export default function Article() {
  const router = useRouter();
  const [pageType, setPageType] = useState<string>("");
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [tableData, setTableData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articleInfo, setArticleInfo] = useState<Object | null>(null);

  useEffect(() => {
    getArticleList("");
  }, []);

  // 获取文章列表
  const getArticleList = async (query: string) => {
    setIsLoading(true);
    ArticleList({
      type: "many",
      name: query,
    })
      .then((res: any) => {
        if (res.code == 200) {
          let list = res.data.map((item: any) => {
            return {
              ...item,
              createAt: formDate(item.createAt, "yyyy-mm-dd hh:mm:ss"),
              updateAt: formDate(item.updateAt, "yyyy-mm-dd hh:mm:ss"),
              sort: item.sort.includes(",")
                ? item.sort.split(",")
                : [item.sort],
            };
          });
          setTableData(list);
        } else if (res.code == 400) {
          setTableData([]);
          TipToast(res.msg || "网络异常，请稍后再试");
        } else {
          TipToast(res.msg, "error", () => {
            router.replace("/login");
            window.history.pushState(null, "", document.URL);
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 点击搜索按钮
  const onSearch = (val: string) => {
    setQuery(val);
    getArticleList(val);
  };

  // 关闭对话框
  const closeModal = useCallback(
    (val: boolean) => {
      setIsAdd(false);
      setPageType("");
      setArticleInfo(null);
      val && getArticleList(query);
    },
    [isAdd]
  );

  // 点击删除按钮
  const toDelInfo = (val: any) => {
    confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "确认删除该文章？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteArticle(val.id);
      },
    });
  };

  // 点击编辑 / 详情按钮
  const toViewInfo = async (id: string, type: string) => {
    setPageType(type);
    setIsLoading(true);
    ArticleDetail({
      type: "unique",
      id,
    })
      .then((res: any) => {
        if (res.code == 200) {
          setArticleInfo(res.data);
          setIsAdd(true);
        } else if (res.code == 400) {
          TipToast(res.msg || "网络异常，请稍后再试");
        } else {
          TipToast(res.msg, "error", () => {
            router.replace("/login");
            window.history.pushState(null, "", document.URL);
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 删除接口
  const deleteArticle = async (id: string) => {
    setIsLoading(true);
    DelArticle({ id })
      .then((res: any) => {
        if (res.code == 200) {
          TipToast(res.msg, "success");
          getArticleList(query);
        } else if (res.code == 400) {
          TipToast(res.msg);
        } else {
          TipToast(res.msg, "error", () => {
            router.replace("/login");
            window.history.pushState(null, "", document.URL);
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="article_page">
      <div className="search_box">
        <Search
          addonBefore="文章名称"
          placeholder="请输入"
          allowClear
          enterButton
          onSearch={onSearch}
          style={{ width: 400 }}
        />

        <Button
          className="btn_add_article"
          type="primary"
          onClick={() => setIsAdd(true)}
        >
          添加文章
        </Button>
      </div>

      <div className="table_box">
        <Spin size="large" spinning={isLoading}>
          <Table dataSource={tableData} bordered>
            <Column
              align="center"
              title="文章名称"
              dataIndex="name"
              key="name"
            />
            <Column
              align="center"
              title="文章类型"
              dataIndex="sort"
              key="sort"
              render={(sort: string[]) => (
                <>
                  {sort.map((item) => (
                    <Tag color="blue" key={item}>
                      {item}
                    </Tag>
                  ))}
                </>
              )}
            />

            <Column
              align="center"
              title="文章状态"
              dataIndex="status"
              key="status"
              width={120}
              render={(text) => <Switch checked={text} disabled />}
            />
            <Column
              align="center"
              title="创建时间"
              dataIndex="createAt"
              key="createAt"
              width={200}
            />
            <Column
              align="center"
              title="更新时间"
              dataIndex="updateAt"
              key="updateAt"
              width={200}
            />

            <Column
              align="center"
              title="操作"
              key="action"
              width={250}
              render={(_: any, record: any) => (
                <>
                  <Button
                    type="primary"
                    onClick={() => toViewInfo(record.id, "view")}
                  >
                    详情
                  </Button>
                  <Button
                    type="primary"
                    className="btn_del"
                    onClick={() => toViewInfo(record.id, "edit")}
                  >
                    编辑
                  </Button>
                  <Button
                    className="btn_del"
                    type="primary"
                    danger
                    onClick={() => toDelInfo(record)}
                  >
                    删除
                  </Button>
                </>
              )}
            />
          </Table>
        </Spin>
      </div>

      {isAdd ? (
        <AddArticle
          close={closeModal}
          articleInfo={articleInfo}
          pageType={pageType}
        />
      ) : (
        ""
      )}
    </div>
  );
}
