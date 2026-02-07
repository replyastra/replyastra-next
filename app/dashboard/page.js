export default function Dashboard() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black/20 p-6">
        <h2 className="text-xl font-bold mb-6">ReplyAstra</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Automations</li>
          <li>Analytics</li>
          <li>Logout</li>
        </ul>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-4">
          Welcome 👋
        </h1>
        <p className="text-white/80">
          Your DM automation dashboard will appear here.
        </p>
      </main>
    </div>
  );
}
