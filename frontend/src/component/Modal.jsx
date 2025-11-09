import React from "react";

export default function Modal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-xl w-full max-w-2xl shadow-xl text-center">
        <h2 className="text-lg font-semibold mb-3">ข้อตกลงในการใช้ซอฟต์แวร์</h2>

        <div className="text-sm text-gray-700 mb-6 leading-relaxed overflow-y-auto max-h-60 pr-2">
          <p>
            ซอฟต์แวร์นี้เป็นผลงานที่พัฒนาขึ้นโดย นายกิตตินันท์ สงคำ, นายณฐนนท์
            เขื่อนทาและนางสาวอภิชญา ปินปันคง จาก โรงเรียนเทศบาล 6 นครเชียงราย
            ภายใต้การดูแลของ นายพิพัฒน์พงศ์ ธิอินโต ภายใต้โครงการ
            นวัตกรรมการคาดคะเนการเตือนภัยน้ำท่วมล่วงหน้า ด้วยการเรียนรู้เชิงลึก
            ซึ่งสนับสนุนโดย สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ
            โดยมีวัตถุประสงค์เพื่อส่งเสริมให้นักเรียนและนักศึกษาได้เรียนรู้และฝึกทักษะในการพัฒนาซอฟต์แวร์
            ลิขสิทธิของซอฟต์แวร์นี่จึงเป็นของผู้พัฒนา
            ซึ่งผู้พัฒนาได้อนุญาตให้สำนักงาน
            พัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ เผยแพร่ซอฟต์แวร์นีตาม "ต้นฉบับ"
            โดยไม่มิการแก้ไขดัดแปลงใด ๆ ทั้งสิ้น
            ให้แก่บุคคลทั่วไปได้ใช้เพื่อประโยชน์ส่วนบุคคลหรือประโยชน์ทางการศึกษาที่ไม่มีวัตถุประสงค์ในเชิงพาณิชย์
            โดยไม่คิดค่าตอบแทนการใช้ซอฟต์แวร์ ดังนั้น
            สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ
            จึงไม่มีหน้าที่ในการดูแล บำรุงรักษา จัดการอบรมการใช้งาน
            หรือพัฒนาประสิทธิภาพซอฟต์แวร์
            รวมทั้งไม่รับรองความถูกต้องหรือประสิทธิภาพการทำงานของซอฟต์แวร์
            ตลอดจนไม่รับประกันความเสียหายต่าง ๆ
            อันเกิดจากการใช้ซอฟต์แวร์นี้ทั้งสิ้น 
            <br /><br /><h5>License Agreement</h5> This software
            is a work developed by Mr.Kittinan Songkham, Mr.Nutanon Khuanta and
            Mrs.Apichaya Pinpankong from Chiang Rai Municipality School 6 under
            the provision of Mr.Pipatpong Tiinto under SmartFlood : An
            Innovative Deep Learning-Based Approach for Flood Prediction, which
            has been supported by the National Science and Technology
            Development Agency (NSTDA), in order to encourage pupils and
            students to learn and practice their skills in developing software.
            Therefore, the intellectual property of this software shall belong
            to the developer and the developer gives NSTDA a permission to
            distribute this software as an "as is" and non-modified software for
            a temporary and non-exclusive use without remuneration to anyone for
            his or her own purpose or academic purpose, which are not commercial
            purposes. In this connection, NSTDA shall not be responsible to the
            user for taking care, maintaining, training, or developing the
            efficiency of this software. <br/>Moreover, NSTDA shall not be liable for
            any error, software efficiency and damages in connection with or
            arising out of the use of the software."
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          รับทราบ
        </button>
      </div>
    </div>
  );
}
