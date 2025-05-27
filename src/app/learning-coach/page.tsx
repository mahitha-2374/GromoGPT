import PageHeader from '@/components/shared/PageHeader';
import LearningCoachForm from '@/components/forms/LearningCoachForm';

export default function LearningCoachPage() {
  return (
    <div>
      <PageHeader
        title="AI Learning Coach"
        description="Receive personalized learning recommendations based on your performance data. Your AI coach will help you identify areas for improvement and suggest relevant training."
      />
      <div className="mt-8">
        <LearningCoachForm />
      </div>
    </div>
  );
}
