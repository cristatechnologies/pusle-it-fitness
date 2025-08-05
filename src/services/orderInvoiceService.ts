import axios from "axios";
import { getAuthToken } from "./Auth-Token";
import toast from "react-hot-toast";

export const downloadOrderInvoice = async (id: number) => {
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication required");
      return false;
    }

    const loadingToast = toast.loading("Preparing invoice...");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/order-pdf-web/${id}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Create a blob from the response
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link element and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.dismiss(loadingToast);
    toast.success("Invoice downloaded successfully");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to download invoice");
    console.log("Invoice download error:", error);
    return false;
  }
};
