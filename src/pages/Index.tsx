import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  plays: number;
  likes: number;
  coverUrl: string;
}

interface Artist {
  id: number;
  name: string;
  followers: string;
  tracks: number;
  avatarUrl: string;
}

const mockTracks: Track[] = [
  {
    id: 1,
    title: 'Neon Dreams',
    artist: 'CyberSynth',
    duration: '3:45',
    genre: 'Synthwave',
    plays: 125000,
    likes: 8500,
    coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400'
  },
  {
    id: 2,
    title: 'Digital Rain',
    artist: 'Matrix Sound',
    duration: '4:12',
    genre: 'Electronic',
    plays: 98000,
    likes: 6200,
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400'
  },
  {
    id: 3,
    title: 'Chrome Hearts',
    artist: 'Pulse Wave',
    duration: '3:28',
    genre: 'Cyberpunk',
    plays: 156000,
    likes: 12400,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'
  },
  {
    id: 4,
    title: 'Virtual Reality',
    artist: 'Neural Net',
    duration: '5:03',
    genre: 'Techno',
    plays: 87500,
    likes: 5100,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
  },
  {
    id: 5,
    title: 'Electric Soul',
    artist: 'Synth Master',
    duration: '3:55',
    genre: 'Synthwave',
    plays: 142000,
    likes: 9800,
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'
  },
  {
    id: 6,
    title: 'Cyber Streets',
    artist: 'Night Runner',
    duration: '4:30',
    genre: 'Electronic',
    plays: 103000,
    likes: 7300,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400'
  }
];

const mockArtists: Artist[] = [
  { id: 1, name: 'CyberSynth', followers: '125K', tracks: 48, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=cybersynth' },
  { id: 2, name: 'Matrix Sound', followers: '98K', tracks: 36, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=matrix' },
  { id: 3, name: 'Pulse Wave', followers: '156K', tracks: 52, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=pulse' },
  { id: 4, name: 'Neural Net', followers: '87K', tracks: 29, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=neural' }
];

export default function Index() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', 'Synthwave', 'Electronic', 'Cyberpunk', 'Techno'];

  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <header className="border-b border-primary/30 sticky top-0 backdrop-blur-lg bg-background/80 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-orbitron font-bold neon-glow">NEON<span className="text-secondary neon-glow-magenta">BEATS</span></h1>
            <nav className="flex gap-6">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Icon name="Home" size={20} className="mr-2" />
                Главная
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Icon name="Music" size={20} className="mr-2" />
                Каталог
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Icon name="ListMusic" size={20} className="mr-2" />
                Плейлисты
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Icon name="User" size={20} className="mr-2" />
                Профиль
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-lg neon-border p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="relative z-10">
              <h2 className="text-5xl font-orbitron font-black mb-4 neon-glow">
                Музыка будущего
              </h2>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Слушай, скачивай и публикуй треки в киберпространстве
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 neon-border font-semibold">
                  <Icon name="Play" size={20} className="mr-2" />
                  Начать слушать
                </Button>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 neon-border-magenta font-semibold">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить трек
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-neon"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }}></div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск треков или исполнителей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              {genres.map(genre => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "bg-primary text-primary-foreground" : "border-primary/30"}
                >
                  {genre === 'all' ? 'Все' : genre}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="bg-card border border-primary/30 mb-6">
            <TabsTrigger value="tracks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Music" size={18} className="mr-2" />
              Треки
            </TabsTrigger>
            <TabsTrigger value="artists" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" size={18} className="mr-2" />
              Исполнители
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ListMusic" size={18} className="mr-2" />
              Плейлисты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            {filteredTracks.map((track) => (
              <Card key={track.id} className="bg-card border-primary/30 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="w-16 h-16 rounded object-cover border-2 border-primary/50"
                    />
                    <div className="flex-1">
                      <h3 className="font-orbitron font-semibold text-lg text-primary">{track.title}</h3>
                      <p className="text-muted-foreground">{track.artist}</p>
                      <div className="flex gap-3 mt-1">
                        <Badge variant="outline" className="border-accent text-accent">
                          {track.genre}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="Play" size={14} />
                          {formatNumber(track.plays)}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="Heart" size={14} />
                          {formatNumber(track.likes)}
                        </span>
                      </div>
                    </div>
                    <span className="text-muted-foreground font-mono">{track.duration}</span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => playTrack(track)}
                        className="border-primary/50 hover:bg-primary hover:text-primary-foreground neon-border"
                      >
                        <Icon name="Play" size={20} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-secondary/50 hover:bg-secondary hover:text-secondary-foreground neon-border-magenta"
                      >
                        <Icon name="Download" size={20} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-accent/50 hover:bg-accent hover:text-accent-foreground"
                      >
                        <Icon name="Heart" size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="artists" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockArtists.map((artist) => (
              <Card key={artist.id} className="bg-card border-primary/30 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 animate-slide-up">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                    <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                    <AvatarFallback>{artist.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-orbitron font-semibold text-xl text-primary mb-2">{artist.name}</h3>
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={14} />
                      {artist.followers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Music" size={14} />
                      {artist.tracks}
                    </span>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-border">
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Подписаться
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="playlists">
            <Card className="bg-card border-primary/30 p-8 text-center">
              <Icon name="ListMusic" size={64} className="mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-2xl font-bold mb-2">Скоро появятся плейлисты</h3>
              <p className="text-muted-foreground mb-6">Создавай свои коллекции любимых треков</p>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 neon-border-magenta">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать плейлист
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-primary neon-border z-50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-14 h-14 rounded object-cover border-2 border-primary"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-orbitron font-semibold text-primary truncate">{currentTrack.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Icon name="Shuffle" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Icon name="SkipBack" size={20} />
                </Button>
                <Button 
                  size="icon" 
                  onClick={togglePlay}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-12 h-12 neon-border"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Icon name="SkipForward" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Icon name="Repeat" size={20} />
                </Button>
              </div>

              <div className="flex items-center gap-2 min-w-[200px]">
                <Icon name="Volume2" size={20} className="text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-32"
                />
              </div>

              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="hover:text-secondary">
                  <Icon name="Heart" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Icon name="ListMusic" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}