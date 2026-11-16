# AutoForm

基于 React 19、TypeScript、Tailwind CSS v4 与 [shadcn/ui](https://ui.shadcn.com) 实现的配置驱动表单组件。由 Zod Schema 与表单数据类型自动推导 `FormConfig<T>`，在编译期约束字段名与各控件配置项，支持通过 **shadcn Registry** 按需拉取源码。

- 在线预览（Storybook）：`https://y01and3.github.io/auto-form/`

## 安装

确保目标项目已完成 [shadcn/ui 初始化](https://ui.shadcn.com/docs/installation)（Tailwind CSS v4），直接通过 `shadcn` CLI 拉取组件源码与所需基础依赖：

```bash
# npm
npx shadcn@latest add https://y01and3.github.io/auto-form/r/auto-form.json

# yarn
yarn dlx shadcn@latest add https://y01and3.github.io/auto-form/r/auto-form.json

# pnpm
pnpm dlx shadcn@latest add https://y01and3.github.io/auto-form/r/auto-form.json
```

## 支持控件（`type`）

- `input` / `textarea`：基础单行与多行文本输入
- `input-group` / `textarea-group`：带前后缀文本、按钮或自定义节点的组合输入框
- `select`：支持普通项（`item`）、分组（`group`）与分隔线（`separator`）的下拉选择
- `checkbox` / `checkbox-group`：单项复选框与多选组（支持 `text`、`card`、`auto` 模式）
- `radio-group`：单选组（支持 `text`、`card`、`auto` 模式）
- `switch`：布尔开关
- `raw`：自定义渲染函数 `(field, fieldState, id) => ReactNode`，用于承载复杂定制交互

## 基本用法

```tsx
import type { FormConfig } from "@/components/AutoForm";
import * as z from "zod";
import AutoForm from "@/components/AutoForm";

const formSchema = z.object({
  username: z.string().min(2, "至少输入 2 个字符"),
  role: z.enum(["admin", "member"]),
  notifications: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const formConfig: FormConfig<FormValues> = [
  {
    name: "username",
    label: "用户名",
    description: "公开显示的名称",
    type: "input",
    config: {
      placeholder: "请输入用户名",
    },
  },
  {
    name: "role",
    label: "角色",
    type: "select",
    config: {
      placeholder: "请选择角色",
      options: [
        { type: "item", label: "管理员", value: "admin" },
        { type: "item", label: "普通成员", value: "member" },
      ],
    },
  },
  {
    name: "notifications",
    label: "接收通知",
    orientation: "horizontal",
    type: "switch",
    config: {},
  },
];

export default function ProfileForm() {
  return (
    <AutoForm
      requiredSign
      config={formConfig}
      defaultValue={{
        username: "",
        role: "member",
        notifications: true,
      }}
      formSchema={formSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    />
  );
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `formSchema` | `z.ZodObject` | - | 必填，表单对应的 Zod 校验 Schema |
| `config` | `FormConfig<z.output<Schema>>` | - | 必填，字段渲染配置数组 |
| `onSubmit` | `SubmitHandler<z.output<Schema>>` | - | 必填，校验通过后的提交回调 |
| `onInvalid` | `SubmitErrorHandler<z.input<Schema>>` | `undefined` | 校验未通过时的错误回调 |
| `defaultValue` | `DefaultValues<z.input<Schema>>` | `undefined` | 表单初始默认值 |
| `id` | `string` | 自动生成 | 自定义表单 DOM ID 后缀 |
| `className` | `string` | `undefined` | 外层容器附加样式类名 |
| `requiredSign` | `boolean` | `false` | 是否在必填字段标题旁显示红色星号 |
| `removeFooter` | `boolean` | `false` | 是否隐藏底部默认的重置与提交按钮区 |
| `resetButtonName` | `string` | `"Reset"` | 重置按钮文案 |
| `submitButtonName` | `string` | `"Submit"` | 提交按钮文案 |

## 本地开发

```bash
yarn install
yarn storybook       # 启动 Storybook 预览
yarn lint            # ESLint 检查
yarn typecheck       # TypeScript 类型检查
yarn test:run        # 运行 Storybook 交互测试
yarn build:registry  # 生成 public/r 下的 shadcn Registry 产物
```

## License

[MIT](./LICENSE)
