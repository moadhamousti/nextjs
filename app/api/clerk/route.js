export async function POST(request) {
  const payload = await request.json();
  console.log(payload);
  return Response.json({ message: "Received" });
}