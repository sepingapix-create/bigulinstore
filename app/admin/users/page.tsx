import { getUsersAction } from "@/actions/admin";
import { UsersClient } from "@/components/admin/UsersClient";

export default async function AdminUsersPage() {
  const users = await getUsersAction();

  return <UsersClient initialUsers={users} />;
}
