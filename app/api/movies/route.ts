import { NextResponse } from 'next/server';
import { readMovieCache, writeMovieCache, fetchMovieData } from '@/lib/movieCache';

export async function POST(request: Request) {
  try {
    const { titles } = await request.json();
    
    if (!Array.isArray(titles)) {
      return NextResponse.json({ error: 'Invalid titles array' }, { status: 400 });
    }

    const cache = readMovieCache();
    const results: Record<string, any> = {};
    let cacheUpdated = false;

    for (const title of titles) {
      if (cache[title]) {
        // Use cached data
        results[title] = cache[title];
      } else {
        // Fetch from API and cache it
        const data = await fetchMovieData(title);
        if (data) {
          cache[title] = data;
          results[title] = data;
          cacheUpdated = true;
        }
      }
    }

    // Update cache file if new data was fetched
    if (cacheUpdated) {
      writeMovieCache(cache);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in movies API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
