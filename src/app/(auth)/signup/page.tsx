import SignUpForm from "@/modules/auth/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | Qori Admin",
  description: "Regístrate en Qori y comienza a gestionar tus tarjetas digitales",
};

export default function SignUp() {
  return <SignUpForm />;
}
