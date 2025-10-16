"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Temporary mock data - will be replaced with API response
const generateMockData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      admins: Math.floor(Math.random() * 8) + 2,
      users: Math.floor(Math.random() * 25) + 10
    });
  }
  return data;
};

const chartData = generateMockData();

const chartConfig = {
  admins: {
    label: "Admins",
    color: "var(--chart-1)"
  },
  users: {
    label: "Users",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

export function WeeklyStatsChart() {
  // Mock stats - will be from API
  const stats = {
    totalUsers: 40,
    admins: 10,
    users: 30,
    active: 12,
    inactive: 28
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-6">
          <CardTitle>Weekly Users Stats</CardTitle>
          <CardDescription>
            Showing total users created over the last 7 days
          </CardDescription>
        </div>

        {/* Top-level stats like in the image */}
        <div className="flex gap-8 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Total Users</span>
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Active</span>
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="admins"
              stackId="a"
              fill="var(--color-admins)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="users"
              stackId="a"
              fill="var(--color-users)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
