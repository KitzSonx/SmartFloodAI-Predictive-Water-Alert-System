import Footer from "../component/Footer/Footer";
import WaterTable from "../component/WaterTable/WaterTable";
import WaterTableNawang from "../component/WaterTableNawang/WaterTableNawang";

export default function TablePage() {
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
          {/* Header */}
          <div className="text-center mb-8">
            <br /><br />
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 py-2 leading-relaxed text-cyan-200 animate-fade-in-up delay-200 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent tracking-wide">
              ตารางข้อมูลน้ำย้อนหลัง 5 ปี ราย 15 นาที
            </h2>
          </div>

          {/* Water Tables */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <div style={{ 
              flex: '1 1 500px',
              maxWidth: '650px',
              minWidth: '500px'
            }}>
              <WaterTable/>
            </div>
            <div style={{ 
              flex: '1 1 500px',
              maxWidth: '650px',
              minWidth: '500px'
            }}>
              <WaterTableNawang/>
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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}