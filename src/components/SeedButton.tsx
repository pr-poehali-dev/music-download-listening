import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SeedButtonProps {
  onComplete: () => void;
}

export function SeedButton({ onComplete }: SeedButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/66d80d7d-cf86-4de0-911a-bd2b2d2198c4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успех!',
          description: `Добавлено ${data.count} треков`,
        });
        onComplete();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить треки',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при загрузке',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={loading}
      variant="outline"
      className="border-accent text-accent hover:bg-accent/10"
    >
      {loading ? (
        <>
          <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
          Загрузка...
        </>
      ) : (
        <>
          <Icon name="Database" size={20} className="mr-2" />
          Загрузить популярные треки
        </>
      )}
    </Button>
  );
}

export default SeedButton;
