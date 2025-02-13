import React, { useState } from 'react';
import { FileText, Send, Check, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { MedicalRecord, PatientProfile } from '../types';

interface SendToDoctorProps {
  patientProfile: PatientProfile;
  latestRecord?: MedicalRecord;
}

export const SendToDoctor: React.FC<SendToDoctorProps> = ({
  patientProfile,
  latestRecord
}) => {
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const generateLetter = () => {
    const doc = new jsPDF();
    const lineHeight = 10;
    let yPosition = 20;

    // Add header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('จดหมายรับรองแพทย์', 105, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;

    // Add date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, 20, yPosition);
    yPosition += lineHeight * 2;

    // Add patient information
    doc.text('ข้อมูลผู้ป่วย:', 20, yPosition);
    yPosition += lineHeight;
    doc.text(`ชื่อ-นามสกุล: ${patientProfile.name}`, 30, yPosition);
    yPosition += lineHeight;
    doc.text(`วันเกิด: ${patientProfile.dateOfBirth.toLocaleDateString('th-TH')}`, 30, yPosition);
    yPosition += lineHeight * 2;

    // Add diagnosis
    if (latestRecord) {
      doc.text('การวินิจฉัย:', 20, yPosition);
      yPosition += lineHeight;
      doc.text(latestRecord.diagnosis, 30, yPosition);
      yPosition += lineHeight;
      
      doc.text('อาการที่พบ:', 20, yPosition);
      yPosition += lineHeight;
      latestRecord.symptoms.forEach(symptom => {
        doc.text(`- ${symptom}`, 30, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    }

    // Add additional notes
    if (additionalNotes) {
      doc.text('บันทึกเพิ่มเติม:', 20, yPosition);
      yPosition += lineHeight;
      
      // Split long text into multiple lines
      const splitNotes = doc.splitTextToSize(additionalNotes, 170);
      splitNotes.forEach(line => {
        doc.text(line, 30, yPosition);
        yPosition += lineHeight;
      });
    }

    // Add footer
    yPosition = doc.internal.pageSize.height - 40;
    doc.text('แพทย์ผู้ตรวจ', 150, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    doc.line(120, yPosition, 180, yPosition);
    
    return doc;
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    const doc = generateLetter();
    doc.save('medical_letter.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          จดหมายถึงแพทย์
        </h2>

        {!isConfirmed ? (
          <div className="space-y-6">
            {/* ข้อมูลผู้ป่วย */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">ข้อมูลผู้ป่วย</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">ชื่อ-นามสกุล:</span> {patientProfile.name}</p>
                <p><span className="font-medium">วันเกิด:</span> {patientProfile.dateOfBirth.toLocaleDateString('th-TH')}</p>
              </div>
            </div>

            {/* การวินิจฉัยล่าสุด */}
            {latestRecord && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">การวินิจฉัยล่าสุด</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">วินิจฉัย:</span> {latestRecord.diagnosis}</p>
                  <p className="font-medium mt-2">อาการที่พบ:</p>
                  <ul className="list-disc list-inside">
                    {latestRecord.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* บันทึกเพิ่มเติม */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">บันทึกเพิ่มเติมถึงแพทย์</h3>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="เพิ่มข้อมูลหรือรายละเอียดที่ต้องการแจ้งแพทย์..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex justify-end gap-4">
              {!isPreview ? (
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ดูตัวอย่าง
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  ยืนยันและดาวน์โหลด PDF
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">สร้างจดหมายเรียบร้อยแล้ว</h3>
            <p className="text-gray-600">ไฟล์ PDF ได้ถูกดาวน์โหลดไปยังเครื่องของคุณแล้ว</p>
          </div>
        )}
      </div>

      {/* คำแนะนำ */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 font-medium">คำแนะนำในการใช้จดหมาย</p>
          <p className="text-blue-600 text-sm mt-1">
            จดหมายนี้เป็นเพียงการสรุปข้อมูลเบื้องต้นเพื่อส่งต่อให้แพทย์ 
            กรุณานำไปพบแพทย์เพื่อรับการตรวจวินิจฉัยอย่างละเอียดอีกครั้ง
          </p>
        </div>
      </div>
    </div>
  );
};