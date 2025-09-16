import MarketCarousel from "@/components/ui/MarketCarousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Market Carousel Section */}
        <div className="py-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trending Markets
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Discover the hottest prediction markets across sports, entertainment, and politics
            </p>
          </div>
          <MarketCarousel />
        </div>


      </div>
    </main>
  );
}