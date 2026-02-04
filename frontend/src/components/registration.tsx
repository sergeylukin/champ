import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import {
  isLogged,
  loginWithPass,
  registerWithPass,
} from "@/services/UsersService";
import { PASS_BACKEND } from "./constants";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  firstname: z.string({
    // invalid_type_error: "foo",
    required_error: "שם פרטי",
  }),
  lastname: z.string({
    // invalid_type_error: "foo",
    required_error: "שם משפחה",
  }),
});
// export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
// try {
//   await loginWithPass(passport, "a12345678");
//   window.location.href = "/apps";
// } catch (err: any) {
//   console.error(err);
//   if (err.response?.code === 400) {
//     setErr(err.response?.data?.password?.message ?? "Failed to login.");
//   }
// }
//   return false;
// }

export function RegistrationForm({
  className,
  email,
  ...props
}: UserAuthFormProps) {
  // 1. Define your form.
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  React.useEffect(() => {
    if (isLogged()) {
      window.location.href = "/onboarding";
      return;
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setLoading(true);
      await registerWithPass(
        email,
        PASS_BACKEND,
        values.firstname,
        values.lastname
      );
      await loginWithPass(email, PASS_BACKEND);
      console.log("HOOORAY");
      setLoading(false);
      window.location.href = "/onboarding";
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      if (err.response?.code === 400) {
        // window.localStorage.setItem('uid', user.id);
        // console.log("ERROR", err);
        // setErr(err.response?.data?.password?.message ?? "Failed to login.");
      }
      console.log(values);
    }
  }

  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight pt-0">
        {"נא להזין שם מלא"}
      </h1>
      <p className="text-lg pt-2 py-6 text-muted-foreground"> </p>
      <div className={cn("my-2 grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-right text-xxs">
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="שם פרטי" type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-right text-xxs">
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input placeholder="שם משפחה" type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2 mt-4">
              {loading ? (
                <Button disabled>
                  <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                  {"טוען"}
                </Button>
              ) : (
                <Button type="submit">{"להתחבר"}</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
