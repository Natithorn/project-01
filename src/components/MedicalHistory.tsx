import React from 'react';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import type { MedicalRecord } from '../types';

interface MedicalHistoryProps {
  records: MedicalRecord[];
  onSendEmail: (record: MedicalRecord) => void;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({ records, onSendEmail }) => {
  const currentMonth = new Date().getMonth();
  const currentMonthRecords = records.filter(
    record => record.date.getMonth() === currentMonth
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        Medical History This Month
      </h2>
      
      {currentMonthRecords.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No medical records for this month.</p>
      ) : (
        <div className="space-y-4">
          {currentMonthRecords.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{record.diagnosis}</h3>
                  <p className="text-sm text-gray-500">
                    {record.date.toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {record.status === 'resolved' ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      หายแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      กำลังรักษา
                    </span>
                  )}
                </span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">อาการ:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {record.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">บันทึกเพิ่มเติม:</p>
                  <p className="text-sm text-gray-600">{record.notes}</p>
                </div>

                {record.images && record.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {record.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Medical record ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onSendEmail(record)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ส่งข้อมูลทางอีเมล
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};