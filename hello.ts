import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.128.0/streams/mod.ts";
import{ MongoClient } from "https://deno.land/x/mongo@v0.30.1/mod.ts";
//const client = new MongoClient();
//await client.connect(
//  "mongodb://mongo:password@133.167.44.238:27017/?authSource=othello223&readPreference=primary&ssl=false&directConnection=true",
//);
interface Account {
  _id: ObjectId;
  name: string;
}
async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const filepath = decodeURIComponent(pathname);
  console.log(filepath);
  if (filepath == "/") {
    const file = await Deno.open("./index.html", { read: true });
    const readableStream = readableStreamFromReader(file);
    return new Response(readableStream, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } else if (filepath == "/favicon.ico") {
    const file = await Deno.open("./favicon.ico", { read: true });
    console.log(file);
    const readableStream = readableStreamFromReader(file);
    return new Response(readableStream, {
      status: 200,
      headers: {
        "content-type": "image/x-icon",
      },
    });
  } else {
    if (filepath == "/get_account") {
//      const db = client.database("othello223");
//      const account = db.collection<Account>("account");
//      const all_users = await account.find({ name: { $ne: null } }).toArray();
      const body = JSON.stringify({"name":"yoshiki"}, null, 2);
      return new Response(body, {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    } else {
      try {
        const file = await Deno.open("." + filepath + ".html", { read: true });
        const readableStream = readableStreamFromReader(file);
        return new Response(readableStream, {
          status: 200,
          headers: {
            "content-type": "text/html",
          },
        });
          } catch {
        return new Response("404 Not Found", { status: 404 });
      }
    }
  }
}

serve(handleRequest);
