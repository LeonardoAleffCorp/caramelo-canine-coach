import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({ title, showBack = true }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-5 pt-8 pb-2">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-extrabold text-foreground">{title}</h1>
    </div>
  );
}
