import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { useBranches, useCreateMember } from "../hooks/restaurant-hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { inviteSchema, type InviteFormValues } from "../schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const DialogCreateMember = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const createMember = useCreateMember();
  const { data: branchesData } = useBranches();
  const branches = Array.isArray(branchesData) ? branchesData : [];

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "staff",
      branchIds: [],
    },
  });

  const onSubmit = (values: InviteFormValues) => {
    if (values.branchIds?.length === 0) {
      toast.error("Please select at least one branch.");
      return;
    }
    createMember.mutate(
      {
        email: values.email,
        name: values.name || undefined,
        role: values.role,
        branchIds: values.branchIds ?? [],
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  autoComplete="email"
                  placeholder="Member email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  autoComplete="name"
                  placeholder="Member name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />


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

          <div>
            <Label className="mb-2">Assign Branches</Label>
            {branches.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={b.id}
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
            disabled={createMember.isPending}
          >
            Send Invitation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMember;
