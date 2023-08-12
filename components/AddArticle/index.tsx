"use client";
import { memo, useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, Form, Input, Select, Switch, Spin, Modal, Image } from "antd";
import Editor from "for-editor";
import { ArticleSort, UpdateArticle } from "@/network/index";
import { TipToast } from "@/utils/tools";
import { useRouter } from "next/navigation";

interface Prop {
  close: Function;
  pageType: string;
  articleInfo: Article | unknown;
}
interface Article {
  id: string;
  name: string;
  sort: string;
  coverUrl: string;
  status: boolean;
  content: string;
}

const toolbar = {
  h1: true, // h1
  h2: true, // h2
  h3: true, // h3
  h4: true, // h4
  img: false, // 图片
  link: true, // 链接
  code: true, // 代码块
  preview: true, // 预览
  expand: true, // 全屏
  undo: true, // 撤销
  redo: true, // 重做
  save: true, // 保存
  subfield: true, // 单双栏模式
};

const detailToolBar = {
  preview: true, // 预览
  expand: true, // 全屏
  subfield: true, // 单双栏模式
};

function AddArticle({ close, articleInfo, pageType }: Prop) {
  const router = useRouter();
  const FormRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [sortlist, setSortlist] = useState<[]>([]);
  const [sort, setSort] = useState<string[]>([]);
  const [status, setStatus] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    init();
    getSortList();
  }, []);

  // 初始化数据
  const init = () => {
    if (articleInfo) {
      const { id, name, coverUrl, sort, content, status } =
        articleInfo as Article;

      let resSort: string[] = sort.includes(",") ? sort.split(",") : [sort];
      setId(id);
      setName(name);
      setSort(resSort);
      setStatus(status);
      setCoverUrl(coverUrl);
      setContent(content);

      let target = {
        id,
        name,
        sort: resSort,
        status,
        coverUrl,
        content,
      };

      (FormRef.current as any).setFieldsValue(target);
    }
  };

  // 获取文章种类列表
  const getSortList = async () => {
    setLoading(true);
    ArticleSort()
      .then((res: any) => {
        if (res.code == 200) {
          let list = res.data.map((item: any) => {
            return {
              value: item.name,
              label: item.name,
            };
          });
          setSortlist(list);
        } else {
          setSortlist([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 点击提交按钮
  const submitInfo = () => {
    (FormRef.current as any)
      .validateFields()
      .then(() => {
        articleInterFace();
      })
      .catch(() => {
        TipToast("请补充完必填项", "warning");
      });
  };

  // 添加/编辑文章接口
  const articleInterFace = async () => {
    setLoading(true);
    const data = {
      id,
      name,
      status,
      coverUrl,
      content,
      sort,
      type: id ? "edit" : "add",
    };
    UpdateArticle(data)
      .then((res: any) => {
        if (res.code == 200) {
          TipToast(res.msg, "success");
          closeModal(true);
        } else if (res.code == 400) {
          TipToast(res.msg);
        } else {
          TipToast(res.msg, "error", () => {
            router.replace("/login");
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 点击关闭按钮
  const closeModal = (val: boolean = false) => {
    close(val);
  };

  // 选择文章分类
  const selectSort = (val: string) => {
    let list = JSON.parse(JSON.stringify(sort));
    list.push(val);
    setSort(list);
  };

  // 移除文章分类
  const delSort = (val: string) => {
    let list = sort.filter((item) => item !== val);
    setSort(list);
  };

  return (
    <div className="add_article_box">
      <Spin size="large" spinning={loading}>
        <div className="title_box">
          <span className="title_">
            {id ? (pageType === "edit" ? "编辑文章" : "文章详情") : "添加文章"}
          </span>

          <div className="btn_box">
            {pageType !== "view" ? (
              <Button
                className="btn_submit"
                type="primary"
                onClick={submitInfo}
              >
                提交
              </Button>
            ) : (
              ""
            )}
            <Button
              className="btn_close"
              type="primary"
              onClick={() => closeModal(false)}
            >
              关闭
            </Button>
          </div>
        </div>

        <div className="form_box">
          <Form
            ref={FormRef}
            disabled={pageType === "view"}
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 10 }}
            autoComplete="off"
          >
            <Form.Item
              label="文章标题："
              name="name"
              rules={[{ required: true, message: "请输入文章标题" }]}
            >
              <Input
                allowClear
                onChange={(e: any) => setName(e.target.value)}
                defaultValue={name}
                value={name}
                placeholder="请输入"
              />
            </Form.Item>

            <Form.Item
              label="封面Url："
              name="coverUrl"
              rules={[{ required: true, message: "请输入文章封面图片地址" }]}
            >
              <div className="previewImg">
                <Input
                  allowClear
                  onChange={(e: any) => setCoverUrl(e.target.value)}
                  defaultValue={coverUrl}
                  value={coverUrl}
                  placeholder="请输入"
                />
                <Button
                  className="btn_view"
                  type="primary"
                  disabled={coverUrl == "" ? true : false}
                  onClick={() => setIsModalOpen(true)}
                >
                  预览
                </Button>
              </div>
            </Form.Item>

            <Form.Item
              label="文章分类："
              name="sort"
              rules={[{ required: true, message: "请输入文章分类" }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="请选择"
                options={sortlist}
                onSelect={selectSort}
                onClear={() => setSort([])}
                onDeselect={delSort}
              />
            </Form.Item>

            <Form.Item label="展示文章：" name="status">
              <Switch
                defaultChecked={status}
                checked={status}
                onChange={(val: boolean) => setStatus(val)}
              />
            </Form.Item>

            <Form.Item
              label="文章内容："
              name="content"
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "请输入文章内容" }]}
            >
              <Editor
                disabled={pageType === "view"}
                value={content}
                placeholder="请输入文章内容"
                toolbar={pageType === "view" ? detailToolBar : toolbar}
                onChange={(e: string) => setContent(e)}
              />
            </Form.Item>
          </Form>
        </div>
      </Spin>

      <Modal
        title="预览图片"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Image width="100%" preview={false} src={coverUrl} alt="" />
      </Modal>
    </div>
  );
}

export default memo(AddArticle);
