import { cn } from '@/utils/cn';

const statuses = [
  'pending', 'received', 'washing', 'drying', 'ironing', 
  'quality_check', 'ready', 'out_for_delivery', 'completed'
];

export const OrderTimeline = ({ currentStatus }: { currentStatus: string }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow">
      {statuses.map((status, index) => (
        <div key={status} className={cn(
          "text-xs px-2 py-1 rounded",
          index <= currentIndex ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-500"
        )}>
          {status.replace('_', ' ').toUpperCase()}
        </div>
      ))}
    </div>
  );
};
