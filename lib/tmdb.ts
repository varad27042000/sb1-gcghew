const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

console.log('API_KEY:', API_KEY ? 'Set' : 'Not set');

if (!API_KEY) {
  console.error('TMDB API key is not set. Please check your environment variables.');
}

async function fetchFromTMDB(endpoint: string) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not set');
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log('Fetching from URL:', url.replace(API_KEY, 'API_KEY'));

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error in fetchFromTMDB:', error);
    throw error;
  }
}

export async function fetchTrending() {
  return fetchFromTMDB(`/trending/all/week?api_key=${API_KEY}&language=en-US`);
}

export async function fetchPopularTVShows() {
  return fetchFromTMDB(`/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
}

export async function searchContent(query: string) {
  return fetchFromTMDB(`/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
}

export async function fetchContentDetails(id: string, mediaType: string) {
  return fetchFromTMDB(`/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`);
}