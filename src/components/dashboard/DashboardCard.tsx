import type { FC, ElementType } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DashboardCardProps {
  icon: ElementType;
  title: string;
  description: string;
  link: string;
  actionText?: string;
}

const DashboardCard: FC<DashboardCardProps> = ({ icon: Icon, title, description, link, actionText = "Explore" }) => {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground min-h-[40px]">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-0">
        <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
          <Link href={link}>
            {actionText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
