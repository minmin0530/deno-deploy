import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import * as path from "https://deno.land/std@0.128.0/path/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.128.0/streams/mod.ts";
import{ MongoClient } from "https://deno.land/x/mongo@v0.30.1/mod.ts";
const client = new MongoClient();
await client.connect(
  "mongodb://mongo:password@133.167.44.238:27017/?authSource=othello223&readPreference=primary&ssl=false&directConnection=true",
);
interface Account {
  _id: ObjectId;
  name: string;
}




// Start listening on port 8080 of localhost.
// const server = Deno.listen({ port: 8000 });
// console.log("File server running on http://localhost:8000/");

// for await (const conn of server) {
//   handleHttp(conn);
// }

function handler(_req: Request) {
  const data = {
    name: "yoshiki",
  };
  const body = JSON.stringify(data, null, 2);
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const filepath = decodeURIComponent(pathname);

// async function handleHttp(conn: Deno.Conn): Promise<Response>  {
//   const httpConn = Deno.serveHttp(conn);
//   for await (const requestEvent of httpConn) {
//     // Use the request pathname as filepath
//     const url = new URL(requestEvent.request.url);
//     const filepath = decodeURIComponent(url.pathname);

//     console.log(filepath);
    // Try opening the file
    // try {
      // file = await Deno.open("." + filepath, { read: true });
      // const stat = await file.stat();

      // // If File instance is a directory, lookup for an index.html
      // console.log(stat.isDirectory);
      // // if (stat.isDirectory) {
      //   file.close();
        // const filePath = path.join(".", filepath, "index.html");
        // console.log(filePath);
        if (filepath == "/") {
         const file = await Deno.open("./index.html", { read: true });
          // await (async () => {
          // const output = await renderFile(`${cwd()}/index.ejs`, { name: "yoshiki" });
          

            const readableStream = readableStreamFromReader(file);

            // Build and send the response
            return new Response(file, {
              headers: {
                "content-type": "text/html",
              },
            });
//            await requestEvent.respondWith(response);
        
          // })();
          

          
        } else {
          if (filepath == "/get_account") {
            const db = client.database("othello223");
            const account = db.collection<Account>("account");
            const all_users = await account.find({ name: { $ne: null } }).toArray();
  
            return new Response(JSON.parse(JSON.stringify(all_users)), {
              status: 200,
              headers: {
                "content-type": "application/json",
              },
            });
            // const response = new Response(responseData);
            // await requestEvent.respondWith(response);

          } else {
            try {
              const file = await Deno.open("." + filepath + ".html", { read: true });

//              const readableStream = readableStreamFromReader(file);

              // Build and send the response
              return new Response(file, {
                headers: {
                  "content-type": "text/html",
                },
              });
                // await requestEvent.respondWith(response);
          
            } catch {
              return new Response("404 Not Found", { status: 404 });
              // await requestEvent.respondWith(notFoundResponse);
              // return;  
            }
          }
        }
      // }
    // } catch {
    //   // If the file cannot be opened, return a "404 Not Found" response
    //   const notFoundResponse = new Response("404 Not Found", { status: 404 });
    //   await requestEvent.respondWith(notFoundResponse);
    //   return;
    // }

    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
//  }
}

serve(handleRequest);