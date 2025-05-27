import PageHeader from '@/components/shared/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { NAV_ITEMS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Target } from 'lucide-react';

export default function DashboardPage() {
  const features = NAV_ITEMS.filter(item => item.href !== '/');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to GroMo AI Assist!"
        description="Your intelligent partner for maximizing earnings and growth."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <DashboardCard
            key={feature.href}
            icon={feature.icon}
            title={feature.title}
            description={`Access AI-powered ${feature.label?.toLowerCase()} tools.`}
            link={feature.href}
            actionText={`Go to ${feature.label}`}
          />
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Award className="mr-2 h-6 w-6 text-primary" />
            Your Progress & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-md font-medium">Weekly Goal Completion</h3>
              <span className="text-sm font-semibold text-primary">65%</span>
            </div>
            <Progress value={65} aria-label="Weekly goal progress: 65%" className="h-3"/>
            <p className="mt-1 text-xs text-muted-foreground">You're doing great! Keep up the momentum.</p>
          </div>
          <div className="flex items-center gap-4 rounded-md border p-4 bg-secondary/30">
             <Target className="h-8 w-8 text-accent-foreground" />
             <div>
                <h4 className="font-semibold">Points Earned: 1250</h4>
                <p className="text-sm text-muted-foreground">You've earned 1250 points this week. Aim for the next milestone!</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
