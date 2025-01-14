"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { fetchTrending } from '@/lib/tmdb';
import VideoModal from './VideoModal';
import AddToMyStuffButton from './AddToMyStuffButton';

interface Content {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: string;
}

export default function ContentGrid() {
  const [content, setContent] = useState<Content[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await fetchTrending();
        setContent(data.results);
      } catch (err) {
        console.error('Error fetching trending content:', err);
        setError('Failed to fetch trending content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handlePlay = (item: Content) => {
    setSelectedContent(item);
  };

  if (isLoading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="mb-6 text-3xl font-bold">Trending Now</h2>
      {content.length === 0 ? (
        <p>No content available. Please try again later.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {content.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.jpg'}
                    alt={item.title || item.name}
                    className="h-full w-full object-cover"
                  />
                  {hoveredId === item.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-opacity">
                      <Button variant="secondary" size="icon" className="mr-2" onClick={() => handlePlay(item)}>
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                      <AddToMyStuffButton content={item} />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="text-lg font-semibold">{item.title || item.name}</h3>
                <p className="text-sm text-gray-500">{item.media_type}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {selectedContent && (
        <VideoModal
          isOpen={!!selectedContent}
          onClose={() => setSelectedContent(null)}
          title={selectedContent.title || selectedContent.name || ''}
          mediaType={selectedContent.media_type}
        />
      )}
    </div>
  );
}