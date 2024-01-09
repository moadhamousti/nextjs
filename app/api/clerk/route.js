// app/api/clerk/route.js
const { headers } = require('next/headers');
const { Webhook } = require("svix");

const webhookSecret = process.env.WEBHOOK_SECRET || '';

async function validateRequest(request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id") || '',
    "svix-timestamp": headerPayload.get("svix-timestamp") || '',
    "svix-signature": headerPayload.get("svix-signature") || '',
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders);
}

async function POST(request) {
  const payload = await validateRequest(request);
  console.log(payload);
  return Response.json({ message: "Received" });
}

module.exports = POST;
