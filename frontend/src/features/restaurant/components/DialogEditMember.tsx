import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useBranches, useUpdateMember } from "../hooks/restaurant-hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { ResultMemberByBranch } from "../types";
import { editMemberSchema, type EditMemberFormValues } from "../schemas";
import { toast } from "sonner";

const DialogEditMember = ({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ResultMemberByBranch | null;
}) => {
  const updateMember = useUpdateMember();
  const { data: branchesData } = useBranches();
  const branches = Array.isArray(branchesData) ? branchesData : [];

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      role: "",
      status: "",
      branchIds: [],
    },
  });

  const brandsIdWatch = useWatch({ control: form.control, name: "branchIds" });

  useEffect(() => {
    if (member) {
      form.reset({
        role: member.role_name,
        status: member.member_status,
        branchIds: member.branchIds,
      });
    }
  }, [member, form]);

  const onSubmit = (values: EditMemberFormValues) => {
    if (!member?.member_id) return;
    if (values.branchIds?.length === 0) {
      toast.error("Please select at least one branch.");
      return;
    }
    updateMember.mutate(
      {
        memberId: member.member_id,
        data: {
          role: values.role,
          status: values.status,
          branchIds: values.branchIds,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch_manager">
                      Branch Manager
                    </SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <div>
            <Label className="mb-2">Assign Branches</Label>
            {branches.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={b.id}
                  checked={brandsIdWatch?.includes(b.id)}
                  onChange={(e) => {
                    const ids = form.getValues("branchIds") ?? [];
                    if (e.target.checked) {
                      form.setValue("branchIds", [...ids, b.id]);
                    } else {
                      form.setValue(
                        "branchIds",
                        ids.filter((id) => id !== b.id),
                      );
                    }
                  }}
                />
                {b.label}
              </label>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateMember.isPending}
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditMember;
