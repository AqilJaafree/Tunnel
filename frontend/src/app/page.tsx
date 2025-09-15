import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Tunnel
          </h1>
          <p className="text-gray-400 text-lg">
            Your prediction market platform
          </p>
        </div>
      </div>
    </main>
  );
}
