const handler = req => {
  const evt = req.body.evt;

  switch (evt.type) {
    case 'user.created':
      // Extracting properties from evt.data
      const { id, first_name, last_name, image_url, email_addresses, username } = evt.data;

      // Use the extracted properties as needed
      console.log('User created:', { id, first_name, last_name, image_url, email_addresses, username });

      // Return a success response
      return Response.json({ message: 'User created successfully' });

    // Add other cases as needed for different event types

    default:
      console.log('Unhandled event type:', evt.type);
  }
}

// Export the handler if needed
export default handler;
