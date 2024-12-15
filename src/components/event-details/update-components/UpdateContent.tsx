import type { Update } from "../types";

interface UpdateContentProps {
  update: Update;
}

export const UpdateContent = ({ update }: UpdateContentProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold break-words">{update.title}</h3>
        <p className="text-sm text-muted-foreground">
          {formatDate(update.date)}
        </p>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <p>{update.message}</p>
      </div>
    </div>
  );
};