'use client';

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import Link from "next/link";

const Header = () => {
    const isOnline = useOnlineStatus();

    return (
        <>
            <header className="flex justify-between items-center mx-auto space-y-8 py-4">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-blue-900">
                        Schedly Practice Manager
                    </h1>
                </Link>
                <div className="flex items-center gap-2 transition-colors duration-300">
                    <span className={`w-3 h-3 rounded-full transition-all ${
                        isOnline 
                            ? "bg-green-500 animate-pulse" 
                            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    }`}></span>
                    <span className="text-sm font-medium text-gray-600">
                        {isOnline ? "Active" : "Offline Mode"}
                    </span>
                </div>
            </header>
            <nav className="mb-8">
                <ol className="flex">
                    <li>
                        <Link className="underline mr-4" href="/">Home</Link>
                    </li>
                    <li>
                        <Link className="underline mr-4" href="/appointment">Appointments</Link>
                    </li>
                    <li>
                        <Link className="underline mr-4" href="/patients">Patients</Link>
                    </li>
                    <li>
                        <Link className="underline mr-4" href="/doctors">Doctors</Link>
                    </li>
                    <li>
                        <Link className="underline mr-4" href="/notes">Notes</Link>
                    </li>
                </ol>
            </nav>
        </>
    )
}

export default Header;