export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-4xl font-bold text-slate-800">
        Welcome to VeloCue
      </h1>
      <p className="mb-8 max-w-md text-slate-600">
        Upload your GPX route, visualize elevation profiles, and create printable
        stem notes for your next ride.
      </p>
      <button className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-indigo-700">
        Get Started
      </button>
    </div>
  );
}
