import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useColorPalette, type ColorPalette } from "@/hooks/useColorPalette";

const palettes: { id: ColorPalette; name: string; accent: string; preview: string }[] = [
  { id: "cyan", name: "Ocean Cyan", accent: "184 74% 45%", preview: "bg-[hsl(184,74%,45%)]" },
  { id: "purple", name: "Royal Purple", accent: "262 83% 58%", preview: "bg-[hsl(262,83%,58%)]" },
  { id: "rose", name: "Rose Pink", accent: "346 77% 50%", preview: "bg-[hsl(346,77%,50%)]" },
  { id: "orange", name: "Sunset Orange", accent: "25 95% 53%", preview: "bg-[hsl(25,95%,53%)]" },
  { id: "green", name: "Emerald Green", accent: "142 76% 36%", preview: "bg-[hsl(142,76%,36%)]" },
  { id: "blue", name: "Classic Blue", accent: "217 91% 50%", preview: "bg-[hsl(217,91%,50%)]" },
];

export function ColorPalettePicker() {
  const { palette, setPalette } = useColorPalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Choose accent color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Accent Color
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {palettes.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setPalette(p.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full ${p.preview} ring-1 ring-border`} />
            <span className="flex-1">{p.name}</span>
            {palette === p.id && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
