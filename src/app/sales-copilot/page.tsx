import PageHeader from '@/components/shared/PageHeader';
import SalesCopilotForm from '@/components/forms/SalesCopilotForm';

export default function SalesCopilotPage() {
  return (
    <div>
      <PageHeader
        title="AI Sales Copilot"
        description="Get real-time AI assistance during your sales calls or chats. Improve conversions with smart suggestions for pitch lines, objection handling, and lead temperature detection."
      />
      <div className="mt-8">
        <SalesCopilotForm />
      </div>
    </div>
  );
}
