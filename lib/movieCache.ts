import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'moviesCache.json');

interface MovieData {
  Title: string;
  Year: string;
  Genre: string;
  imdbRating: string;
  Plot: string;
  Poster: string;
  Runtime: string;
}

type MovieCache = Record<string, MovieData>;

export function readMovieCache(): MovieCache {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export function writeMovieCache(cache: MovieCache): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error writing movie cache:', error);
  }
}

export async function fetchMovieData(title: string): Promise<MovieData | null> {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=9ee1e7a2&t=${encodeURIComponent(title)}`
    );
    const json = await response.json();
    
    if (json.Response === "True") {
      return {
        Title: json.Title,
        Year: json.Year,
        Genre: json.Genre,
        imdbRating: json.imdbRating,
        Plot: json.Plot,
        Poster: json.Poster,
        Runtime: json.Runtime,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching movie data for ${title}:`, error);
    return null;
  }
}
