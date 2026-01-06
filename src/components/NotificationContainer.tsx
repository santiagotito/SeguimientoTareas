import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Notification, NotificationType } from '../hooks/useNotifications';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />
};

const colorMap: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
};

const iconColorMap: Record<NotificationType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500'
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${colorMap[notification.type]}
            border rounded-lg p-4 shadow-lg
            flex items-start gap-3
            animate-in slide-in-from-right duration-300
          `}
        >
          <div className={iconColorMap[notification.type]}>
            {iconMap[notification.type]}
          </div>
          <p className="flex-1 text-sm font-medium">
            {notification.message}
          </p>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
