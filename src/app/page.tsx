import SceneBrain from "@/components/SceneBrain";

export default function Home() {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <div
          className="w-full md:h-screen  relative h-[55vh]"
        >
          <SceneBrain />
        </div>
    </div>
  );
}
