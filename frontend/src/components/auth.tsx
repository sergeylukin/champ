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
import { LoginForm } from "@/components/login";
import { RegistrationForm } from "@/components/registration";

import {
  isLogged,
  loginWithPass,
  registerWithPass,
} from "../services/UsersService";

export function AuthForm({ className, ...props }: UserAuthFormProps) {
  // 1. Define your form.
  const [step, setStep] = React.useState("login");
  const [email, setEmail] = React.useState("");
  React.useEffect(() => {
    if (isLogged()) {
      window.location.href = "/dashboard";
      return;
    }
  }, []);

  const next = (email) => {
    console.log("heeeee", email);
    setEmail(email);
    setStep("registration");
  };

  return (
    <div className={"px-4 md:px-12"}>
      {step === "login" ? (
        <LoginForm next={next} />
      ) : (
        <RegistrationForm email={email} />
      )}
    </div>
  );
}
