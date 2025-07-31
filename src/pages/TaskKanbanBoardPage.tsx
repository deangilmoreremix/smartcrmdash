import React from 'react';
import { TaskKanbanBoard as TaskBoard } from '../components/TaskKanbanBoard';

const TaskKanbanBoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Tracker</h1>
        <TaskBoard />
      </div>
    </div>
  );
};

export default TaskKanbanBoardPage;
