import type {
  DefaultValues,
  SubmitErrorHandler,
  SubmitHandler,
} from "react-hook-form";

import * as z from "zod";

import type { FormConfig } from "@/components/AutoForm/AutoForm.type";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "至少输入两个字符"),
  bio: z
    .string()
    .min(10, "至少输入 10 个字符"),
  website: z
    .string()
    .min(5, "请至少输入 5 个字符"),
  projectSummary: z
    .string()
    .min(10, "请至少输入 10 个字符"),
  role: z.string({ error: "请选择一个角色" }),
  agreement: z
    .boolean()
    .refine((value) => value === true, "必须接受协议"),
  interests: z
    .array(z.string())
    .min(1, "至少选择一个兴趣方向"),
  notification: z.enum(["email", "sms", "push"]),
  enableBeta: z.boolean(),
  quickTemplate: z.string().optional().default(""),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: DefaultValues<FormValues> = {
  fullName: "张三",
  bio: "我是一名热爱设计与前端的创作者，喜欢用代码实现美好的体验。",
  website: "https://example.com",
  projectSummary: "为团队构建一个可复用的组件库，提升交付效率。",
  role: "designer",
  agreement: true,
  interests: ["ui", "accessibility"],
  notification: "email",
  enableBeta: true,
  quickTemplate: "初始模板",
};

const formConfig: FormConfig<FormValues> = [
  {
    name: "fullName",
    label: "姓名",
    description: "基础输入控件",
    tips: "展示 input 控件的最小示例",
    type: "input",
    config: {
      placeholder: "请输入姓名",
      autoComplete: "name",
    },
  },
  {
    name: "bio",
    label: "个人简介",
    description: "文本区域",
    tips: "不少于 10 个字符",
    orientation: "vertical",
    type: "textarea",
    config: {
      placeholder: "介绍一下你自己……",
      rows: 4,
    },
  },
  {
    name: "website",
    label: "个人主页",
    description: "带前后缀的组合输入",
    orientation: "responsive",
    type: "input-group",
    config: {
      input: {
        placeholder: "https://example.com",
        autoComplete: "url",
      },
      addons: [
        {
          id: "website-icon",
          text: "🔗",
        },
        {
          id: "website-hint",
          align: "inline-end",
          text: "示例：your.site",
        },
      ],
    },
  },
  {
    name: "projectSummary",
    label: "项目概览",
    description: "带工具条的文本域组合",
    orientation: "vertical",
    type: "textarea-group",
    config: {
      textarea: {
        placeholder: "描述当前负责的项目……",
      },
      addons: [
        {
          id: "summary-tip",
          align: "block-start",
          text: "可以粘贴 Markdown 内容",
        },
      ],
    },
  },
  {
    name: "role",
    label: "角色",
    description: "下拉选择包含分组与分隔符",
    orientation: "vertical",
    type: "select",
    config: {
      placeholder: "请选择角色",
      options: [
        { type: "item", label: "产品设计师", value: "designer" },
        { type: "item", label: "前端工程师", value: "frontend" },
        { type: "separator" },
        {
          type: "group",
          label: "其他角色",
          children: [
            { label: "用户研究", value: "research" },
            { label: "项目经理", value: "pm" },
          ],
        },
      ],
    },
  },
  {
    name: "agreement",
    label: "协议与隐私",
    tips: "请阅读后勾选",
    type: "checkbox",
    config: {
      label: "我已阅读并同意服务条款",
    },
  },
  {
    name: "interests",
    label: "关注领域",
    description: "多选复选框",
    orientation: "vertical",
    type: "checkbox-group",
    config: {
      options: [
        {
          label: "UI 设计",
          value: "ui",
          description: "对界面设计感兴趣",
        },
        {
          label: "无障碍",
          value: "accessibility",
          description: "关注可访问性实践",
        },
        {
          label: "动画效果",
          value: "motion",
        },
      ],
    },
  },
  {
    name: "notification",
    label: "通知方式",
    description: "单选按钮组",
    orientation: "vertical",
    type: "radio-group",
    config: {
      options: [
        { label: "邮件", value: "email" },
        {
          label: "短信",
          value: "sms",
          description: "在国内手机号接收通知",
        },
        { label: "推送", value: "push" },
      ],
    },
  },
  {
    name: "enableBeta",
    label: "体验新版界面",
    description: "开关控件",
    tips: "开启后将收到最新特性预览",
    orientation: "horizontal",
    type: "switch",
    config: {},
  },
  {
    name: "quickTemplate",
    label: "快捷模板",
    description: "原始渲染，可自定义交互",
    type: "raw",
    config: (field, _fieldState, id) => {
      const value = typeof field.value === "string" ? field.value : "";

      return (
        <div className="flex flex-col gap-2" id={id}>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              type="button"
              onClick={() => field.onChange("欢迎使用 AutoForm！")}
            >
              填入示例内容
            </Button>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => field.onChange("")}
            >
              清空
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            当前值：{value || "未设置"}
          </p>
        </div>
      );
    },
  },
];

const handleSubmit: SubmitHandler<FormValues> = (values) => {
  // eslint-disable-next-line no-console
  console.log("提交成功", values);
};

const handleInvalid: SubmitErrorHandler<FormValues> = (errors) => {
  // eslint-disable-next-line no-console
  console.warn("校验失败", errors);
};

export { formSchema, formConfig, defaultValues, handleSubmit, handleInvalid }