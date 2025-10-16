"use client";

import { columns, DataTable, WeeklyStatsChart } from "@/components/users";
import { useUsers } from "@/hooks/use-users";

export default function Home() {
  const { data: users } = useUsers();
  console.log("Users", users);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] w-full max-w-4xl row-start-2 items-center sm:items-start">
        <WeeklyStatsChart />
        <DataTable data={users || []} columns={columns} />
      </main>
    </div>
  );
}
