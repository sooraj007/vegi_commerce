"use client";

import { Apple, Egg, Carrot, Dumbbell } from "lucide-react";

interface NutritionalValuesProps {
  values: {
    carbohydrates?: string;
    proteins?: string;
    vitamins?: string;
    minerals?: string;
  };
}

export default function NutritionalValues({ values }: NutritionalValuesProps) {
  const nutritionalInfo = [
    {
      name: "Carbohydrates",
      value: values.carbohydrates || "0g",
      icon: Apple,
      color: "bg-[#96C93D]/10 text-[#96C93D]",
    },
    {
      name: "Proteins",
      value: values.proteins || "0g",
      icon: Dumbbell,
      color: "bg-[#DEB887]/10 text-[#DEB887]",
    },
    {
      name: "Vitamins",
      value: values.vitamins || "N/A",
      icon: Carrot,
      color: "bg-[#4B6F44]/10 text-[#4B6F44]",
    },
    {
      name: "Minerals",
      value: values.minerals || "N/A",
      icon: Egg,
      color: "bg-[#A94442]/10 text-[#A94442]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {nutritionalInfo.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-4 rounded-xl bg-card p-4 transition-colors hover:bg-muted"
        >
          <div className={`rounded-full ${item.color} p-3`}>
            <item.icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {item.name}
            </p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
