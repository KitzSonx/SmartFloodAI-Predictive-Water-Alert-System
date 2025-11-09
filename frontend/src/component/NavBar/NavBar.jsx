import React from 'react'
import { Link } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/logo.png";

const NavBar = () => {
  return (
    <section className='nav-section'>
      <nav>
        <div className="nav-header">
          <img src={logo} alt="" height={120} />
          <h5 style={{ textAlign: 'center', color: "#fff", marginTop: '10px' }}>AI-Water Tesaban 6</h5>
        </div>
        
        <ul className="nav-menu">
          <li>
            <ion-icon name="home-outline"></ion-icon>
            <Link to="/">
              <span>หน้าแรก</span>
            </Link>
          </li>
          {/* <li>
            <ion-icon name="document-text-outline"></ion-icon>
            <Link to="Water-Table-Page">
              <span>ตารางข้อมูลน้ำย้อนหลัง</span>
            </Link>
          </li> */}
          {/* <li>
            <ion-icon name="pin-outline"></ion-icon>
            <Link to="WaterStation">
              <span>สถานีวัดข้อมูลน้ำปัจจุบันในภาคเหนือ</span>
            </Link>
          </li> */}
          <li>
            <ion-icon name="alert-circle-outline"></ion-icon>
            <Link to="contact-the-evacuation-center">
              <span>หน่วยงานที่ให้ความช่วยเหลือ</span>
            </Link>
          </li>
          <li>
            <ion-icon name="newspaper-outline"></ion-icon>
            <Link to="about-ai-water">
              <span>เกี่ยวกับโครงงาน</span>
            </Link>
          </li>
          <li>
            <ion-icon name="call-outline"></ion-icon>
            <Link to="contact-us">
              <span>ติดต่อ/แจ้งปัญหา</span>
            </Link>
          </li>
          <li>
            <ion-icon name="log-in-outline"></ion-icon>
            <Link to="login">
              <span>เข้าสู่ระบบ</span>
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  )
}

export default NavBar