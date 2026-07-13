import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAgents } from "../hooks/admin-hooks";
import { Loader } from "@/components/shared/Loader";


const AdminAgentListPage = () => {
  const { data, isLoading } = useAdminAgents();


  const agents = data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delivery Agents</h1>

      {isLoading ? (
        <Loader viewType="table" count={5} />
      ) : agents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No agents found.</p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.phone ?? "—"}</TableCell>
                  <TableCell>
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/admin/agents/${a.id}`}
                      className="text-primary underline text-sm"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminAgentListPage;
