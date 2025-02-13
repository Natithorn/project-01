import React, { useState } from 'react';
import { FileText, MapPin, Clock, Building2, ChevronRight, Search } from 'lucide-react';
import type { MedicalRecord } from '../types';

interface MedicalCertificateProps {
  latestRecord?: MedicalRecord;
}

interface MedicalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic';
  distance: number;
  address: string;
  openHours: string;
  rating: number;
}

const MOCK_FACILITIES: MedicalFacility[] = [
  {
    id: '1',
    name: 'โรงพยาบาลกรุงเทพ',
    type: 'hospital',
    distance: 1.2,
    address: 'ถนนเพชรบุรีตัดใหม่ แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ',
    openHours: '24 ชั่วโมง',
    rating: 4.5
  },
  {
    id: '2',
    name: 'คลินิกเวชกรรม สุขภาพดี',
    type: 'clinic',
    distance: 0.5,
    address: 'ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ',
    openHours: '08:00 - 20:00',
    rating: 4.2
  },
  {
    id: '3',
    name: 'โรงพยาบาลเปาโล',
    type: 'hospital',
    distance: 2.1,
    address: 'ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ',
    openHours: '24 ชั่วโมง',
    rating: 4.4
  }
];

const CERTIFICATE_PURPOSES = [
  { id: 'work', label: 'ขอใบรับรองแพทย์เพื่อลางาน' },
  { id: 'school', label: 'ขอใบรับรองแพทย์เพื่อยื่นสถานศึกษา' },
  { id: 'insurance', label: 'ขอใบรับรองแพทย์เพื่อเคลมประกัน' },
  { id: 'other', label: 'อื่นๆ' }
];

export const MedicalCertificate: React.FC<MedicalCertificateProps> = ({ latestRecord }) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  const filteredFacilities = MOCK_FACILITIES.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationAccess = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would typically use the coordinates to fetch real nearby facilities
          // For now, we'll just hide the prompt
          setShowLocationPrompt(false);
        },
        (error) => {
          alert('ไม่สามารถเข้าถึงตำแหน่งที่ตั้งได้ กรุณาอนุญาตการเข้าถึงตำแหน่งที่ตั้ง');
        }
      );
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* สรุปอาการและการวินิจฉัย */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          สรุปการวินิจฉัยเบื้องต้น
        </h2>
        
        {latestRecord ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">การวินิจฉัย:</h3>
              <p className="text-lg text-gray-900">{latestRecord.diagnosis}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">อาการที่พบ:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {latestRecord.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">บันทึกเพิ่มเติม:</h3>
              <p className="text-gray-600">{latestRecord.notes}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">ไม่พบประวัติการวินิจฉัยล่าสุด</p>
        )}
      </div>

      {/* เลือกจุดประสงค์ */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">เลือกจุดประสงค์การขอใบรับรองแพทย์</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CERTIFICATE_PURPOSES.map((purpose) => (
            <button
              key={purpose.id}
              onClick={() => setSelectedPurpose(purpose.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPurpose === purpose.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{purpose.label}</span>
                <ChevronRight className={`w-5 h-5 ${
                  selectedPurpose === purpose.id ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ค้นหาสถานพยาบาล */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          ค้นหาสถานพยาบาลใกล้คุณ
        </h2>

        {showLocationPrompt ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              เพื่อค้นหาสถานพยาบาลใกล้คุณ เราจำเป็นต้องเข้าถึงตำแหน่งที่ตั้งของคุณ
            </p>
            <button
              onClick={handleLocationAccess}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              อนุญาตการเข้าถึงตำแหน่งที่ตั้ง
            </button>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="ค้นหาโรงพยาบาลหรือคลินิก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-4">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{facility.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Building2 className="w-4 h-4" />
                        <span>{facility.type === 'hospital' ? 'โรงพยาบาล' : 'คลินิก'}</span>
                        <span className="text-gray-300">|</span>
                        <MapPin className="w-4 h-4" />
                        <span>{facility.distance} กม.</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      facility.type === 'hospital'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {facility.type === 'hospital' ? '24 ชม.' : facility.openHours}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{facility.address}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{facility.openHours}</span>
                    </div>
                    <button
                      onClick={() => {
                        // Here you would typically open in Google Maps
                        window.open(`https://www.google.com/maps/search/${encodeURIComponent(facility.name)}`, '_blank');
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      ดูเส้นทาง
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};