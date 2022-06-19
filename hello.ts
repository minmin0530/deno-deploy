import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import * as path from "https://deno.land/std@0.128.0/path/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.128.0/streams/mod.ts";
import{ MongoClient } from "https://deno.land/x/mongo@v0.30.1/mod.ts";
const client = new MongoClient();
await client.connect(
  "mongodb://mongo:password@133.167.44.238:27017/?authSource=othello223&readPreference=primary&ssl=false&directConnection=true",
);





// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8000 });
console.log("File server running on http://localhost:8000/");

for await (const conn of server) {
  handleHttp(conn);
}

async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // Use the request pathname as filepath
    const url = new URL(requestEvent.request.url);
    const filepath = decodeURIComponent(url.pathname);

    console.log(filepath);
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
          const file = await Deno.open("./index.ejs", { read: true });
          const output = await renderFile(file, { name: "yoshiki" });

          const readableStream = await readableStreamFromReader(output);

          // Build and send the response
          const response = await new Response(readableStream);
          await requestEvent.respondWith(response);
          

          
        } else {
          try {
            const file = await Deno.open("." + filepath + ".html", { read: true });

            const readableStream = readableStreamFromReader(file);

            // Build and send the response
            const response = new Response(readableStream);
            await requestEvent.respondWith(response);
        
          } catch {
            const notFoundResponse = new Response("404 Not Found", { status: 404 });
            await requestEvent.respondWith(notFoundResponse);
            return;  
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
  }
}


