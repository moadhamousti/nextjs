import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@lib/actions/user";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Log the values before the verify call
  console.log("svix-id:", svix_id);
  console.log("svix-timestamp:", svix_timestamp);
  console.log("svix-signature:", svix_signature);

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  // Log information for debugging
  console.log("Received webhook payload:", req.body);
  console.log("Event type:", evt?.type);

  // Handle the event
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, image_url, email_addresses, username } =
      evt?.data;

    try {
      await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );

      console.log("User is created or updated");
      return new Response("User is created or updated", {
        status: 200,
      });
    } catch (err) {
      console.error("Error creating or updating user:", err);
      return new Response("Error occurred during user creation/update", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt?.data;
      await deleteUser(id);

      console.log("User is deleted");
      return new Response("User is deleted", {
        status: 200,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Error occurred during user deletion", {
        status: 500,
      });
    }
  }

  // Handle unrecognized event types
  console.log("Unrecognized event type:", eventType);
  return new Response("Unrecognized event type", {
    status: 400,
  });
}
