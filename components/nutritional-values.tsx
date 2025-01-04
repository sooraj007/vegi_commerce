import { Apple, Egg, Carrot, Dumbbell } from 'lucide-react'

export default function NutritionalValues() {
  const nutritionalInfo = [
    { 
      name: "Carbohydrates", 
      value: "17g", 
      icon: Apple,
      color: "bg-[#96C93D]/10 text-[#96C93D]" 
    },
    { 
      name: "Proteins", 
      value: "5g", 
      icon: Dumbbell,
      color: "bg-[#DEB887]/10 text-[#DEB887]"
    },
    { 
      name: "Vitamins", 
      value: "A, C, K", 
      icon: Carrot,
      color: "bg-[#4B6F44]/10 text-[#4B6F44]"
    },
    { 
      name: "Minerals", 
      value: "Ca, Fe", 
      icon: Egg,
      color: "bg-[#A94442]/10 text-[#A94442]"
    }
  ]

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
            <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

