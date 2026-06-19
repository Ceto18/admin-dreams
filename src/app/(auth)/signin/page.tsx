import SignInForm from "@/modules/auth/components/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | Dreams Admin",
  description: "Accede a tu cuenta en Dreams Admin",
};

export default function SignInPage() {
  return <SignInForm />;
}