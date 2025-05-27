import PageHeader from '@/components/shared/PageHeader';
import LeadGenerationForm from '@/components/forms/LeadGenerationForm';

export default function LeadGenerationPage() {
  return (
    <div>
      <PageHeader
        title="Smart Lead Generation"
        description="Let AI analyze your data to suggest leads with the highest conversion potential. Focus your efforts where it matters most."
      />
      <div className="mt-8">
        <LeadGenerationForm />
      </div>
    </div>
  );
}
