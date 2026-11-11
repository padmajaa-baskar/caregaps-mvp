import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardIcon = React.ComponentType<{ className?: string }>;

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: CardIcon;
  accent?: "default" | "danger";
}) {
  return (
    <Card className="h-full py-5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p
          className={cn(
            "text-[28px] font-semibold leading-tight tracking-tight tabular-nums",
            accent === "danger" ? "text-destructive" : "text-foreground",
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
