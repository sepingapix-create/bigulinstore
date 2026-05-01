import { InventoryDashboard } from "@/components/admin/InventoryDashboard";

export const metadata = {
  title: "Gestão de Estoque | Admin",
  description: "Gerenciamento de estoque digital da Bingulin.",
};

export default function AdminInventoryPage() {
  return (
    <div className="container mx-auto py-6">
      <InventoryDashboard />
    </div>
  );
}
