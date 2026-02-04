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
} from "../services/UsersService";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  firstname: z.string({
    // invalid_type_error: "foo",
    required_error: "שם פרטי",
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

export function RegistrationForm({ className, ...props }: UserAuthFormProps) {
  // 1. Define your form.
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  React.useEffect(() => {
    if (isLogged()) {
      window.location.href = "/dashboard";
      return;
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setLoading(true);
      await loginWithPass(values.username, "a12345678");
      console.log("HOOORAY");
      setLoading(false);
      // window.location.href = "/dashboard";
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      if (err.response?.code === 400) {
        console.log("ERROR", err);
        // setErr(err.response?.data?.password?.message ?? "Failed to login.");
      }
      console.log(values);
    }
  }

  return (
    <div className={cn("my-2 grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                const { error, formMessageId } = useFormField();
                console.log(error, formMessageId);
                return (
                  <FormItem>
                    <div className="text-right text-xxs">
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="ת.ז." type="number" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
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
  );
}
