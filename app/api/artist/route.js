export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing artist ID' }), {
        status: 400,
      });
    }
  
    const res = await fetch(`https://api.deezer.com/artist/${id}/top?limit=10`);
    const data = await res.json();
  
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }