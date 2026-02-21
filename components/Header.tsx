import Link from "next/link";

const Header = () => (
    <header className="flex justify-between items-center mx-auto space-y-8 py-4">
        <Link href="/">
            <h1 className="text-2xl font-bold text-blue-900">
                Schedly Practice Manager
            </h1>
        </Link>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Active</span>
        </div>
    </header>
)

export default Header;