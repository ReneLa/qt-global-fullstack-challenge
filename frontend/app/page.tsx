"use client";

import { columns, DataTable, WeeklyStatsChart } from "@/components/users";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
          <WeeklyStatsChart />
          <DataTable columns={columns} />
        </div>
      </main>
    </div>
  );
}
