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
  findUser,
  loginWithPass,
  registerWithPass,
} from "@/services/UsersService";
import { PASS, PASS_BACKEND } from "./constants";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string({
      required_error: "לא יכול להיות ריק",
    })
    .email("נה להכניס כתובת מייל תקינה")
    .min(5),

  password: z
    .string({
      required_error: "לא יכול להיות ריק",
    })
    .nonempty("לא יכול להיות ריק")
    .includes(PASS, {
      message: "ערך שגוי",
    })
    .max(PASS.length, {
      message: "ערך שגוי",
    }),
});

export function LoginForm({ className, next, ...props }: UserAuthFormProps) {
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
      const userExists = await findUser(values.email);
      if (userExists) {
        await loginWithPass(values.email, PASS_BACKEND);
        setLoading(false);
        window.location.href = "/dashboard";
      } else {
        next(values.email);
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      if (err.response?.code === 400) {
        // window.localStorage.setItem('uid', user.id);
        console.log("ERROR", err);
        // setErr(err.response?.data?.password?.message ?? "Failed to login.");
      }
      console.log(values);
    }
  }

  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight pt-0">{"כניסה"}</h1>
      <p className="text-lg pt-2 text-muted-foreground">
        {"אנא הזן פרטי כניסה לאתר ההערכה"}
      </p>
      <div className={cn("my-2 grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  const { error, formMessageId } = useFormField();
                  console.log(error, formMessageId);
                  return (
                    <FormItem>
                      <div className="text-right text-xxs">
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="הזן כתובת מייל"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const { error, formMessageId } = useFormField();
                  console.log(error, formMessageId);
                  return (
                    <FormItem>
                      <div className="text-right text-xxs">
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="הזן סיסמה"
                          type="password"
                          {...field}
                        />
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
                <Button className="mt-2" type="submit">
                  {"להתחבר"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
