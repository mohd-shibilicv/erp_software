import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/CustomeDashboardCard";
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
export const description = "A multiple line chart";
const MultiplechartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

/* eslint-disable react/prop-types */
export default function EmployeDashboard() {
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      {/* <div className="w-full">
        <h1 className="text-lg">Dashboard</h1>
      </div> */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        <StatCard title="Total Employees" value={100} bgColor="bg-blue-500" />
        <StatCard title="Pending Employees" value={75} bgColor="bg-green-500" />
        <StatCard
          title="Pending Visa print"
          value={25}
          bgColor="bg-yellow-500"
        />
        <StatCard title="Pending ID print" value={50} bgColor="bg-purple-500" />
        <StatCard title="Pending Gate pass" value={30} bgColor="bg-cyan-500" />
        <StatCard title="Pending Passport" value={20} bgColor="bg-indigo-500" />
        <StatCard
          title="Completed Employees"
          value={150}
          bgColor="bg-lime-500"
        />
        <StatCard
          title="Pending Contract"
          value={100}
          bgColor={"bg-orange-500"}
        />
      </div>
      <div className="w-full mt-3 ">
        <div className="w-full">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Employee - Expiry Doc</CardTitle>
              <CardDescription>Showing all employee expiry doc</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[200px] w-full" config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={MultiplechartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="desktop"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="mobile"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Showing expiry doc report <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Jan - Dec
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-3 w-full">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Employee Joining</CardTitle>
              <CardDescription>
                Showing Employee joining trend over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="w-full h-[200px]" config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={[
                    { month: "January", desktop: 186 },
                    { month: "February", desktop: 305 },
                    { month: "March", desktop: 237 },
                    { month: "April", desktop: 73 },
                    { month: "May", desktop: 209 },
                    { month: "June", desktop: 214 },
                  ]}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-3 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Employee joining trend <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full mt-3">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Employee Contract Expiry</CardTitle>
              <CardDescription>Year whise</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="w-full h-[200px]" config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={[
                    { month: "January", desktop: 186 },
                    { month: "February", desktop: 305 },
                    { month: "March", desktop: 237 },
                    { month: "April", desktop: 73 },
                    { month: "May", desktop: 209 },
                    { month: "June", desktop: 214 },
                  ]}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Employee Contract Expiry <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing contract expiry of employees
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-3 grid gap-3 grid-cols-1 md:grid-cols-6">
          <Card className="md:col-span-4 rounded-none">
            <CardHeader>
              <CardTitle>Employee Count by Designation</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[200px] w-full" config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={[
                    { month: "January", desktop: 186 },
                    { month: "February", desktop: 305 },
                    { month: "March", desktop: 237 },
                    { month: "April", desktop: 73 },
                    { month: "May", desktop: 209 },
                    { month: "June", desktop: 214 },
                  ]}
                  layout="vertical"
                  margin={{
                    left: -20,
                  }}
                >
                  <XAxis type="number" dataKey="desktop" hide />
                  <YAxis
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={5}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Showing Employee count by designation{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                {/* Showing total visitors for the last 6 months */}
              </div>
            </CardFooter>
          </Card>
          <Card className="flex flex-col md:col-span-2 rounded-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Employee - Nation distribution</CardTitle>
              <CardDescription>Employee nation distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={[
                      {
                        browser: "chrome",
                        visitors: 275,
                        fill: "var(--color-chrome)",
                      },
                      {
                        browser: "safari",
                        visitors: 200,
                        fill: "var(--color-safari)",
                      },
                      {
                        browser: "firefox",
                        visitors: 287,
                        fill: "var(--color-firefox)",
                      },
                      {
                        browser: "edge",
                        visitors: 173,
                        fill: "var(--color-edge)",
                      },
                      {
                        browser: "other",
                        visitors: 190,
                        fill: "var(--color-other)",
                      },
                    ]}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {8}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Visitors
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
              Grouped Employees with their nation{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing group wise data
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
