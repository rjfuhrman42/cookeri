export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams
        const url = searchParams.get('url')
    
        if(!url) return new Response('No URL provided', { status: 400 })
        
        const res = await fetch(`${url}`)
        const data = await res.text()
    
        return new Response(data, { status: 200 })
    }
    catch(error) {
      console.error('Error fetching data:', error);
      return new Response('Error fetching data', { status: 500 })
    }
}

  import { type NextRequest } from 'next/server'
 
