import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import AutoForm from "@/components/AutoForm/AutoForm";

import {
  defaultValues,
  formConfig,
  formSchema,
  handleInvalid,
  handleSubmit,
} from "./AutoForm";

const meta: Meta<typeof AutoForm<typeof formSchema>> = {
  title: "components/AutoForm",
  component: AutoForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-[750px] max-w-full p-6",
  },
};

export default meta;

export const AllTypes: StoryObj<typeof meta> = {
  args: {
    formSchema,
    config: formConfig,
    defaultValue: defaultValues,
    onSubmit: fn(handleSubmit),
    onInvalid: fn(handleInvalid),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = canvas.getByLabelText("姓名");

    await expect(nameInput).toHaveValue("张三");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "李四");
    await expect(nameInput).toHaveFocus();
    await expect(nameInput).toHaveValue("李四");

    const templateButton = canvas.getByRole("button", {
      name: "填入示例内容",
    });

    await userEvent.click(templateButton);
    await expect(
      canvas.getByText("当前值：欢迎使用 AutoForm！"),
    ).toBeInTheDocument();

    const submitButton = canvas.getByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledTimes(1);
    });
  },
};

export const ValidationAndReset: StoryObj<typeof meta> = {
  args: {
    formSchema,
    config: formConfig,
    requiredSign: true,
    submitButtonName: "提交表单",
    resetButtonName: "重置表单",
    onSubmit: fn(),
    onInvalid: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const submitButton = canvas.getByRole("button", { name: "提交表单" });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(args.onInvalid).toHaveBeenCalledTimes(1);
    });

    await expect(canvas.getByText("至少输入两个字符")).toBeInTheDocument();
    await expect(canvas.getByText("必须接受协议")).toBeInTheDocument();
    await expect(canvas.getByText("至少选择一个兴趣方向")).toBeInTheDocument();

    const nameInput = canvas.getByPlaceholderText("请输入姓名");

    await userEvent.type(nameInput, "王五");
    await expect(nameInput).toHaveValue("王五");

    const resetButton = canvas.getByRole("button", { name: "重置表单" });

    await userEvent.click(resetButton);
    await expect(nameInput).toHaveValue("");
  },
};
