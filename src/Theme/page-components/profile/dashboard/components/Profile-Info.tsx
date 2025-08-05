// app/profile/dashboard/_components/Profile-Info.tsx
import { User, Edit, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAuthUser } from "@/services/Auth-Token";
import { PersonInfo } from "@/Theme/types/profile";

import { logoutUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
//interfaces



interface ProfileInfoProps {
  personInfo?: PersonInfo | null;
}









export default function ProfileInfo({ personInfo }: ProfileInfoProps) {
  const router = useRouter();
  const user = personInfo || getAuthUser();
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/sign-in");
    } catch (error) {
      console.log("Logout failed:", error);
      // Optionally show error to user
    }
  };
  return (
    <div className="space-y-6 ">
      <div className="border rounded p-6">
        <h2 className="text-lg font-bold uppercase mb-4">Profile Overview</h2>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
            {user.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.image}`}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <User className="h-8 w-8" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-600">{user.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          
          <Link
            href="/profile/personal-info"
            className="flex items-center text-sm text-gray-600 hover:text-black"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
          <button
           
            onClick={handleLogout}
            className="text-sm hover:bg-red-50 hover:text-red-600"
          ><div className="flex items-center text-sm cursor-pointer text-gray-600 hover:text-black">

            <LogOut className="h-4 w-4 mr-2"/>
            LOG OUT
          </div>
          </button>
         
        </div>
      </div>
    </div>
  );
}
