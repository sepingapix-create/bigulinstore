import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function checkUser() {
  const allUsers = await db.select().from(users);
  console.log("All users in DB:");
  allUsers.forEach(u => {
    console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
  });
}

checkUser();
