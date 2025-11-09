import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import InputField from "./InputField";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!recaptchaToken) {
      alert("กรุณายืนยันว่าคุณไม่ใช่บอท");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/insert_data.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.text();

      if (result === "OK") {
        alert(
          `ส่งข้อมูลแล้ว! \nขอบคุณที่ให้ข้อเสนอแนะกับผู้จัดทำ \nผู้จัดทำจะนำข้อเสนอแนะไปปรับปรุงแก้ไขต่อไป...`
        );
        setFormData({ name: "", email: "", message: "" });
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      } else {
        alert("เกิดข้อผิดพลาด: " + result);
      }
    } catch (error) {
      alert("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          📝 แบบฟอร์มข้อเสนอแนะ
        </h2>
        <p className="text-white/70">
          กรุณากรอกข้อมูลด้านล่างเพื่อส่งข้อเสนอแนะของคุณ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-lg">
            👤 ชื่อของคุณ
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="กรอกชื่อของคุณ"
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-lg">
            📧 อีเมล
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-lg">
            💭 ข้อเสนอแนะ
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="แสดงความคิดเห็นของคุณที่นี่..."
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
          />
        </div>

        {/* ReCAPTCHA */}
        <div className="flex justify-center py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdrT38rAAAAAKp9SZW_-TmgMfYSA_Ks4clOCCYs"
              onChange={(token) => setRecaptchaToken(token)}
              theme="dark"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              กำลังส่งข้อมูล...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <h5 style={{padding:10, fontSize:20}}>ส่งข้อเสนอแนะ</h5>
              <ion-icon name="send-outline" style={{ fontSize: '22px' }}></ion-icon>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}