"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart,
  ScatterChart as ScatterChartIcon,
} from "lucide-react";

// Dummy data for presentation purposes
const dummyAssetDetails = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 40 },
];

const dummyDepreciationAmount = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 3500 },
  { name: "Jun", value: 4200 },
  { name: "Jul", value: 3800 },
];

const dummyDepreciationPercentage = [
  { name: "0-10%", value: 20 },
  { name: "11-20%", value: 30 },
  { name: "21-30%", value: 25 },
  { name: "31-40%", value: 15 },
  { name: "41-50%", value: 10 },
];

const dummyAssetValueDepreciation = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
  { x: 130, y: 210 },
];

export default function AssetDashboard() {
  const [filterOption, setFilterOption] = useState("monthly");

  const chartConfig = {
    assetDetails: {
      label: "Asset Details",
      color: "hsl(var(--primary))",
    },
    depreciationAmount: {
      label: "Depreciation Amount",
      color: "hsl(var(--primary))",
    },
    depreciationPercentage: {
      label: "Depreciation Percentage",
      color: "hsl(var(--primary))",
    },
    assetValue: {
      label: "Asset Value",
      color: "hsl(var(--primary))",
    },
    depreciationValue: {
      label: "Depreciation Value",
      color: "hsl(var(--secondary))",
    },
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Asset Dashboard</h1>
        <Select onValueChange={setFilterOption} value={filterOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Assets" value="1,234" icon={BarChart2} />
        <StatCard title="Total Branches" value="42" icon={LineChartIcon} />
        <StatCard title="Total Depreciations" value="789" icon={PieChart} />
        <StatCard title="Total Transfers" value="56" icon={ScatterChartIcon} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Asset Details Over Time</CardTitle>
            <CardDescription>
              Number of asset details by {filterOption} period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyAssetDetails}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-assetDetails)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Depreciation Amount Over Time</CardTitle>
            <CardDescription>
              Total depreciation amount by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyDepreciationAmount}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-depreciationAmount)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Depreciation Percentage Distribution</CardTitle>
            <CardDescription>
              Distribution of depreciation percentages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={dummyDepreciationPercentage}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                  <Radar
                    name="Depreciation %"
                    dataKey="value"
                    stroke="var(--color-depreciationPercentage)"
                    fill="var(--color-depreciationPercentage)"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Value vs Depreciation</CardTitle>
            <CardDescription>
              Scatter plot of asset value against depreciation amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Asset Value" />
                  <YAxis type="number" dataKey="y" name="Depreciation Amount" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter
                    name="Asset Value vs Depreciation"
                    data={dummyAssetValueDepreciation}
                    fill="var(--color-assetValue)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* <div className="mt-8 flex justify-end">
        <Button variant="outline">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div> */}
    </div>
  );
}
