import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "../component/Footer/Footer";



const Notification = ({ message, type, onclose }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 w-auto max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center z-50 transition-all duration-300";
  const typeClasses = {
    success: "bg-green-500/80 backdrop-blur-sm border border-green-400",
    error: "bg-red-500/80 backdrop-blur-sm border border-red-400",
  };
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="mr-3">{type === 'success' ? '✅' : '❌'}</span>
      <p className="flex-grow">{message}</p>
      <button onClick={onclose} className="ml-4 text-xl font-bold">&times;</button>
    </div>
  );
};

const FeedbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);



export default function Feedback() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });
  const recaptchaRef = useRef();

  const pageStyle = {
    backgroundImage: `radial-gradient(circle 382px at 50% 50.2%, rgba(73, 76, 212, 1) 0.1%, rgba(3, 1, 50, 1) 100.2%)`,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ message: null, type: null });

    if (!recaptchaToken) {
      setNotification({ message: "กรุณายืนยันว่าคุณไม่ใช่บอท", type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/insert_data.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.text();

      if (response.ok && result === "OK") {
        setNotification({ message: "ส่งข้อเสนอแนะสำเร็จ ขอบคุณสำหรับความคิดเห็นครับ!", type: "success" });
        setFormData({ name: "", email: "", message: "" });
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      } else {
        setNotification({ message: `เกิดข้อผิดพลาด: ${result}`, type: "error" });
      }
    } catch (error) {
      setNotification({ message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", type: "error" });
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification({ message: null, type: null }), 5000);
    }
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onclose={() => setNotification({ message: null, type: null })}
      />
      <div style={pageStyle} className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16">

            {/* Left Column: Information */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-black/20 backdrop-blur-lg p-4 rounded-2xl mb-6 border border-white/10">
                 <FeedbackIcon />
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white">
                ข้อเสนอแนะ
              </h1>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                เราให้ความสำคัญกับความคิดเห็นของทุก ๆ คน
                <span className="text-purple-300 font-medium"> โปรดแบ่งปันข้อเสนอแนะ </span>
                จะช่วยให้เราสามารถพัฒนาเว็บไซต์ให้ดียิ่งขึ้นต่อไปในอนาคต
              </p>
              <p className="mt-6 text-sm text-slate-400">
                🔒 ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เพื่อการพัฒนาเท่านั้น
              </p>
            </div>

            {/* Right Column: Form */}
            <div className="w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields */}
                {[
                  { id: "name", label: "ชื่อของคุณ", type: "text", placeholder: "กรอกชื่อของคุณ" },
                  { id: "email", label: "อีเมล", type: "email", placeholder: "example@email.com" },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                    <input
                      type={field.type} id={field.id} name={field.id}
                      value={formData[field.id]} onChange={handleChange}
                      placeholder={field.placeholder} required
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">ข้อเสนอแนะ</label>
                  <textarea
                    id="message" name="message" value={formData.message} onChange={handleChange}
                    rows="5" placeholder="แสดงความคิดเห็นของคุณที่นี่..." required
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* ReCAPTCHA */}
                <div className="flex justify-center">
                   <ReCAPTCHA
                      ref={recaptchaRef} sitekey="6LdrT38rAAAAAKp9SZW_-TmgMfYSA_Ks4clOCCYs"
                      onChange={(token) => setRecaptchaToken(token)} theme="dark"
                    />
                </div>

                {/* Submit Button */}
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      กำลังส่งข้อมูล...
                    </div>
                  ) : "ส่งข้อเสนอแนะ"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
