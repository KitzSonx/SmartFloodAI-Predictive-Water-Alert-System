import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NavBar from "./NavBar/NavBar";
import { useLocation } from "react-router-dom";

export default function SlideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 16 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 left-0 h-full z-40 flex items-center"
        style={{ width: "fit-content" }}
      >
        <NavBar />
      </motion.div>
    </>
  );
}
