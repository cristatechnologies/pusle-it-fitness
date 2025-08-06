
import { useAppSelector } from "@/lib/redux/hook";
import { settings } from "@/lib/redux/features/website/settings";
import SocialIcons from "./social-icons";


const Footer = () => {
  const websiteData = useAppSelector((state) => state.website.data);
  const footerData = websiteData?.footer;
  const socialIcons = websiteData?.social_links


  const visibleFooterCols = (
    ["footer_first_col", "footer_second_col", "footer_third_col"] as const
  ).filter((colKey) => footerData && footerData[colKey]?.col_links?.length > 0);

  const gridCols = 1 + visibleFooterCols.length + 1; // 2 for static cols, 1 for contact

  return (
    <footer className="font-manrope text-[14px] border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div
          className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-${gridCols}`}
        >
          {/* Static Column: Logo/About */}
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${settings().logo}`}
              alt="Footer Logo"
              className="h-8 sm:h-10 w-auto mb-4 object-contain"
            />

            <p className="text-gray-600">{footerData?.footer.about_us}</p>
            {socialIcons && socialIcons.length > 0 && (
              <div className="mt-4">
                <SocialIcons
                  socialIcons={socialIcons}
                  iconSize={20}
                  className="text-gray-600 hover:text-gray-900"
                />
              </div>
            )}
          </div>

          {/* Dynamically Rendered Footer Columns */}
          {visibleFooterCols.map((colKey) => {
            const column =
              footerData?.[
                colKey as
                  | "footer_first_col"
                  | "footer_second_col"
                  | "footer_third_col"
              ];
            return (
              <div key={colKey}>
                <h3 className="mb-4 text-lg font-bold">
                  {column?.columnTitle}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {column?.col_links.map((link) => (
                    <li key={link.id}>
                      <a href={`/${link.link}`} className="hover:text-black">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Contact Column */}
          {footerData?.footer?.address && (
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact</h3>
              <address className="not-italic text-gray-600">
                {footerData.footer.address
                  .split(",")
                  .reduce<string[][]>((acc, part, i) => {
                    const chunkIndex = Math.floor(i / 3);
                    if (!acc[chunkIndex]) acc[chunkIndex] = [];
                    acc[chunkIndex].push(part.trim());
                    return acc;
                  }, [])
                  .map((group, index) => (
                    <p key={index}>{group.join(", ")}</p>
                  ))}
                <p className="mt-4">{footerData?.footer.phone}</p>
                <p>{footerData?.footer.email}</p>
              </address>
            </div>
          )}
        </div>

        {/* Footer Bottom Text */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>{footerData?.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;