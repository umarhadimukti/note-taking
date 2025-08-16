import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Simple Notes App</h1>
        <div className="space-x-4">
          <Link 
            href="/signin" 
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
