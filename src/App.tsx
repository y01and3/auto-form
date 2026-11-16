import AutoForm from "@/components/AutoForm/AutoForm";
import {
  defaultValues,
  formConfig,
  formSchema,
  handleInvalid,
  handleSubmit,
} from "@/stories/AutoForm";

function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <AutoForm
        requiredSign
        config={formConfig}
        defaultValue={defaultValues}
        formSchema={formSchema}
        onInvalid={handleInvalid}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default App;
