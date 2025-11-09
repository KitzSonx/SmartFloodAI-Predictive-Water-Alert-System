import { Camera, Database, TrendingUp, Bell, AlertTriangle, BarChart3, Brain, MapPin, Rocket, ChevronsRight } from 'lucide-react';
import Footer from "../component/Footer/Footer";

export default function Reference() {
  return (
    <div 
      className="min-h-screen text-white flex flex-col p-4 sm:p-8"
      style={{
        backgroundImage: `
          radial-gradient(
            circle 382px at 50% 50.2%,
            rgba(73, 76, 212, 1) 0.1%,
            rgba(3, 1, 50, 1) 100.2%
          )
        `
      }}
    >
      <div className="flex-grow flex flex-col justify-center items-center">
        <main className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">
              <span className="bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                SmartFlood
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-200 animate-fade-in-up delay-200 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
              นวัตกรรมการคาดคะเนและเตือนภัยน้ำท่วมด้วยการเรียนรู้เชิงลึก
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto animate-fade-in-up delay-400">
              An Innovative Deep Learning-Based Approach for Flood Prediction & Warning
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10 mb-12 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500 mr-4" />
              <h2 className="text-3xl font-bold text-white">
                ที่มาและความสำคัญของโครงการ
              </h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              จากเหตุการณ์อุทกภัยครั้งใหญ่ของจังหวัดเชียงราย ในช่วงเดือนกันยายน ปี 2567 ซึ่งถือเป็นภัยพิบัติที่รุนแรงที่สุดในรอบหลายสิบปี โดยมีสาเหตุหลักจากการเกิดฝนตกหนักต่อเนื่องและอิทธิพลของพายุไต้ฝุ่นที่ส่งผลกระทบโดยตรง
            </p>
            
            <div className="bg-red-900/40 border-l-4 border-red-500 pl-6 py-4 mb-6 rounded-r-lg">
              <p className="text-gray-200">
                <strong>พื้นที่ที่ได้รับผลกระทบมากที่สุด:</strong> ชุมชนป่าแดง, ชุมชนแควหวาย, และชุมชนน้ำลัด ซึ่งเป็นพื้นที่ติดบริเวณแม่น้ำสายสำคัญ
              </p>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed">
              ด้วยเหตุนี้ ผู้พัฒนาจึงเล็งเห็นถึงความสำคัญของการสร้างสรรค์นวัตกรรมสำหรับการคาดคะเนและเตือนภัยน้ำท่วมล่วงหน้าด้วยเทคโนโลยี Deep Learning เพื่อช่วยให้ประชาชนและหน่วยงานที่เกี่ยวข้องสามารถรับมือกับสถานการณ์ได้อย่างทันท่วงที
            </p>
          </div>

          {/* 4. วัตถุประสงค์ของโครงงาน */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10 mb-12 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-8">
              <Brain className="w-10 h-10 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold text-white">วัตถุประสงค์ของโครงงาน</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">1. พัฒนาระบบคาดคะเน</h3>
                <p className="text-gray-300">
                  เพื่อพัฒนาระบบคาดคะเนการเกิดอุทกภัยที่มีความแม่นยำสูง โดยใช้เทคโนโลยี Deep Learning วิเคราะห์ข้อมูลสภาพอากาศ ปริมาณน้ำฝน และระดับน้ำ
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">2. สนับสนุนการบริหารจัดการ</h3>
                <p className="text-gray-300">
                  เพื่อสนับสนุนการวางแผนและบริหารจัดการภัยพิบัติอย่างมีประสิทธิภาพ โดยจัดเตรียมข้อมูลเชิงลึกแก่หน่วยงานภาครัฐและเอกชน
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">3. พัฒนาการเตือนภัย</h3>
                <p className="text-gray-300">
                  เพื่อเสนอแนวทางในการพัฒนาระบบแจ้งเตือนภัยล่วงหน้าสู่ชุมชน ที่สามารถแจ้งเตือนได้อย่างรวดเร็วและมีประสิทธิภาพสูงสุด
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">4. ศึกษาความเป็นไปได้</h3>
                <p className="text-gray-300">
                  เพื่อศึกษาและพิสูจน์ความเป็นไปได้ในการประยุกต์ใช้ Deep Learning สำหรับการพัฒนาโมเดลคาดคะเนอุทกภัยที่มีความแม่นยำและเชื่อถือได้
                </p>
              </div>
            </div>
          </div>
          
          {/* 5. เทคโนโลยีที่ใช้ในการพัฒนา */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10 mb-12 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-8">
              <BarChart3 className="w-10 h-10 text-purple-400 mr-4" />
              <h2 className="text-3xl font-bold text-white">เทคโนโลยีและเครื่องมือที่ใช้</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tech Cards */}
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Frontend</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• React.js & Next.js</li>
                  <li>• TailwindCSS</li>
                  <li>• Lucide Icons</li>
                  <li>• Visual Studio Code</li>
                </ul>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Backend & Database</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• MySQL Database</li>
                  <li>• Python (Flask/FastAPI)</li>
                  <li>• Google Cloud Platform (GCP)</li>
                  <li>• Cloud Function & Scheduler</li>
                </ul>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">AI/ML</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• LSTM Neural Network</li>
                  <li>• TensorFlow, Keras<br/> และ Scikit-learn</li>
                  <li>• Time Series Analysis</li>
                  <li>• และโมเดลอื่น ๆ</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 6. คุณสมบัติหลักของระบบ */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Rocket className="w-10 h-10 text-cyan-300 mr-4" />
              คุณสมบัติหลักของระบบ SmartFlood
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Feature Cards */}
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-500/20 shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Database className="w-8 h-8 text-cyan-400 mr-4" />
                  <h3 className="text-xl font-semibold text-white">การจัดเก็บข้อมูล</h3>
                </div>
                <p className="text-gray-400">
                  ดึงและจัดเก็บข้อมูลระดับน้ำรายชั่วโมงจากกรมทรัพยากรน้ำ พร้อมทำความสะอาดและเตรียมข้อมูลสำหรับการวิเคราะห์
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-500/20 shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Brain className="w-8 h-8 text-cyan-400 mr-4" />
                  <h3 className="text-xl font-semibold text-white">โมเดล LSTM อัจฉริยะ</h3>
                </div>
                <p className="text-gray-400">
                  ใช้โมเดล Long Short-Term Memory (LSTM) ทำนายระดับน้ำล่วงหน้า 3 ชั่วโมง และ 1 วัน จากข้อมูลย้อนหลัง 5 ปี
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-500/20 shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-8 h-8 text-cyan-400 mr-4" />
                  <h3 className="text-xl font-semibold text-white">แสดงผลการทำนาย</h3>
                </div>
                <p className="text-gray-400">
                  แสดงผลการพยากรณ์ในรูปแบบกราฟและตารางที่เข้าใจง่าย พร้อมค่าสถิติสำคัญ (Min, Max, Average) ของระดับน้ำ
                </p>
              </div>
              <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-500/20 shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Bell className="w-8 h-8 text-cyan-400 mr-4" />
                  <h3 className="text-xl font-semibold text-white">ระบบแจ้งเตือนอัตโนมัติ</h3>
                </div>
                <p className="text-gray-400">
                  แจ้งเตือนอัตโนมัติผ่าน Cloud Scheduler เมื่อระดับน้ำเข้าใกล้จุดวิกฤต พร้อมอัปเดตข้อมูลแบบเรียลไทม์
                </p>
              </div>
            </div>

            <div className="border-l-4 border-cyan-500 pl-6 py-4 bg-gradient-to-r from-cyan-900/30 to-transparent rounded-r-lg">
              <p className="text-lg text-gray-200 leading-relaxed italic">
                💡 <strong>SmartFlood</strong> คือนวัตกรรมที่ผสานเทคโนโลยี Deep Learning เข้ากับการจัดการภัยพิบัติ เพื่อสร้างระบบเตือนภัยน้ำท่วมที่มีประสิทธิภาพสูงสุด ช่วยลดความเสียหายและปกป้องชีวิตทรัพย์สินของประชาชนในพื้นที่เสี่ยง
              </p>
            </div>
          </div>
        </main>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
      <style jsx>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }

      .animate-fade-in-down {
        animation: fadeInDown 0.8s ease-out forwards;
      }

      .delay-200 { animation-delay: 0.2s; }
      .delay-400 { animation-delay: 0.4s; }
      .delay-600 { animation-delay: 0.6s; }
      .delay-800 { animation-delay: 0.8s; }
      .delay-1000 { animation-delay: 1s; }
    `}</style>
    </div>
  );
}