export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
  
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), {
        status: 400,
      });
    }
  
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
  
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  