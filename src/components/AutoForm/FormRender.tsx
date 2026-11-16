import type { ItemConfig } from "./AutoForm.type";
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FormRenderProps {
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  config: ItemConfig;
  id?: string;
  required?: boolean;
}

const FormRender = ({
  field,
  fieldState,
  config,
  id,
  required = false,
}: FormRenderProps) => {
  switch (config.type) {
    case "raw":
      return config.config(field, fieldState, id);
    case "input":
      return (
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          id={id}
          value={field.value ?? ""}
          {...config.config}
          required={required}
        />
      );
    case "textarea":
      return (
        <Textarea
          {...field}
          aria-invalid={fieldState.invalid}
          id={id}
          value={field.value ?? ""}
          {...config.config}
          required={required}
        />
      );
    case "input-group":
      return (
        <InputGroup>
          <InputGroupInput
            {...field}
            aria-invalid={fieldState.invalid}
            id={id}
            value={field.value ?? ""}
            {...config.config.input}
            required={required}
          />
          {config.config.addons.map((addon) => (
            <InputGroupAddon key={addon.id} align={addon.align}>
              {"child" in addon && addon.child}
              {"button" in addon && <InputGroupButton {...addon.button} />}
              {"text" in addon && (
                <InputGroupText className={addon.className}>
                  {addon.text}
                </InputGroupText>
              )}
            </InputGroupAddon>
          ))}
        </InputGroup>
      );
    case "textarea-group":
      return (
        <InputGroup>
          <InputGroupTextarea
            {...field}
            aria-invalid={fieldState.invalid}
            id={id}
            value={field.value ?? ""}
            {...config.config.textarea}
            required={required}
          />
          {config.config.addons.map((addon) => (
            <InputGroupAddon key={addon.id} align={addon.align}>
              {"child" in addon && addon.child}
              {"button" in addon && <InputGroupButton {...addon.button} />}
              {"text" in addon && (
                <InputGroupText className={addon.className}>
                  {addon.text}
                </InputGroupText>
              )}
            </InputGroupAddon>
          ))}
        </InputGroup>
      );
    case "select": {
      let separatorCount = 0;

      return (
        <Select
          disabled={config.config.disabled}
          name={field.name}
          required={required}
          value={field.value ?? ""}
          onValueChange={field.onChange}
        >
          <SelectTrigger
            aria-invalid={fieldState.invalid}
            className={config.config.className}
            id={id}
            size={config.config.size}
          >
            <SelectValue placeholder={config.config.placeholder} />
          </SelectTrigger>
          <SelectContent
            align={config.config.align}
            position={config.config.position}
          >
            {config.config.options.map((option) => {
              switch (option.type) {
                case "group":
                  return (
                    <SelectGroup key={`${id}-group-${option.label}`}>
                      <SelectLabel>{option.label}</SelectLabel>
                      {option.children.map((opt) => (
                        <SelectItem
                          key={`${id}-group-${option.label}-${opt.value}`}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                case "separator":
                  return (
                    <SelectSeparator
                      key={`${id}-separator-${separatorCount++}`}
                    />
                  );
                case "item":
                  return (
                    <SelectItem
                      key={`${id}-item-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  );
              }
            })}
          </SelectContent>
        </Select>
      );
    }
    case "checkbox":
      return (
        <Field orientation="horizontal">
          <Checkbox
            aria-label={config.config.label}
            checked={Boolean(field.value)}
            disabled={config.config.disabled}
            id={id}
            name={field.name}
            required={required}
            onCheckedChange={field.onChange}
          />
          <FieldLabel className={config.config.className} htmlFor={id}>
            {config.config.label}
          </FieldLabel>
        </Field>
      );
    case "checkbox-group": {
      const selectedValues: Array<string | number> = Array.isArray(field.value)
        ? field.value
        : [];
      const cardMod =
        !config.config.style || config.config.style === "auto"
          ? config.config.options.findIndex((option) => option.description) !==
            -1
          : config.config.style === "text"
            ? false
            : true;

      return (
        <FieldGroup data-slot="checkbox-group">
          {cardMod
            ? config.config.options.map((option) => (
                <FieldLabel
                  key={option.value}
                  htmlFor={`${id}-${option.value}`}
                >
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldContent>
                      <FieldTitle>{option.label}</FieldTitle>
                      {option.description && (
                        <FieldDescription>
                          {option.description}
                        </FieldDescription>
                      )}
                    </FieldContent>
                    <Checkbox
                      aria-invalid={fieldState.invalid}
                      aria-label={option.label}
                      checked={selectedValues.includes(option.value)}
                      disabled={option.disabled}
                      id={`${id}-${option.value}`}
                      name={field.name}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter(
                              (value) => value !== option.value,
                            );

                        field.onChange(newValue);
                      }}
                    />
                  </Field>
                </FieldLabel>
              ))
            : config.config.options.map((option) => (
                <Field
                  key={option.value}
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                >
                  <Checkbox
                    aria-invalid={fieldState.invalid}
                    aria-label={option.label}
                    checked={selectedValues.includes(option.value)}
                    disabled={option.disabled}
                    id={`${id}-${option.value}`}
                    name={field.name}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(
                            (value) => value !== option.value,
                          );

                      field.onChange(newValue);
                    }}
                  />
                  {option.description ? (
                    <FieldContent>
                      <FieldLabel
                        className="font-normal"
                        htmlFor={`${id}-${option.value}`}
                      >
                        {option.label}
                      </FieldLabel>
                      <FieldDescription>{option.description}</FieldDescription>
                    </FieldContent>
                  ) : (
                    <FieldLabel
                      className="font-normal"
                      htmlFor={`${id}-${option.value}`}
                    >
                      {option.label}
                    </FieldLabel>
                  )}
                </Field>
              ))}
        </FieldGroup>
      );
    }
    case "radio-group": {
      const cardMod =
        !config.config.style || config.config.style === "auto"
          ? config.config.options.findIndex((option) => option.description) !==
            -1
          : config.config.style === "text"
            ? false
            : true;

      return (
        <RadioGroup
          aria-invalid={fieldState.invalid}
          name={field.name}
          required={required}
          value={field.value ?? ""}
          onValueChange={field.onChange}
        >
          {cardMod
            ? config.config.options.map((option) => (
                <FieldLabel
                  key={option.value}
                  htmlFor={`${id}-${option.value}`}
                >
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldContent>
                      <FieldTitle>{option.label}</FieldTitle>
                      {option.description && (
                        <FieldDescription>
                          {option.description}
                        </FieldDescription>
                      )}
                    </FieldContent>
                    <RadioGroupItem
                      aria-invalid={fieldState.invalid}
                      disabled={option.disabled}
                      id={`${id}-${option.value}`}
                      value={option.value}
                    />
                  </Field>
                </FieldLabel>
              ))
            : config.config.options.map((option) => (
                <Field
                  key={option.value}
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                >
                  <RadioGroupItem
                    aria-invalid={fieldState.invalid}
                    disabled={option.disabled}
                    id={`${id}-${option.value}`}
                    value={option.value}
                  />
                  {option.description ? (
                    <FieldContent>
                      <FieldLabel
                        className="font-normal"
                        htmlFor={`${id}-${option.value}`}
                      >
                        {option.label}
                      </FieldLabel>
                      <FieldDescription>{option.description}</FieldDescription>
                    </FieldContent>
                  ) : (
                    <FieldLabel
                      className="font-normal"
                      htmlFor={`${id}-${option.value}`}
                    >
                      {option.label}
                    </FieldLabel>
                  )}
                </Field>
              ))}
        </RadioGroup>
      );
    }
    case "switch":
      return (
        <Switch
          aria-invalid={fieldState.invalid}
          checked={Boolean(field.value)}
          disabled={config.config.disabled}
          id={id}
          name={field.name}
          onCheckedChange={field.onChange}
        />
      );
  }
};

export default FormRender;
