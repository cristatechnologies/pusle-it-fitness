import axios from "axios";

// import { getAuthToken } from "./Auth-Token";

// const authToken = getAuthToken;

const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const sendContact = async (form: {
    name: string;
    email: string;
    message: string;
  }) => {
    const payload = {
      name: form.name,
      email: form.email,
      subject: "Contact Form Submission", // or use a subject input if required
      message: form.message,
    };
  
    try {
      const res = await axios.post(`${baseurl}api/send-contact-message`, payload, {
        headers: {
          Accept: "application/json",
        },
      });
      return res.data;
    } catch (err) {
      console.log("Error sending contact:", err);
      throw err;
    }
  };
  

  export const fetchContactUs = async () => {
    try {
      const res = await axios.get(`${baseurl}api/contact-us`);
      return res.data; // ensure your API returns expected structure
    } catch (err) {
      console.log("Error fetching contact info:", err);
      throw err;
    }
  };
  