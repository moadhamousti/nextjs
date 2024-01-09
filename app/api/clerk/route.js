// app/api/clerk/route.js
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request) {
  const payload = await request.json();
  console.log(payload);
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}