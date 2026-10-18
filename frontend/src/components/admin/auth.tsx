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
} from "@/components/ui/form";
import {
  adminLoginWithOTP,
  isAdminLogged,
  requestAdminOTP,
} from "@/services/UsersService";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string({
      required_error: "לא יכול להיות ריק",
    })
    .email("נה להכניס כתובת מייל תקינה")
    .min(5),

});

export function AdminAuth({ className, ...props }: UserAuthFormProps) {
  // 1. Define your form.
  const [loading, setLoading] = React.useState(false);
  const [otpId, setOtpId] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });
  React.useEffect(() => {
    if (isAdminLogged()) {
      window.location.href = "/admin/dashboard";
      return;
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setError("");
      if (!otpId) {
        const requestedOtpId = await requestAdminOTP(values.email);
        setOtpId(requestedOtpId);
      } else {
        if (!otp.trim()) {
          setError("נא להזין את הקוד שהתקבל במייל");
          return;
        }
        await adminLoginWithOTP(otpId, otp.trim());
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      console.error(err);
      setError(
        otpId
          ? "הקוד שגוי או שפג תוקפו. נא לנסות שוב."
          : "לא ניתן לשלוח קוד לכתובת הזו. נא לבדוק את הכתובת ולנסות שוב."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("my-2 grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="text-right text-xxs">
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="אימייל"
                        type="email"
                        autoComplete="email"
                        readOnly={!!otpId}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            {otpId && (
              <>
                <p className="text-right text-sm text-muted-foreground" role="status">
                  {"אם כתובת המייל משויכת למנהל, נשלח אליה קוד התחברות."}
                </p>
                <Input
                  placeholder="קוד חד-פעמי"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </>
            )}
            {error && (
              <p className="text-right text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {loading ? (
              <Button disabled className="bg-red-300">
                <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                {"טוען"}
              </Button>
            ) : (
              <Button type="submit" className="bg-red-500 hover:bg-red-300">
                {otpId ? "לאמת ולהתחבר" : "שליחת קוד"}
              </Button>
            )}
            {otpId && !loading && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setOtpId("");
                  setOtp("");
                  setError("");
                }}
              >
                {"שינוי כתובת מייל"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
