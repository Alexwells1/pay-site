// src/components/admin/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string | number;
};

export const StatsCard = ({ title, value }: StatsCardProps) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-6">
      <h4 className="text-sm text-muted-foreground">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);
