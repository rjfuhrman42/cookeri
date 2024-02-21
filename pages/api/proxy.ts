import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


import Cors from "cors"

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    const { url } = req.query

    await runMiddleware(req, res, cors);
    
    if(!url)  return res.status(400).send('No URL provided');
    console.log('Fetching data from:', url);
    const response = await fetch(url as string);
    const data = await response.text(); 
 
    console.log(data.length)
    res.status(200).send(`${data}`);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
}

