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
  adminLoginWithPass,
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
  password: z
    .string({ required_error: "לא יכול להיות ריק" })
    .nonempty("לא יכול להיות ריק"),
});

export function AdminAuth({ className, ...props }: UserAuthFormProps) {
  // 1. Define your form.
  const [loading, setLoading] = React.useState(false);
  const [mfaId, setMfaId] = React.useState("");
  const [otpId, setOtpId] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  React.useEffect(() => {
    if (isAdminLogged()) {
      window.location.href = "/admin/dashboard";
      return;
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    let hasMfaChallenge = Boolean(mfaId);
    try {
      setLoading(true);
      setError("");
      if (!mfaId) {
        const challengeId = await adminLoginWithPass(
          values.email,
          values.password
        );
        hasMfaChallenge = true;
        setMfaId(challengeId);
      }

      if (!otpId) {
        const requestedOtpId = await requestAdminOTP(values.email);
        setOtpId(requestedOtpId);
      } else {
        if (!otp.trim()) {
          setError("נא להזין את הקוד שהתקבל במייל");
          return;
        }
        await adminLoginWithOTP(otpId, otp.trim(), mfaId);
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      console.error(err);
      setError(
        otpId
          ? "הקוד שגוי או שפג תוקפו. נא לנסות שוב."
          : hasMfaChallenge
            ? "לא ניתן לשלוח קוד. ניתן לנסות שוב."
            : "האימייל או הסיסמה שגויים. נא לנסות שוב."
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
                        readOnly={!!mfaId}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            {!mfaId && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-right text-xxs">
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="סיסמה"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {mfaId && otpId && (
              <>
                <p
                  className="text-right text-sm text-muted-foreground"
                  role="status"
                >
                  {"נשלח קוד אימות למייל. יש להזין אותו להשלמת ההתחברות."}
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
                {otpId
                  ? "לאמת ולהתחבר"
                  : mfaId
                    ? "שליחת קוד"
                    : "להתחבר"}
              </Button>
            )}
            {mfaId && !loading && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setMfaId("");
                  setOtpId("");
                  setOtp("");
                  setError("");
                  form.reset({ email: "", password: "" });
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
