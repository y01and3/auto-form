import type { InputGroupButton } from "@/components/ui/input-group";
import type {
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";

export type FormConfig<T> = T extends object
  ? {
      [K in keyof T]: Merge<
        {
          name: K;
          label: string;
          description?: string;
          orientation?: "vertical" | "horizontal" | "responsive";
        },
        ItemConfig
      >;
    }[keyof T][]
  : never;

type Merge<F extends object, S extends object> = F & S extends infer T
  ? {
      [K in keyof T]: T[K];
    }
  : never;

export type ItemConfig = {
  [K in keyof Config]: {
    type: K;
    tips?: K extends
      | "input"
      | "textarea"
      | "input-group"
      | "textarea-group"
      | "select"
      | "checkbox"
      ? string
      : never;
    config: Config[K];
  };
}[keyof Config];

type Config = {
  raw: (
    field: ControllerRenderProps,
    fieldState: ControllerFieldState,
    id?: string,
  ) => React.ReactNode;
  input: React.ComponentProps<"input">;
  textarea: React.ComponentProps<"textarea">;
  "input-group": {
    input: React.ComponentProps<"input">;
    addons: Merge<InputGroupAddon, { align?: "inline-start" | "inline-end" }>[];
  };
  "textarea-group": {
    textarea: React.ComponentProps<"textarea">;
    addons: Merge<InputGroupAddon, { align?: "block-start" | "block-end" }>[];
  };
  select: {
    className?: string;
    size?: "sm" | "default";
    placeholder?: string;
    position?: "item-aligned" | "popper";
    align?: "start" | "center" | "end";
    options: SelectionOption[];
    disabled?: boolean;
  };
  checkbox: {
    label: string;
    className?: string;
    disabled?: boolean;
  };
  "checkbox-group": {
    style?: "text" | "card" | "auto";
    options: {
      label: string;
      value: string | number;
      disabled?: boolean;
      description?: string;
    }[];
  };
  "radio-group": {
    style?: "text" | "card" | "auto";
    options: {
      label: string;
      value: string;
      disabled?: boolean;
      description?: string;
    }[];
  };
  switch: {
    disabled?: boolean;
  };
};

type InputGroupAddon = {
  id: string;
} & (
  | { child: React.ReactNode }
  | { button: React.ComponentProps<typeof InputGroupButton> }
  | { text: string; className?: string }
);

type SelectionOption =
  | {
      type: "item";
      label: string;
      value: string;
    }
  | { type: "separator" }
  | {
      type: "group";
      label: string;
      children: { label: string; value: string }[];
    };
