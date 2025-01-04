import { Truck, Leaf, Award, Clock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100"
    },
    {
      icon: Leaf,
      title: "Always Fresh",
      description: "100% organic products"
    },
    {
      icon: Award,
      title: "Superior Quality",
      description: "Best quality products"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Customer support"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <feature.icon className="h-10 w-10 text-orange-500" />
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

