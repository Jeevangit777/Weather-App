import { ModeToggle } from "@/components/mode-toggle"; // Import the theme toggle button

export default function Navbar() {
  return (
    <nav className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-900 shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Weather App
      </h1>
      <ModeToggle /> {/* Theme switcher button */}
    </nav>
  );
}
