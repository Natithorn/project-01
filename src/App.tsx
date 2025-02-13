import React, { useState, useRef, useCallback } from 'react';
import { Send, Image as ImageIcon, Search, Stethoscope, Heart, FileText, Settings, ChevronRight, Upload, AlertCircle, Pill, Activity, History, Mail, ArrowLeft } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { VoiceButton } from './components/VoiceButton';
import { MedicalHistory } from './components/MedicalHistory';
import { SymptomDetails } from './components/SymptomDetails';
import { MedicalCertificate } from './components/MedicalCertificate';
import { SendToDoctor } from './components/SendToDoctor';
import type { ChatState, Message, MedicalRecord, PatientProfile, SymptomCategory } from './types';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isRecording: false,
    isProcessing: false,
  });
  
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    id: '1',
    email: 'patient@example.com',
    name: 'คนไข้ ใจดี',
    dateOfBirth: new Date('1990-01-01'),
    medicalHistory: [
      {
        id: '1',
        date: new Date('2024-03-15'),
        symptoms: ['ไข้', 'ไอ', 'เจ็บคอ'],
        diagnosis: 'ไข้หวัดใหญ่',
        notes: 'อาการดีขึ้นหลังทานยา 3 วัน',
        severity: 'moderate',
        status: 'resolved'
      },
      {
        id: '2',
        date: new Date('2024-03-20'),
        symptoms: ['ปวดท้อง', 'คลื่นไส้'],
        diagnosis: 'กระเพาะอาหารอักเสบ',
        notes: 'งดอาหารรสจัด พักผ่อนเพียงพอ',
        severity: 'mild',
        status: 'active'
      }
    ]
  });

  const [selectedSymptom, setSelectedSymptom] = useState<SymptomCategory | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showMedicalCertificate, setShowMedicalCertificate] = useState(false);
  const [showSendToDoctor, setShowSendToDoctor] = useState(false);
  const [input, setInput] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const symptomCategories: SymptomCategory[] = [
    {
      id: 'fever',
      title: 'ไข้และไข้หวัด',
      description: 'อาการไข้ คือ อุณหภูมิร่างกายสูงกว่า 37.5°C อาจมีอาการร่วม เช่น ปวดเมื่อยตามตัว อ่อนเพลีย น้ำมูก ไอ',
      symptoms: ['ไข้สูง', 'ปวดเมื่อยตามตัว', 'น้ำมูก', 'ไอ', 'เจ็บคอ'],
      initialTreatment: [
        'พักผ่อนให้เพียงพอ',
        'ดื่มน้ำอุ่นมากๆ',
        'เช็ดตัวลดไข้',
        'ทานยาพาราเซตามอลหากมีไข้สูง',
        'สังเกตอาการ หากไม่ดีขึ้นใน 2-3 วัน ควรพบแพทย์'
      ]
    },
    {
      id: 'respiratory',
      title: 'ระบบทางเดินหายใจ',
      description: 'ปัญหาเกี่ยวกับระบบหายใจ เช่น หอบ หืด หายใจลำบาก แน่นหน้าอก',
      symptoms: ['หอบเหนื่อย', 'แน่นหน้าอก', 'หายใจมีเสียงวี้ด', 'ไอเรื้อรัง'],
      initialTreatment: [
        'หลีกเลี่ยงสิ่งกระตุ้น เช่น ฝุ่น ควัน',
        'นั่งตัวตรง หายใจเข้าออกช้าๆ',
        'ใช้ยาพ่นหากมี',
        'อยู่ในที่อากาศถ่ายเท',
        'รีบพบแพทย์หากอาการรุนแรง'
      ]
    },
    {
      id: 'digestive',
      title: 'ระบบทางเดินอาหาร',
      description: 'ปัญหาเกี่ยวกับระบบย่อยอาหาร เช่น ท้องเสีย ท้องผูก คลื่นไส้ อาเจียน',
      symptoms: ['ท้องเสีย', 'ท้องผูก', 'คลื่นไส้', 'อาเจียน', 'ปวดท้อง'],
      initialTreatment: [
        'งดอาหารรสจัด',
        'ดื่มน้ำเกลือแร่',
        'รับประทานอาหารอ่อนๆ',
        'พักการย่อยอาหาร 4-6 ชั่วโมง',
        'ทานยาธาตุน้ำดำหรือผงถ่าน'
      ]
    },
    {
      id: 'pain',
      title: 'อาการปวดต่างๆ',
      description: 'อาการปวดตามส่วนต่างๆ ของร่างกาย เช่น ปวดศีรษะ ปวดกล้ามเนื้อ ปวดข้อ',
      symptoms: ['ปวดศีรษะ', 'ปวดกล้ามเนื้อ', 'ปวดข้อ', 'ปวดหลัง'],
      initialTreatment: [
        'พักการใช้งานส่วนที่ปวด',
        'ประคบเย็นหรือร้อนตามอาการ',
        'ทานยาแก้ปวดหากจำเป็น',
        'ยืดกล้ามเนื้อเบาๆ',
        'นวดบรรเทาอาการ'
      ]
    }
  ];

  const addMessage = (text: string, isUser: boolean, image?: string, file?: Message['file']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      image,
      file,
    };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input, true);
    setInput('');

    setTimeout(() => {
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        date: new Date(),
        symptoms: ['ไข้', 'ไอ'],
        diagnosis: 'สงสัยไข้หวัด',
        notes: input,
        severity: 'mild',
        status: 'active'
      };

      setPatientProfile(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newRecord]
      }));

      addMessage("บันทึกอาการของคุณแล้ว คุณควรพักผ่อนให้เพียงพอและดื่มน้ำมากๆ หากอาการไม่ดีขึ้นภายใน 2-3 วัน แนะนำให้พบแพทย์", false);
    }, 1000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('กรุณาอัพโหลดรูปภาพขนาดไม่เกิน 5MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    addMessage(`อัพโหลดรูปภาพ: ${file.name}`, true, imageUrl);

    setTimeout(() => {
      addMessage("ได้รับรูปภาพแล้ว จะทำการวิเคราะห์อาการจากภาพที่ส่งมา", false);
    }, 1000);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSendEmail = (record: MedicalRecord) => {
    alert(`ส่งข้อมูลการรักษาไปยัง ${patientProfile.email} เรียบร้อยแล้ว`);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        setState(prev => ({ ...prev, isProcessing: true }));
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];

        setTimeout(() => {
          addMessage("บันทึกเสียงอาการของคุณแล้ว", true);
          setState(prev => ({ ...prev, isProcessing: false }));
        }, 1000);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการอนุญาตการใช้งาน');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, [state.isRecording]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-bold text-gray-800">HealthScreen AI</h1>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาอาการ..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-600 mb-2">เมนูด่วน</h2>
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setShowHistory(false);
                    setShowMedicalCertificate(false);
                    setShowSendToDoctor(false);
                    setSelectedSymptom(null);
                  }}
                >
                  <Stethoscope className="w-5 h-5 mr-3 text-purple-500" />
                  <span>ตรวจอาการ</span>
                </button>
                <button 
                  className="w-full flex items-center text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setShowHistory(true);
                    setShowMedicalCertificate(false);
                    setShowSendToDoctor(false);
                    setSelectedSymptom(null);
                  }}
                >
                  <History className="w-5 h-5 mr-3 text-blue-500" />
                  <span>ประวัติการรักษา</span>
                </button>
                <button 
                  className="w-full flex items-center text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setShowHistory(false);
                    setShowMedicalCertificate(false);
                    setShowSendToDoctor(true);
                    setSelectedSymptom(null);
                  }}
                >
                  <Mail className="w-5 h-5 mr-3 text-green-500" />
                  <span>ส่งข้อมูลให้แพทย์</span>
                </button>
                <button 
                  className="w-full flex items-center text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setShowHistory(false);
                    setShowMedicalCertificate(true);
                    setShowSendToDoctor(false);
                    setSelectedSymptom(null);
                  }}
                >
                  <FileText className="w-5 h-5 mr-3 text-purple-500" />
                  <span>ใบรับรองแพทย์</span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-600 mb-2">อาการทั่วไป</h2>
              <div className="space-y-1">
                {symptomCategories.map((category) => (
                  <button
                    key={category.id}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setSelectedSymptom(category)}
                  >
                    <span>{category.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center text-left px-3 py-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3 text-gray-500" />
            <span>ตั้งค่า</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(selectedSymptom || showHistory || showMedicalCertificate || showSendToDoctor) && (
                <button
                  onClick={() => {
                    setSelectedSymptom(null);
                    setShowHistory(false);
                    setShowMedicalCertificate(false);
                    setShowSendToDoctor(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedSymptom ? selectedSymptom.title : 
                 showHistory ? 'ประวัติการรักษา' :
                 showMedicalCertificate ? 'ขอใบรับรองแพทย์' :
                 showSendToDoctor ? 'ส่งข้อมูลให้แพทย์' :
                 'ระบบตรวจคัดกรองอาการเบื้องต้น'}
              </h2>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">พร้อมให้บริการ</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-6">
          {showHistory ? (
            <MedicalHistory 
              records={patientProfile.medicalHistory}
              onSendEmail={handleSendEmail}
            />
          ) : selectedSymptom ? (
            <SymptomDetails category={selectedSymptom} />
          ) : showMedicalCertificate ? (
            <MedicalCertificate latestRecord={patientProfile.medicalHistory[0]} />
          ) : showSendToDoctor ? (
            <SendToDoctor 
              patientProfile={patientProfile}
              latestRecord={patientProfile.medicalHistory[0]}
            />
          ) : (
            <>
              {state.messages.length === 0 && (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">ยินดีต้อนรับสู่ HealthScreen AI</h3>
                  <p className="text-gray-600 mb-4">กรุณาอธิบายอาการของคุณ เพื่อรับการวินิจฉัยเบื้องต้น</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      ตรวจอาการ
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      ฉุกเฉิน
                    </button>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                      อัพโหลดผลตรวจ
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                {state.messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="อธิบายอาการของคุณ..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                  title="อัพโหลดรูปภาพ"
                >
                  <ImageIcon className="w-6 h-6 text-white" />
                </button>
                
                <VoiceButton
                  isRecording={state.isRecording}
                  isProcessing={state.isProcessing}
                  onStart={startRecording}
                  onStop={stopRecording}
                />
                
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-6 h-6 text-white" />
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;