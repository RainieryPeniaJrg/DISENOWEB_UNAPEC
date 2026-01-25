type IconProps = { name: "logout" | "user" | "sun" | "moon" | "menu" | "menu-open" };

export function Icon({ name }: IconProps) {
  const map: Record<IconProps["name"], string> = {
    logout: "⇦",
    user: "👤",
    sun: "☀️",
    moon: "🌙",
    menu: "☰",
    "menu-open": "☷",
  };
  return <span aria-hidden>{map[name]}</span>;
}
