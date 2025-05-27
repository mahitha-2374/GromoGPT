import PageHeader from '@/components/shared/PageHeader';
import GrowthPlansForm from '@/components/forms/GrowthPlansForm';

export default function GrowthPlansPage() {
  return (
    <div>
      <PageHeader
        title="Data-Driven Growth Plans"
        description="Leverage AI to identify stagnation risks and receive custom playbooks and income boosters. Strategize your growth with intelligent insights."
      />
      <div className="mt-8">
        <GrowthPlansForm />
      </div>
    </div>
  );
}
