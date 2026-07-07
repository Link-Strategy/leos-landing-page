const { connectDb } = require("./utils.cjs");

async function main() {
  const { client, db } = await connectDb();
  try {
    const list = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray();
    console.log("CONTACT_LEADS_LIST_START");
    console.log(JSON.stringify(list.map(l => ({
      id: l._id,
      name: l.name,
      email: l.email,
      company: l.company || null,
      phone: l.phone || null,
      message: l.message || null,
      createdAt: l.createdAt
    })), null, 2));
    console.log("CONTACT_LEADS_LIST_END");
  } finally {
    await client.close();
  }
}
main().catch(console.error);
