export default function AboutPage() {
  return (
    <main className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">About Us</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Welcome to FreshMart</h2>
          <p className="text-muted-foreground">
            At FreshMart, we're passionate about bringing the freshest,
            highest-quality organic produce directly to your table. Our journey
            began with a simple mission: to make healthy, sustainable food
            accessible to everyone while supporting local farmers and
            sustainable agriculture.
          </p>
          <p className="text-muted-foreground">
            We carefully select each product in our inventory, working directly
            with trusted farmers and producers who share our commitment to
            quality, sustainability, and ethical farming practices.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We never compromise on quality, ensuring that every product
                meets our high standards.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Our practices prioritize environmental responsibility and
                sustainable farming methods.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Community Focus</h3>
              <p className="text-sm text-muted-foreground">
                We support local farmers and contribute to building stronger,
                healthier communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
