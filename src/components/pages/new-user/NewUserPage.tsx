import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"
import { cache } from "@/hooks/useCache"
import { AppError } from "@/lib/errors"

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type FormData = z.infer<typeof formSchema>

export default function NewUserPage() {
  const navigate = useNavigate()
  const currentUser = cache.useCurrentUser()
  const mutation = api.mutations.useCreateUser()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  if (currentUser.username !== "admin") {
    throw new AppError("forbidden", "This page is only accessible to administrators")
  }

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("User created successfully")
        void navigate("/users")
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="john_doe" />
                </FormControl>
                <FormDescription>Unique username for the new user</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormDescription>Password is required</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create User"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
