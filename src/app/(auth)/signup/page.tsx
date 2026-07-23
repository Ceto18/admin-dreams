import SignUpForm from "@/modules/auth/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | Dreams Admin",
  description: "Regístrate en DreamsPlanetXP y comienza a gestionar tus tarjetas digitales",
};

export default function SignUp() {
  return <SignUpForm />;
}
