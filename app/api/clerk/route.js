// Import necessary modules
import { Webhook } from "svix";
import { createOrUpdateUser, deleteUser } from "@lib/actions/user";

// Webhook endpoint handler
export async function POST(req) {
  // Obtain the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  // Validate the webhook secret
  if (!WEBHOOK_SECRET || typeof WEBHOOK_SECRET !== 'string') {
    throw new Error("Invalid or missing WEBHOOK_SECRET");
  }

  // Get the necessary headers from the request
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If any required header is missing, return an error response
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- missing svix headers", {
      status: 400,
    });
  }

  // Get the JSON payload from the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the event type
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const userData = evt?.data;

    if (userData) {
      const { id, first_name, last_name, image_url, email_addresses, username } = userData;

      try {
        // Create or update user based on the event data
        await createOrUpdateUser(id, first_name, last_name, image_url, email_addresses, username);

        // Return a success response
        return new Response("User is created or updated", {
          status: 200,
        });
      } catch (err) {
        console.error("Error creating or updating user:", err);
        return new Response("Error occurred", {
          status: 500,
        });
      }
    }
  }

  if (eventType === "user.deleted") {
    const userData = evt?.data;

    if (userData) {
      const { id } = userData;

      try {
        // Delete user based on the event data
        await deleteUser(id);

        // Return a success response
        return new Response("User is deleted", {
          status: 200,
        });
      } catch (err) {
        console.error("Error deleting user:", err);
        return new Response("Error occurred", {
          status: 500,
        });
      }
    }
  }

  // Handle unhandled event types
  console.log('Unhandled event type:', eventType);
  return new Response("Unhandled event type", {
    status: 400,
  });
}
