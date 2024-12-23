import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const daysUntilDue = () => {
    const now = new Date();
    const due = new Date(project.endDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status.replace('_', ' ').charAt(0).toUpperCase() +
            project.status.slice(1).replace('_', ' ')}
        </span>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-gray-600">{project.progress}% complete</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Due {formatDate(project.endDate)}</span>
        </div>
        <div className="flex items-center">
          {project.status !== 'completed' && daysUntilDue() <= 7 && (
            <div className="flex items-center text-orange-600 mr-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>{daysUntilDue()} days left</span>
            </div>
          )}
          <div className="flex -space-x-2">
            {project.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={index}
                className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
              >
                <span className="text-xs font-medium">
                  {assignee.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
            {project.assignees.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{project.assignees.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Upcoming Milestones</h4>
        <div className="space-y-2">
          {project.milestones
            .filter(m => m.status === 'pending')
            .slice(0, 2)
            .map(milestone => (
              <div
                key={milestone.id}
                className="flex items-center text-sm text-gray-600"
              >
                <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                <span>{milestone.title}</span>
                <span className="ml-auto">{formatDate(milestone.dueDate)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}