import { useState } from "react";
import {
  useMembers,
  useDeleteMember,
  useBranches,
} from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import BranchSwitcher from "../components/BranchSwitcher";
import DialogCreateMember from "../components/DialogCreateMember";
import DialogEditMember from "../components/DialogEditMember";
import { RESTAURANT_ROLES, type ResultMemberByBranch } from "../types";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";

const RestaurantMembersPage = () => {
  const { data: membersData, isLoading: isLoadingMembers } = useMembers();
  const { data: branchesData } = useBranches();
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const deleteMember = useDeleteMember();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMember, setEditMember] = useState<ResultMemberByBranch | null>(
    null,
  );

  const members = Array.isArray(membersData) ? membersData : [];
  const branches = Array.isArray(branchesData) ? branchesData : [];

  const handleEdit = (member: ResultMemberByBranch) => {
    setEditMember(member);
    setEditOpen(true);
  };

  const handleDelete = (member: ResultMemberByBranch) => {
    if (member.role_name === "owner") {
      toast.error("Cannot delete the restaurant owner");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${member.user_name || member.user_email}?`,
      )
    ) {
      deleteMember.mutate(member.member_id!);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        {branches.length > 0 &&
          activeRestaurant?.restaurantRole === RESTAURANT_ROLES.OWNER && (
            <DialogCreateMember open={open} onOpenChange={setOpen} />
          )}
        {editMember && (
          <DialogEditMember
            open={editOpen}
            onOpenChange={setEditOpen}
            member={editMember}
          />
        )}
      </div>
      <BranchSwitcher />
      {isLoadingMembers ? (
        <Skeleton className="h-64 w-full mt-8" />
      ) : branches.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No branches available, please create a branch first to invite
            members.
          </CardContent>
          <Link
            to="/restaurant/branches"
            className="w-fit mx-auto border rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Create Branch
          </Link>
        </Card>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No members yet, select another branch or invite members to this
            branch.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.user_id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">
                    {member.user_name || member.user_email}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {member.user_email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role_name}</Badge>
                  <Badge
                    variant={
                      member.member_status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {member.member_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                {member.role_name !== "owner" &&
                  activeRestaurant?.restaurantRole ===
                    RESTAURANT_ROLES.OWNER && (
                    <>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMembersPage;
