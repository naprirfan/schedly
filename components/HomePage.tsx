'use client';

import { useEffect } from "react";
import { PatientSearch } from "./Patient/PatientSearch";
import { Scheduler } from "./Calendar/Scheduler";
import { seedDatabase } from "@/services/idbService";

export default function HomePage() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <PatientSearch />
          </aside>
          
          <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
            <Scheduler />
          </section>
        </div>
      </div>
    </main>
  )
}