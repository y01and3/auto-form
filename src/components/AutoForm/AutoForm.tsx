"use client";

import type { FormConfig } from "./AutoForm.type";
import type {
  DefaultValues,
  SubmitHandler,
  SubmitErrorHandler,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

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

import FormRender from "./FormRender";

export interface AutoFormProps<Schema extends z.ZodObject> {
  formSchema: Schema;
  config: FormConfig<z.output<Schema>>;
  onSubmit: SubmitHandler<z.output<Schema>>;
  onInvalid?: SubmitErrorHandler<z.input<Schema>>;
  defaultValue?: DefaultValues<z.input<Schema>>;
  id?: string;
}
const AutoForm = <Schema extends z.ZodObject>({
  formSchema,
  defaultValue,
  config,
  onSubmit,
  onInvalid,
  id,
}: AutoFormProps<Schema>) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const formId = id ? id : window.crypto.randomUUID();

  return (
    <div style={{ width: "750px" }}>
      <form
        id={`form-${formId}`}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      >
        <FieldGroup>
          {config.map((config, index) => (
            <React.Fragment key={`form-${formId}-${config.name}`}>
              {index > 0 && <FieldSeparator />}
              <Controller
                control={form.control}
                name={config.name as Path<z.input<Schema>>}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={config.orientation}
                  >
                    <FieldContent>
                      {["checkbox", "checkbox-group", "radio-group"].includes(
                        config.type,
                      ) ? (
                        <FieldLegend>{config.label}</FieldLegend>
                      ) : (
                        <FieldLabel htmlFor={`form-${formId}-${config.name}`}>
                          {config.label}
                        </FieldLabel>
                      )}
                      {config?.description && (
                        <FieldDescription>
                          {config?.description}
                        </FieldDescription>
                      )}
                    </FieldContent>

                    <FormRender
                      config={config}
                      field={field as unknown as ControllerRenderProps}
                      fieldState={fieldState}
                      id={`form-${formId}-${config.name}`}
                    />

                    {"tips" in config
                      ? config?.tips && (
                          <FieldDescription>
                            {config?.tips as string}
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
          ))}
        </FieldGroup>
      </form>
    </div>
  );
};

export default AutoForm;
