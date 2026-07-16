import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6">
      <Navbar />
      <Hero />
    </main>
  );
}