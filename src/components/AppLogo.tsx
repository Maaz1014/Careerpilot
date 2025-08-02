import { Bot } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center space-x-2">
      <Bot className="h-6 w-6 text-primary" />
      <span className="font-heading font-bold text-xl">CareerPilot</span>
    </div>
  );
}
