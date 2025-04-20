
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface YearlyData {
  name: string;
  [key: string]: string | number;
}

interface YearlyDistributionProps {
  data: YearlyData[];
}

export function YearlyDistribution({ data }: YearlyDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution par année</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Documents administratifs" fill="#4A9BDB" />
            <Bar dataKey="Documents techniques" fill="#1A5B8F" />
            <Bar dataKey="Documents financiers" fill="#F8B93B" />
            <Bar dataKey="Documents de communication" fill="#5BCEFA" />
            <Bar dataKey="Archives historiques" fill="#6B7280" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
