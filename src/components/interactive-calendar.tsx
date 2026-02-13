'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: false },
  { time: '17:00', available: true },
];

export function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: 0, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (day: number) => {
    if (day === 0) return;
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      alert(`Agendamento confirmado para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`);
      // Aqui você pode adicionar lógica para enviar para um backend
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-primary/10 dark:border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-8 h-8" />
            <h2 className="text-3xl font-headline">Agendar Consulta</h2>
          </div>
          <p className="text-white/80">Escolha a melhor data e horário para você</p>
        </div>

        <div className="p-8 bg-white dark:bg-gray-900">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="w-10 h-10 rounded-full hover:bg-secondary transition-all flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-full hover:bg-secondary transition-all flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Week days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-600 dark:text-gray-300 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((dayObj, idx) => {
                  const isSelected = selectedDate?.getDate() === dayObj.day && dayObj.isCurrentMonth;
                  const isTodayDay = isToday(dayObj.day);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(dayObj.day)}
                      disabled={!dayObj.isCurrentMonth}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                        ${!dayObj.isCurrentMonth 
                        ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                        : 'text-gray-900 dark:text-white'
                        }
                          ${isSelected ? 'bg-gradient-to-br from-primary to-accent !text-white shadow-lg scale-110' : ''}
                          ${!isSelected && dayObj.isCurrentMonth ? 'hover:bg-secondary dark:hover:bg-white/10 hover:scale-105' : ''}
                          ${isTodayDay && !isSelected ? 'border-2 border-primary' : ''}
                        `}
                    >
                      {dayObj.day || ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Horários Disponíveis</h3>
              </div>

              {!selectedDate ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Selecione uma data primeiro</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`
                        w-full p-4 rounded-2xl font-medium transition-all text-left
                        ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                        ${slot.available && selectedTime === slot.time ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105' : ''}
                        ${slot.available && selectedTime !== slot.time ? 'bg-secondary hover:bg-primary/10 hover:border-primary border border-transparent' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot.time}</span>
                        {!slot.available && (
                          <span className="text-xs">Indisponível</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="mt-6 p-6 bg-gradient-to-br from-secondary to-muted/30 rounded-2xl border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Resumo do agendamento:</p>
                  <p className="font-bold text-lg text-foreground">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-primary font-bold text-xl">{selectedTime}</p>
                  
                  <Button
                    onClick={handleConfirm}
                    className="w-full mt-4 h-12 rounded-xl font-bold shadow-lg"
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
