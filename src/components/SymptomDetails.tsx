import React from 'react';
import { AlertCircle, Stethoscope, Activity } from 'lucide-react';
import type { SymptomCategory } from '../types';

interface SymptomDetailsProps {
  category: SymptomCategory;
}

export const SymptomDetails: React.FC<SymptomDetailsProps> = ({ category }) => {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h4 className="text-lg font-semibold text-gray-800">อาการที่พบบ่อย</h4>
          </div>
          <ul className="space-y-2">
            {category.symptoms.map((symptom, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-gray-700">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h4 className="text-lg font-semibold text-gray-800">การรักษาเบื้องต้น</h4>
          </div>
          <ul className="space-y-3">
            {category.initialTreatment.map((treatment, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-700">{treatment}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          หมายเหตุ: ข้อมูลนี้ใช้เพื่อเป็นแนวทางเบื้องต้นเท่านั้น หากมีอาการรุนแรงควรพบแพทย์ทันที
        </p>
      </div>
    </div>
  );
};