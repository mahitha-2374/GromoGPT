import PageHeader from '@/components/shared/PageHeader';
import PostSaleEngagementForm from '@/components/forms/PostSaleEngagementForm';

export default function PostSaleEngagementPage() {
  return (
    <div>
      <PageHeader
        title="AI Post-Sale Engagement"
        description="Automate responses to common customer queries and get AI-driven prompts for renewals or upsells. Enhance customer satisfaction effortlessly."
      />
      <div className="mt-8">
        <PostSaleEngagementForm />
      </div>
    </div>
  );
}
