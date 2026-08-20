import { cn } from '@/utils/cn';

const statuses = [
  'pending', 'received', 'washing', 'drying', 'ironing', 
  'quality_check', 'ready', 'out_for_delivery', 'completed'
];

export const OrderTimeline = ({ currentStatus }: { currentStatus: string }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex justify-between w-full">
      {statuses.map((status, index) => (
        <div key={status} className={cn(
          "flex-1 text-center text-xs p-2",
          index <= currentIndex ? "text-primary-600 font-bold" : "text-gray-400"
        )}>
          {status.replace('_', ' ')}
        </div>
      ))}
    </div>
  );
};
