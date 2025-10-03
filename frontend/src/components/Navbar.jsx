export default function Navbar() {
    return (
        <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            {/* Logo + tên */}
            <div className="flex items-center gap-3">

                <h1 className="text-xl font-semibold tracking-wide">
                    Pharmacy Management
                </h1>
            </div>

            {/* User info */}
            <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm text-gray-300">
                    Xin chào, <span className="font-medium text-white">Admin</span>
                </span>
                <img
                    src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                    alt="Admin Avatar"
                    className="h-10 w-10 rounded-full border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                />
            </div>
        </div>
    );
}
