
import { User, MapPin, Heart, Lock, Star, FileText } from "lucide-react";
import Link from "next/link";

const ProfileNavbar = () => {


    
  interface MenuItem {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    link: string;
  }
  const menuItems: MenuItem[] = [
    { title: "Personal Info", icon: User, link: "/profile/personal-info" },
    { title: "Orders", icon: FileText, link: "/profile/orders" },
    { title: "Wishlist", icon: Heart, link: "/profile/wishlist" },
    { title: "Address", icon: MapPin, link: "/profile/my-address" },
    { title: "Reviews", icon: Star, link: "/profile/reviews" },
    { title: "Change Password", icon: Lock, link: "/profile/change-password" },
  ];
    return (
      <>
        <div className="border rounded p-6">
          <h2 className="text-lg font-bold uppercase mb-4">Account Menu</h2>
          <nav>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
};


export default ProfileNavbar;