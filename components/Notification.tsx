interface NotificationProps {
  message: string;
  show: boolean;
}

export default function Notification({ message, show }: NotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in-down">
      <p>{message}</p>
    </div>
  );
}