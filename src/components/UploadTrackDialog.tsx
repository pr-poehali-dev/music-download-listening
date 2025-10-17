import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface UploadTrackDialogProps {
  onTrackUploaded: () => void;
}

export function UploadTrackDialog({ onTrackUploaded }: UploadTrackDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Synthwave',
    duration: '',
    audioUrl: '',
    coverUrl: ''
  });
  const { toast } = useToast();

  const genres = ['Synthwave', 'Electronic', 'Cyberpunk', 'Techno', 'House', 'Ambient'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artist || !formData.audioUrl) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/143927f6-1dc4-4923-b7ac-bd22dc1c91c8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успех!',
          description: 'Трек успешно загружен',
        });
        setFormData({
          title: '',
          artist: '',
          genre: 'Synthwave',
          duration: '',
          audioUrl: '',
          coverUrl: ''
        });
        setOpen(false);
        onTrackUploaded();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить трек',
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 neon-border-magenta font-semibold">
          <Icon name="Upload" size={20} className="mr-2" />
          Загрузить трек
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-2xl text-primary">Загрузить трек</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Добавь свою музыку в киберпространство
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Название трека *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Neon Dreams"
              className="bg-muted border-primary/30 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist" className="text-foreground">Исполнитель *</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              placeholder="CyberSynth"
              className="bg-muted border-primary/30 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-foreground">Жанр *</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
              <SelectTrigger className="bg-muted border-primary/30 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-foreground">Длительность</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="3:45"
              className="bg-muted border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl" className="text-foreground">Ссылка на аудио *</Label>
            <Input
              id="audioUrl"
              value={formData.audioUrl}
              onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
              placeholder="https://example.com/track.mp3"
              className="bg-muted border-primary/30 focus:border-primary"
              required
            />
            <p className="text-xs text-muted-foreground">Загрузите файл на облачное хранилище и вставьте прямую ссылку</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverUrl" className="text-foreground">Ссылка на обложку</Label>
            <Input
              id="coverUrl"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              className="bg-muted border-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 neon-border"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-muted-foreground/30"
            >
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadTrackDialog;
