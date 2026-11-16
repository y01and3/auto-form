"use client";

import type { FormConfig } from "./AutoForm.type";
import type {
  ControllerRenderProps,
  DefaultValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
} from "react-hook-form";
import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import FormRender from "./FormRender";

export interface AutoFormProps<Schema extends z.ZodObject> {
  formSchema: Schema;
  config: FormConfig<z.output<Schema>>;
  onSubmit: SubmitHandler<z.output<Schema>>;
  onInvalid?: SubmitErrorHandler<z.input<Schema>>;
  defaultValue?: DefaultValues<z.input<Schema>>;
  id?: string;
  className?: string;
  requiredSign?: boolean;
  removeFooter?: boolean;
  resetButtonName?: string;
  submitButtonName?: string;
}

const AutoForm = <Schema extends z.ZodObject>({
  formSchema,
  defaultValue,
  config,
  onSubmit,
  onInvalid,
  id,
  className,
  requiredSign = false,
  removeFooter = false,
  resetButtonName,
  submitButtonName,
}: AutoFormProps<Schema>) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const generatedId = React.useId();
  const formId = `form-${id ?? generatedId}`;

  const isFieldRequired = (fieldName: string) => {
    const fieldSchema = formSchema.shape[fieldName] as z.ZodType | undefined;

    return Boolean(fieldSchema && !fieldSchema.isOptional());
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <form
        noValidate
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      >
        <FieldGroup>
          {config.map((itemConfig, index) => {
            const fieldName = String(itemConfig.name);
            const required =
              itemConfig.type !== "switch" && isFieldRequired(fieldName);

            return (
              <React.Fragment key={`${formId}-${fieldName}`}>
                {index > 0 && <FieldSeparator />}
                <Controller
                  control={form.control}
                  name={itemConfig.name as Path<z.input<Schema>>}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={itemConfig.orientation}
                    >
                      <FieldContent>
                        {["checkbox", "checkbox-group", "radio-group"].includes(
                          itemConfig.type,
                        ) ? (
                          <FieldLegend>
                            <span>
                              {itemConfig.label}
                              {requiredSign && required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </span>
                          </FieldLegend>
                        ) : (
                          <FieldLabel htmlFor={`${formId}-${fieldName}`}>
                            <span>
                              {itemConfig.label}
                              {requiredSign && required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </span>
                          </FieldLabel>
                        )}
                        {itemConfig.description && (
                          <FieldDescription>
                            {itemConfig.description}
                          </FieldDescription>
                        )}
                      </FieldContent>

                      <FormRender
                        config={itemConfig}
                        field={field as unknown as ControllerRenderProps}
                        fieldState={fieldState}
                        id={`${formId}-${fieldName}`}
                        required={required}
                      />

                      {"tips" in itemConfig
                        ? itemConfig.tips && (
                            <FieldDescription>
                              {itemConfig.tips as string}
                            </FieldDescription>
                          )
                        : null}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </React.Fragment>
            );
          })}
        </FieldGroup>
      </form>
      {!removeFooter && (
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {resetButtonName ?? "Reset"}
          </Button>
          <Button form={formId} type="submit">
            {submitButtonName ?? "Submit"}
          </Button>
        </Field>
      )}
    </div>
  );
};

export default AutoForm;
