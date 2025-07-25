import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentType = 'in-person' | 'video' | 'phone';
export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled' | 'no-show';

export interface Appointment {
  id: string;
  title: string;
  contactId?: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  date: Date;
  endDate: Date;
  duration: number; // in minutes
  type: AppointmentType;
  location?: string;
  notes?: string;
  status: AppointmentStatus;
  reminders?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface AppointmentState {
  appointments: Record<string, Appointment>;
  isLoading: boolean;
  error: string | null;
  selectedSlot: Date | null;
  selectedAppointment: string | null;
  
  // Actions
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointment: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  selectAppointment: (id: string | null) => void;
  selectTimeSlot: (date: Date | null) => void;
  isTimeSlotAvailable: (date: Date, duration?: number) => boolean;
  getAppointmentsForDate: (date: Date) => Appointment[];
  getUpcomingAppointments: (limit?: number) => Appointment[];
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: {
    'appt-1': {
      id: 'appt-1',
      title: 'Product Demo',
      contactName: 'John Doe',
      contactEmail: 'john.doe@example.com',
      contactPhone: '(555) 123-4567',
      date: new Date(new Date().setHours(10, 0, 0, 0)), // Today at 10:00 AM
      endDate: new Date(new Date().setHours(10, 30, 0, 0)), // Today at 10:30 AM
      duration: 30,
      type: 'video',
      notes: 'Focus on enterprise features',
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user-123'
    },
    'appt-2': {
      id: 'appt-2',
      title: 'Initial Consultation',
      contactName: 'Jane Smith',
      contactEmail: 'jane.smith@example.com',
      contactPhone: '(555) 987-6543',
      date: new Date(new Date().setHours(14, 30, 0, 0)), // Today at 2:30 PM
      endDate: new Date(new Date().setHours(15, 30, 0, 0)), // Today at 3:30 PM
      duration: 60,
      type: 'in-person',
      location: '123 Business St, Suite 101',
      notes: 'Discuss project requirements and timeline',
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user-123'
    },
    'appt-3': {
      id: 'appt-3',
      title: 'Follow-up Call',
      contactName: 'Robert Johnson',
      contactEmail: 'robert@example.com',
      contactPhone: '(555) 456-7890',
      // Fix: avoid duplicate date property by setting both date and endDate correctly
      date: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0, 0)), // Tomorrow at 11:00 AM
      endDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 15, 0, 0)), // Tomorrow at 11:15 AM
      duration: 15,
      type: 'phone',
      notes: 'Discuss proposal feedback',
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user-123'
    }
  },
  isLoading: false,
  error: null,
  selectedSlot: null,
  selectedAppointment: null,
  
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would fetch appointments from an API
      // For the demo, we'll just use our mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ isLoading: false });
    } catch (err) {
      console.error('Error fetching appointments:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch appointments' 
      });
    }
  },
  
  createAppointment: async (appointmentData: Partial<Appointment>) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would send this to an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const appointmentId = uuidv4();
      const now = new Date();
      
      // Create end date by adding duration to start date
      const endDate = new Date(appointmentData.date || now);
      endDate.setMinutes(endDate.getMinutes() + (appointmentData.duration || 30));
      
      const newAppointment: Appointment = {
        id: appointmentId,
        title: appointmentData.title || 'New Appointment',
        contactId: appointmentData.contactId,
        contactName: appointmentData.contactName || 'No Contact',
        contactEmail: appointmentData.contactEmail,
        contactPhone: appointmentData.contactPhone,
        date: appointmentData.date || now,
        endDate: appointmentData.endDate || endDate,
        duration: appointmentData.duration || 30,
        type: appointmentData.type || 'video',
        location: appointmentData.location,
        notes: appointmentData.notes,
        status: appointmentData.status || 'scheduled',
        reminders: appointmentData.reminders,
        createdAt: now,
        updatedAt: now,
        userId: 'demo-user-123'
      };
      
      const { appointments } = get();
      
      set({ 
        appointments: { ...appointments, [appointmentId]: newAppointment },
        isLoading: false,
        selectedSlot: null
      });
      
      return newAppointment;
    } catch (err) {
      console.error('Error creating appointment:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to create appointment' 
      });
      throw err;
    }
  },
  
  updateAppointment: async (id: string, appointmentData: Partial<Appointment>) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would send this to an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { appointments } = get();
      const existingAppointment = appointments[id];
      
      if (!existingAppointment) {
        throw new Error(`Appointment with id ${id} not found`);
      }
      
      // If duration changed, update the endDate
      let endDate = appointmentData.endDate;
      if (appointmentData.date && appointmentData.duration) {
        endDate = new Date(appointmentData.date);
        endDate.setMinutes(endDate.getMinutes() + appointmentData.duration);
      } else if (appointmentData.date && !appointmentData.endDate) {
        // If only date changed but not duration, recalculate endDate
        endDate = new Date(appointmentData.date);
        endDate.setMinutes(endDate.getMinutes() + (existingAppointment.duration || 30));
      } else if (!appointmentData.date && appointmentData.duration) {
        // If only duration changed but not date, recalculate endDate
        endDate = new Date(existingAppointment.date);
        endDate.setMinutes(endDate.getMinutes() + appointmentData.duration);
      }
      
      const updatedAppointment: Appointment = {
        ...existingAppointment,
        ...appointmentData,
        endDate: endDate || existingAppointment.endDate,
        updatedAt: new Date()
      };
      
      set({ 
        appointments: { ...appointments, [id]: updatedAppointment },
        isLoading: false 
      });
      
      return updatedAppointment;
    } catch (err) {
      console.error('Error updating appointment:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to update appointment' 
      });
      throw err;
    }
  },
  
  deleteAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would send this to an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { appointments } = get();
      const { [id]: deletedAppointment, ...remainingAppointments } = appointments;
      
      set({ 
        appointments: remainingAppointments,
        isLoading: false,
        selectedAppointment: null
      });
    } catch (err) {
      console.error('Error deleting appointment:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to delete appointment' 
      });
      throw err;
    }
  },
  
  selectAppointment: (id) => {
    set({ selectedAppointment: id });
  },
  
  selectTimeSlot: (date) => {
    set({ selectedSlot: date });
  },
  
  isTimeSlotAvailable: (date, duration = 30) => {
    const { appointments } = get();
    const startTime = date.getTime();
    const endTime = new Date(date.getTime() + duration * 60000).getTime();
    
    return !Object.values(appointments).some(appointment => {
      const apptStartTime = appointment.date.getTime();
      const apptEndTime = appointment.endDate.getTime();
      
      // Check if there is any overlap
      return (
        (startTime >= apptStartTime && startTime < apptEndTime) || // New start time falls within existing appointment
        (endTime > apptStartTime && endTime <= apptEndTime) || // New end time falls within existing appointment
        (startTime <= apptStartTime && endTime >= apptEndTime) // New appointment completely contains existing appointment
      );
    });
  },
  
  getAppointmentsForDate: (date) => {
    const { appointments } = get();
    
    return Object.values(appointments).filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        date.getFullYear() === appointmentDate.getFullYear() &&
        date.getMonth() === appointmentDate.getMonth() &&
        date.getDate() === appointmentDate.getDate()
      );
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  },
  
  getUpcomingAppointments: (limit = 5) => {
    const { appointments } = get();
    const now = new Date();
    
    return Object.values(appointments)
      .filter(appointment => appointment.date >= now && appointment.status === 'scheduled')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }
}));