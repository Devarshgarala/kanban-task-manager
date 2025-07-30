import TaskBoard from "../components/TaskBoard";

export default function Home() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Kanban Task Manager</h1>
      <TaskBoard />
    </div>
  );
}
