import { Phone, LucideShieldAlert,Shield, Hospital, Building2, Heart,Droplets, Siren, AlertCircle, MapPin, Clock } from 'lucide-react';
import Footer from "../component/Footer/Footer";


export default function EmergencyAgencies() {
  const agencies = [
    {
      icon: LucideShieldAlert,
      color: "orange",
      name: "ปภ.เชียงราย",
      description: "กรมป้องกันและบรรเทาสาธารณภัย จังหวัดเชียงราย",
      phone: "1784",
      hotline: true,
      available: "ตลอด 24 ชั่วโมง",
      priority: true
    },
    {
      icon: Hospital,
      color: "green",
      name: "โรงพยาบาลทั่วจังหวัดเชียงราย",
      description: "บริการทางการแพทย์ฉุกเฉินและรักษาพยาบาล",
      phone: "1669",
      hotline: true,
      available: "ตลอด 24 ชั่วโมง",
      priority: true
    },
    {
      icon: Droplets,
      color: "Blue",
      name: "กรมทรัพยากรน้ำ",
      description: "ผู้ดำเนินการเฝ้าระวัง ป้องกันบรรเทา และแก้ไขปัญหาวิกฤตน้ำ",
      phone: "0-5422-2938",
      available: "ตลอด 24 ชั่วโมง",
      priority: true
    },
    {
      icon: Shield,
      color: "red",
      name: "ศูนย์กองอำนวยการ",
      description: "ศูนย์บัญชาการหลักในการประสานงานช่วยเหลือผู้ประสบภัย",
      phone: "095-540-7938",
      available: "ตลอด 24 ชั่วโมง",
      priority: true
    },
    {
      icon: Building2,
      color: "blue",
      name: "สำนักงานประชาสัมพันธ์ จังหวัดเชียงราย",
      description: "ประสานงานข้อมูลข่าวสารและการช่วยเหลือระดับจังหวัด",
      phone: "053-150-163",
      available: "ในเวลาราชการ"
    },
    {
      icon: Heart,
      color: "pink",
      name: "มูลนิธิกระจกเงา เชียงราย",
      description: "มูลนิธิให้ความช่วยเหลือผู้ประสบภัยพิบัติ",
      phone: "091-832-9800",
      available: "ตลอด 24 ชั่วโมง"
    },
    {
      icon: Siren,
      color: "purple",
      name: "ศูนย์รับเรื่องราวร้องเรียนร้องทุกข์เทศบาลนครเชียงราย",
      description: "รับเรื่องราวการร้องเรียนและร้องทุกข์ผู้ประสบภัย",
      phone: "053-711333",
      available: "ตลอด 24 ชั่วโมง"
    },
    {
      icon: Building2,
      color: "teal",
      name: "ฝ่ายสงเคราะห์และฟื้นฟูผู้ประสบภัย อบจ.เชียงราย",
      description: "กองป้องกันและบรรเทาสาธารณภัย องค์การบริหารส่วนจังหวัดเชียงราย",
      phone: "053-175-329, 053-175-333 ต่อ 1402",
      available: "ในวันและเวลาราชการ"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: "from-red-400 to-red-600 border-red-500 text-red-400",
      blue: "from-blue-400 to-blue-600 border-blue-500 text-blue-400",
      orange: "from-orange-400 to-orange-600 border-orange-500 text-orange-400",
      pink: "from-pink-400 to-pink-600 border-pink-500 text-pink-400",
      green: "from-green-400 to-green-600 border-green-500 text-green-400",
      purple: "from-purple-400 to-purple-600 border-purple-500 text-purple-400",
      teal: "from-teal-400 to-teal-600 border-teal-500 text-teal-400"
    };
    return colors[color] || colors.blue;
  };

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
          <div className="text-center mb-16">
            <br /><br />
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 py-2 leading-relaxed text-cyan-200 animate-fade-in-up delay-200 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent tracking-wide">
              หน่วยงานที่ให้ความช่วยเหลือ
            </h2>

            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto animate-fade-in-up delay-400">
              Emergency Assistance Agencies - ติดต่อขอความช่วยเหลือได้ตลอด 24 ชั่วโมง
            </p>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-900/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-red-500/50 mb-12 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400 mr-3 animate-pulse" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                สายด่วนฉุกเฉิน : โทร 1784 ตลอด 24 ชั่วโมง
              </h3>
              <AlertCircle className="w-8 h-8 text-red-400 ml-3 animate-pulse" />
            </div>
          </div>

          {/* Priority Agencies */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              หน่วยงานหลักที่ควรติดต่อก่อน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agencies.filter(a => a.priority).map((agency, index) => {
                const Icon = agency.icon;
                const colorClasses = getColorClasses(agency.color);
                
                return (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-white/20 transform hover:-translate-y-2 hover:shadow-3xl transition-all duration-300"
                  >
                    <div className="flex items-start mb-4">
                      <div className={`bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} p-3 rounded-full mr-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-1">{agency.name}</h4>
                        {agency.hotline && (
                          <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2">
                            สายด่วน
                          </span>
                        )}
                        <p className="text-gray-400 text-sm">{agency.description}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-cyan-400 mr-2" />
                          <span className="text-lg font-semibold text-cyan-300">
                            {agency.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {agency.available}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other Agencies */}
          <div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
              <Building2 className="w-8 h-8 mr-3" />
              หน่วยงานสนับสนุนอื่น ๆ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.filter(a => !a.priority).map((agency, index) => {
                const Icon = agency.icon;
                const colorClasses = getColorClasses(agency.color);
                
                return (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-white/10 hover:border-cyan-400/50 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`${colorClasses.split(' ')[2]} p-2 rounded-lg mr-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">{agency.name}</h4>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{agency.description}</p>
                    
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex items-center mb-2">
                        <Phone className="w-4 h-4 text-cyan-400 mr-2" />
                        <span className="text-cyan-300 font-medium">
                          {agency.phone}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {agency.available}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30">
            <div className="flex items-start">
              <MapPin className="w-8 h-8 text-cyan-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-3">ข้อแนะนำในการติดต่อขอความช่วยเหลือ</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• แจ้งพิกัดที่อยู่หรือสถานที่ใกล้เคียงให้ชัดเจน</li>
                  <li>• ระบุจำนวนผู้ประสบภัยและสภาพความเดือดร้อน</li>
                  <li>• เตรียมเบอร์โทรศัพท์สำรองสำหรับติดต่อกลับ</li>
                  <li>• หากไม่สามารถติดต่อหน่วยงานใดได้ ให้ติดต่อสายด่วน 1784 ทันที</li>
                </ul>
              </div>
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