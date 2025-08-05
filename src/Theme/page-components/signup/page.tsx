import Link from "next/link";
import RegistrationForm from "./registration-form";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";




export default function SignupPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Sign-up", href: "/sign-up" },
  ];
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="max-w-4xl w-full mx-auto py-12 px-4">
        <h1 className="text-center text-2xl font-medium mb-8">REGISTER</h1>
        <RegistrationForm />
        <div className="text-center mt-4">
          <span className="text-sm">Already A Member? </span>
          <Link href="/sign-in" className="text-sm text-green-700 font-medium">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
