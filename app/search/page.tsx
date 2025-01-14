"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon, PlusIcon } from 'lucide-react';
import { searchContent } from '@/lib/tmdb';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchResults() {
      if (query) {
        setIsLoading(true);
        try {
          const searchResults = await searchContent(query);
          setResults(searchResults.results);
          setError(null);
        } catch (err) {
          console.error('Error fetching search results:', err);
          setError('Failed to fetch search results. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchResults();
  }, [query]);

  if (isLoading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="mb-6 text-3xl font-bold">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No results found for "{query}"</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
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
                      <Button variant="secondary" size="icon" className="mr-2">
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                      <Button variant="secondary" size="icon">
                        <PlusIcon className="h-6 w-6" />
                      </Button>
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
    </div>
  );
}