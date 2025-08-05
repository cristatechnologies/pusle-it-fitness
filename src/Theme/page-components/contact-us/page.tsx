"use client";

import { useEffect, useState } from "react";
import { sendContact, fetchContactUs } from "@/services/extras";  
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { ContactResponse } from "@/Theme/types/contact";
import { Mail, MapPin, Phone } from "lucide-react";
// import toast from "react-hot-toast";
// import { AxiosError } from "axios";
const  ContactUsComponent = () => {
  const [data, setData] = useState<ContactResponse>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const getData = async () => {
      const response = await fetchContactUs();
      if (response) {
        setData(response);
      }
    };
    getData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
      await sendContact(form);
      // Show success toast here
    // } catch (error:AxiosError | unknown) {
    //     console.log(error)
    //     toast.error(error.response?.data?.message)
    //   // Show error toast here
    // }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contacts", href: "/contact-us" },
  ];

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <h1 className="text-center font-semibold text-[30px] uppercase !font-manrope py-6 border-b-2">
        Contacts
      </h1>

      <div className="flex items-center justify-between container mt-[60px] gap-6 px-4">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[50%]">
          <h2 className="font-semibold uppercase text-[19px]">
            {data?.contact.title}
          </h2>

          <div className="flex flex-col">
            <label className="text-[12px] uppercase">Your name</label>
            <input
              size={40}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border text-[13px] py-[10px] px-[15px] leading-[18px] font-manrope font-[500] border-gray-300"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] uppercase">Your email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border text-[13px] py-[10px] px-[15px] leading-[18px]  font-manrope font-[500] border-gray-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] uppercase">Your message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="border text-[13px] py-[10px] px-[15px] leading-[18px] font-manrope font-[500] border-gray-300"
              placeholder="Enter your message"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[var(--primary-color)] text-[var(--primary-text-color)] font-manrope border-1 cursor-pointer hover:bg-[var(--secondary-color)] hover:text-white border-black py-2 text-sm uppercase"
          >
            Submit
          </button>
        </form>

        {/* Address Section */}
        <div className="flex flex-col w-[50%] font-manrope gap-8">
          <div>
            <h2 className="font-semibold text-[19px] uppercase pb-2">
              Address
            </h2>

            <p className="text-[14px] font-[300] flex items-center gap-3">
              <MapPin size={16} color="var(--hover-color)" />
              {data?.contact.address || "Loading address..."}
            </p>
          </div>
          <div className="">
            <h2 className="font-semibold text-[19px] uppercase pb-2">Email </h2>
            <p className="text-[14px] font-[300] flex items-center gap-3">
              <Mail size={16} color="var(--hover-color)" />{" "}
              {data?.contact.email}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-[19px] uppercase pb-2">Phones</h2>
            <p className="text-[14px] font-[300] flex items-center gap-3">
              <Phone size={16} color="var(--hover-color)" />{" "}
              {data?.contact.phone}
            </p>
          </div>
        </div>
      </div>
      {data?.contact.map && (
        <div className="px-[40px] my-[60px] w-full border-0">
          <iframe
            src={data.contact.map}
            className="w-full h-[400px] border-2 border-black"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ContactUsComponent;
