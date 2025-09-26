import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

const formSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(2).max(100),
})

type LoginForm = z.infer<typeof formSchema>

export default function LoginPage() {
  const loginMutation = api.mutations.useLogin()

  const form = useForm<LoginForm>({ resolver: zodResolver(formSchema), defaultValues: { username: "", password: "" } })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Logged in successfully")
        // We use window.location.href instead of navigate() because:
        // 1. After login, the auth token is set and queries are invalidated
        // 2. With client-side navigation, Layout component renders immediately
        // 3. Layout checks for currentUser which is still loading after invalidation
        // 4. This causes Layout to redirect back to /login before the query completes
        // 5. Full page reload ensures queries are prefetched before Layout renders
        window.location.href = "/"
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>SpaceNote</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-64">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="username" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" placeholder="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginMutation.error && <ErrorMessage error={loginMutation.error} />}
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
