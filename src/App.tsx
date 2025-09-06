import { Dashboard } from "./Presentation/pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-1 bg-green-600 text-white shadow"></header>
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
