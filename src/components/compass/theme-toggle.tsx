import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("ai-compass-theme");
    } catch {
      /* Storage may be unavailable. */
    }
    const isLight = saved === "light";
    document.documentElement.classList.toggle("light", isLight);
    setLight(isLight);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("ai-compass-theme", next ? "light" : "dark");
    } catch {
      /* The switch works without storage. */
    }
  }

  const label = light ? "Switch to dark mode" : "Switch to light mode";
  return (
    <Button
      variant="ghost"
      size="icon"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      {light ? <Moon size={19} /> : <Sun size={19} />}
    </Button>
  );
}
