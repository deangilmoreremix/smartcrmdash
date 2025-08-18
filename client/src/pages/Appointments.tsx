import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Edit, Trash2, CheckCircle, X, Phone, Video, MessageSquare, ArrowLeft, ArrowRight, Filter } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  appointment_type: 'meeting' | 'call' | 'demo' | 'consultation';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location?: string;
  meeting_link?: string;
  notes?: string;
  reminder_sent?: boolean;
  created_at: Date;
  updated_at: Date;
}

const appointmentTypes = [
  { value: 'meeting', label: 'Meeting', icon: User },
  { value: 'call', label: 'Phone Call', icon: Phone },
  { value: 'demo', label: 'Demo', icon: Video },
  { value: 'consultation', label: 'Consultation', icon: MessageSquare },
];

const appointmentStatuses = [
  { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    appointment_type: 'meeting' as const,
    status: 'scheduled' as const,
    location: '',
    meeting_link: '',
    notes: '',
  });
  
  // Mock data initialization
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Product Demo with Acme Corp',
        description: 'Showcase our new features to potential enterprise client',
        start_time: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM today
        end_time: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM today
        contact_name: 'John Smith',
        contact_email: 'john@acmecorp.com',
        contact_phone: '+1-555-0123',
        appointment_type: 'demo',
        status: 'confirmed',
        meeting_link: 'https://zoom.us/j/123456789',
        notes: 'Focus on enterprise features and scalability',
        reminder_sent: true,
        created_at: new Date(Date.now() - 86400000),
        updated_at: new Date(Date.now() - 86400000),
      },
      {
        id: '2',
        title: 'Sales Consultation',
        description: 'Initial consultation with potential client',
        start_time: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 2 PM tomorrow
        end_time: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 3 PM tomorrow
        contact_name: 'Sarah Johnson',
        contact_email: 'sarah@techstart.com',
        contact_phone: '+1-555-0456',
        appointment_type: 'consultation',
        status: 'scheduled',
        location: 'Conference Room A',
        notes: 'Interested in our premium package',
        reminder_sent: false,
        created_at: new Date(Date.now() - 172800000),
        updated_at: new Date(Date.now() - 172800000),
      },
      {
        id: '3',
        title: 'Follow-up Call',
        description: 'Check-in with existing client about implementation',
        start_time: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9 AM day after tomorrow
        end_time: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 9.5 * 60 * 60 * 1000), // 9:30 AM day after tomorrow
        contact_name: 'Michael Chen',
        contact_email: 'michael@innovate.io',
        contact_phone: '+1-555-0789',
        appointment_type: 'call',
        status: 'scheduled',
        notes: 'Check progress on integration project',
        reminder_sent: false,
        created_at: new Date(Date.now() - 259200000),
        updated_at: new Date(Date.now() - 259200000),
      },
    ];
    
    setAppointments(mockAppointments);
  }, []);
  
  // Reset form when editing appointment changes
  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description || '',
        start_time: formatDateTimeForInput(editingAppointment.start_time),
        end_time: formatDateTimeForInput(editingAppointment.end_time),
        contact_name: editingAppointment.contact_name,
        contact_email: editingAppointment.contact_email || '',
        contact_phone: editingAppointment.contact_phone || '',
        appointment_type: editingAppointment.appointment_type,
        status: editingAppointment.status,
        location: editingAppointment.location || '',
        meeting_link: editingAppointment.meeting_link || '',
        notes: editingAppointment.notes || '',
      });
    } else {
      resetForm();
    }
  }, [editingAppointment]);
  
  const formatDateTimeForInput = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
  
  const resetForm = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    setFormData({
      title: '',
      description: '',
      start_time: formatDateTimeForInput(startTime),
      end_time: formatDateTimeForInput(endTime),
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      appointment_type: 'meeting',
      status: 'scheduled',
      location: '',
      meeting_link: '',
      notes: '',
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const appointmentData = {
        ...formData,
        start_time: new Date(formData.start_time),
        end_time: new Date(formData.end_time),
      };
      
      if (editingAppointment) {
        // Update existing appointment
        const updatedAppointment = {
          ...editingAppointment,
          ...appointmentData,
          updated_at: new Date(),
        };
        setAppointments(appointments.map(apt => 
          apt.id === editingAppointment.id ? updatedAppointment : apt
        ));
      } else {
        // Create new appointment
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          ...appointmentData,
          reminder_sent: false,
          created_at: new Date(),
          updated_at: new Date(),
        };
        setAppointments([...appointments, newAppointment]);
      }
      
      setShowAppointmentForm(false);
      setEditingAppointment(null);
      resetForm();
    } catch (err) {
      setError('Failed to save appointment');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    setIsLoading(true);
    try {
      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (err) {
      setError('Failed to delete appointment');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    setIsLoading(true);
    try {
      const updatedAppointments = appointments.map(apt =>
        apt.id === id ? { ...apt, status: newStatus, updated_at: new Date() } : apt
      );
      setAppointments(updatedAppointments);
    } catch (err) {
      setError('Failed to update appointment status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (filterType !== 'all' && apt.appointment_type !== filterType) return false;
    return true;
  });
  
  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };
  
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.toDateString() === date.toDateString();
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusColor = (status: string) => {
    return appointmentStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };
  
  const getTypeIcon = (type: string) => {
    const typeConfig = appointmentTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : User;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your meetings and appointments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar size={16} className="inline mr-1" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          
          <button
            onClick={() => {
              setEditingAppointment(null);
              setShowAppointmentForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus size={18} className="mr-1" />
            New Appointment
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Statuses</option>
                {appointmentStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Types</option>
              {appointmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {viewMode === 'calendar' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
                {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          <div className="grid grid-cols-7 bg-white">
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 border-r border-b border-gray-100"></div>
            ))}
            
            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayAppointments = getAppointmentsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={day}
                  className={`h-24 border-r border-b border-gray-100 p-1 cursor-pointer hover:bg-gray-50 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => {
                      const IconComponent = getTypeIcon(apt.appointment_type);
                      return (
                        <div
                          key={apt.id}
                          className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}
                          title={`${apt.title} - ${formatTime(apt.start_time)}`}
                        >
                          <IconComponent size={10} className="inline mr-1" />
                          {formatTime(apt.start_time)}
                        </div>
                      );
                    })}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 p-1">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-4">
                {filterStatus !== 'all' || filterType !== 'all' 
                  ? 'No appointments match your current filters' 
                  : 'Schedule your first appointment to get started'
                }
              </p>
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={18} className="mr-1" />
                New Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments
                .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
                .map((appointment) => {
                  const IconComponent = getTypeIcon(appointment.appointment_type);
                  return (
                    <div key={appointment.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <IconComponent size={20} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointmentStatuses.find(s => s.value === appointment.status)?.label}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  {appointment.start_time.toLocaleDateString()} at {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                </span>
                                <span className="flex items-center">
                                  <User size={14} className="mr-1" />
                                  {appointment.contact_name}
                                </span>
                              </div>
                              
                              {appointment.description && (
                                <p className="text-gray-500">{appointment.description}</p>
                              )}
                              
                              {(appointment.location || appointment.meeting_link) && (
                                <div className="flex items-center space-x-4 text-xs">
                                  {appointment.location && (
                                    <span>📍 {appointment.location}</span>
                                  )}
                                  {appointment.meeting_link && (
                                    <a 
                                      href={appointment.meeting_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      🔗 Meeting Link
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                              className="text-green-600 hover:text-green-700"
                              title="Confirm appointment"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Edit appointment"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete appointment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button
                onClick={() => {
                  setShowAppointmentForm(false);
                  setEditingAppointment(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter appointment title"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter appointment description"
                  />
                </div>
                
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="start_time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="end_time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter contact name"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter contact email"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter contact phone"
                  />
                </div>
                
                <div>
                  <label htmlFor="appointment_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="appointment_type"
                    value={formData.appointment_type}
                    onChange={(e) => setFormData({...formData, appointment_type: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {appointmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {appointmentStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    id="meeting_link"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter meeting link"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter additional notes"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setEditingAppointment(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : (editingAppointment ? 'Update Appointment' : 'Create Appointment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;