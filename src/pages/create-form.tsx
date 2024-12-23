import { FormStep } from '@/components/forms/create/form-step';
import { FieldsStep } from '@/components/forms/create/fields-step';
import { FormPreview } from '@/components/forms/create/form-preview';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormSteps } from '@/lib/hooks/use-form-steps';

export function CreateFormPage() {
  const {
    currentStep,
    formData,
    fields,
    isSubmitting,
    error,
    setFields,
    handleFormStep,
    handleFieldsStep,
    handleBack,
    handleSubmit,
  } = useFormSteps();

  const renderStep = () => {
    switch (currentStep) {
      case 'form':
        return <FormStep onNext={handleFormStep} />;
      case 'fields':
        return (
          <FieldsStep
            fields={fields}
            onFieldsChange={setFields}
            onBack={handleBack}
            onNext={handleFieldsStep}
          />
        );
      case 'preview':
        return (
          <div className="space-y-6">
            <FormPreview formData={{ ...formData, fields }} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Form'
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {['form', 'fields', 'preview'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      index < ['form', 'fields', 'preview'].indexOf(currentStep)
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderStep()}
    </div>
  );
}