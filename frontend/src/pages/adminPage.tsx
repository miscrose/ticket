import AdminTable from "@/components/adminTable";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administration
        </h1>
     
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des utilisateurs
          </h2>
          <AdminTable />
        </div>
      </div>
    </div>
  );
}
