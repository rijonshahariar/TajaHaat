// import { Footer } from "@/components/Footer";
// import { useTranslation } from "@/lib/i18n";

// export default function Contact() {
//   const { t } = useTranslation();

//   return (
//     <div className="min-h-screen bg-white">
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-foreground mb-2">{t('contact.title')}</h1>
//           <p className="text-muted-foreground">{t('contact.subtitle')}</p>
//         </div>
//       </section>

//       <section className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-2xl mx-auto text-center">
//           <p className="text-muted-foreground mb-4">
//             {t('contact.content')}
//           </p>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
// ------
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-border rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get in Touch
          </h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          ) : (
            <div className="text-center text-green-600 font-medium">
              ✅ Thank you for contacting us! We’ll get back to you soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
