import React, { useState } from 'react';
import { Appointment, ScreenType } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  ChevronRight,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AppointmentsScreenProps {
  appointments: Appointment[];
  onOpenPrepareModal: (appointment: Appointment) => void;
  onNavigate: (screen: ScreenType) => void;
  onAddAppointment: (appointment: Appointment) => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  appointments,
  onOpenPrepareModal,
  onNavigate,
  onAddAppointment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor || !newDate) return;

    const apt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName: newDoctor,
      specialty: 'Obstetrics & Maternal Health',
      clinicName: newClinic || 'Blossom Maternal Health Clinic',
      date: newDate,
      time: newTime || '10:00 AM',
      location: 'Main Medical Pavilion, Suite 300',
      notes: newNotes || 'Routine gestational evaluation.',
      questionsToAsk: [
        'Review current gestational milestones and blood pressure.',
        'Discuss third-trimester preparation and recommended immunizations.'
      ],
      isAiPrepared: false,
      type: 'Routine Check'
    };

    onAddAppointment(apt);
    setShowAddModal(false);
    setNewDoctor('');
    setNewDate('');
    setNewTime('');
    setNewClinic('');
    setNewNotes('');
  };

  return (
    <div className="space-y-7 pb-12 max-w-4xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Upcoming clinical visits, pediatric meet-and-greets, and AI-curated question lists
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-5"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center shrink-0 border border-[#EADACD]">
                  <Calendar className="w-5 h-5 text-[#B25742]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C3A27] bg-[#F5ECE8] px-2 py-0.5 rounded-full inline-block mb-1">
                    {apt.type}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#242122]">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs text-stone-500">{apt.specialty} · {apt.clinicName}</p>
                </div>
              </div>

              {/* Date & Time pill */}
              <div className="text-left sm:text-right bg-[#FAF6F2] p-3 rounded-2xl border border-[#EFE7DE] shrink-0">
                <p className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B25742]" />
                  <span>{apt.date}</span>
                </p>
                <p className="text-[11px] text-stone-500 flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{apt.time}</span>
                </p>
              </div>
            </div>

            {/* Location & Clinic Notes */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{apt.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{apt.notes}</span>
              </div>
            </div>

            {/* Questions to Ask & Prepare Action */}
            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EADACD] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
                    <span>Curated Questions to Ask ({apt.questionsToAsk.length})</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Prepared from your Week 24 vitals, ferritin lab result, and symptom logs
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPrepareModal(apt)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#DECBC2] text-[#8C3A27] hover:bg-[#F5ECE8] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prepare for my appointment</span>
                </button>
              </div>

              <ul className="space-y-2 text-xs text-stone-800">
                {apt.questionsToAsk.map((q, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-[#EFE7DE] flex items-start gap-2"
                  >
                    <span className="font-serif font-bold text-[#8C3A27] mt-0.5">
                      {idx + 1}.
                    </span>
                    <span className="leading-snug">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#EFE7DE]">
            <h3 className="text-lg font-serif font-bold text-[#242122] mb-1">
              Add Healthcare Appointment
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Schedule your next antenatal checkup or specialist visit
            </p>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Doctor or Practitioner Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Dr. Maya Sharma"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Clinic or Facility
                </label>
                <input
                  type="text"
                  placeholder="E.g., Blossom Maternal Pavilion"
                  value={newClinic}
                  onChange={(e) => setNewClinic(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Friday, Oct 18, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., 10:30 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Visit Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., 28-week routine screening and glucose follow-up..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition shadow-xs"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
