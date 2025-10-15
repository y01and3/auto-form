"use client"

import type { FormConfig } from "./AutoForm.type"
import type { DefaultValues, SubmitHandler, SubmitErrorHandler, Path, ControllerRenderProps } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"

import FormRender from "./FormRender"

export interface AutoFormProps<Schema extends z.ZodObject> {
  formSchema: Schema,
  config: FormConfig<z.output<Schema>>,
  onSubmit: SubmitHandler<z.output<Schema>>,
  onInvalid?: SubmitErrorHandler<z.input<Schema>>,
  defaultValue?: DefaultValues<z.input<Schema>>,
}
const AutoForm = <Schema extends z.ZodObject,>({ formSchema, defaultValue, config, onSubmit, onInvalid }: AutoFormProps<Schema>) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  })
  const formId = "a";

  return (
    <div style={{width: "750px"}}>
      <form id={`form-${formId}`} onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FieldGroup>
          {config.map((config, index) => (
            <>
              {index > 0 && <FieldSeparator />}
              <Controller
                key={`form-${formId}-${config.name}`}
                control={form.control}
                name={config.name as Path<z.input<Schema>>}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation={config.orientation}>
                    <FieldLabel htmlFor={`form-${formId}-${config.name}`}>
                      {config.label}
                    </FieldLabel>
                    {config?.description && <FieldDescription>
                      {config?.description}
                    </FieldDescription>}
                    <FormRender config={config} field={field as unknown as ControllerRenderProps} fieldState={fieldState} id={`form-${formId}-${config.name}`} />
                    {config?.tips && <FieldDescription>
                      {config?.tips}
                    </FieldDescription>}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>))}
        </FieldGroup>
      </form>
    </div>
  )
}

export default AutoForm;
