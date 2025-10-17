import type { Meta, StoryObj } from "@storybook/react-vite";

import AutoForm from "@/components/AutoForm/AutoForm";

import {
  formSchema,
  formConfig,
  defaultValues,
  handleSubmit,
  handleInvalid,
} from "./AutoForm";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AutoForm<typeof formSchema>> = {
  title: "AutoForm",
  component: AutoForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
};

export default meta;

export const AllTypes: StoryObj<typeof meta> = {
  args: {
    formSchema,
    config: formConfig,
    defaultValue: defaultValues,
    onSubmit: handleSubmit,
    onInvalid: handleInvalid,
  },
};
