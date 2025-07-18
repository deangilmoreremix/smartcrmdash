// Core App Component
export { default as SDRButtonsApp } from '../App';

// Main Components 
export { default as Dashboard } from '../components/Dashboard';
export { default as Navbar } from '../components/Navbar';

// AI Components
export { default as AIGoalsCard } from '../components/AIGoalsCard';
export { default as AIGoalsPanel } from '../components/AIGoalsPanel';
export { default as AIInsightsPanel } from '../components/AIInsightsPanel';
export { default as AIModelSelector } from '../components/AIModelSelector';
export { default as AIModelUsageStats } from '../components/AIModelUsageStats';
export { default as AIToolsProvider } from '../components/AIToolsProvider';
export { default as AIUsageDashboard } from '../components/AIUsageDashboard';
export { default as EnhancedAIInsightsPanel } from '../components/EnhancedAIInsightsPanel';

// Communication & Call Components
export { default as CallButton } from '../components/CallButton';
export { default as CallHistory } from '../components/CallHistory';
export { default as CallRecording } from '../components/CallRecording';
export { default as ConnectionQuality } from '../components/ConnectionQuality';
export { default as GroupCallInterface } from '../components/GroupCallInterface';
export { default as GroupCallView } from '../components/GroupCallView';
export { default as InCallMessaging } from '../components/InCallMessaging';
export { default as PersistentVideoCallButton } from '../components/PersistentVideoCallButton';
export { default as PreCallSetup } from '../components/PreCallSetup';
export { default as VideoCallOverlay } from '../components/VideoCallOverlay';
export { default as VideoCallPreviewWidget } from '../components/VideoCallPreviewWidget';

// Dashboard & Analytics Components
export { default as DashboardLayoutControls } from '../components/DashboardLayoutControls';
export { default as DealAnalytics } from '../components/DealAnalytics';
export { default as KPICards } from '../components/KPICards';

// Contact & Lead Components
export { default as ContactCard } from '../components/ContactCard';
export { default as LeadsSection } from '../components/LeadsSection';

// Task & Project Components
export { default as TaskCard } from '../components/TaskCard';
export { default as TasksSection } from '../components/TasksSection';

// Appointment & Scheduling
export { default as AppointmentWidget } from '../components/AppointmentWidget';

// Company & Branding
export { default as CompanyLogoManager } from '../components/CompanyLogoManager';
export { default as CompanyLogoUploader } from '../components/CompanyLogoUploader';

// UI & Layout Components
export { default as DraggableSection } from '../components/DraggableSection';
export { default as QuickActions } from '../components/QuickActions';

// Modal Components
export { default as ModalsProvider } from '../components/ModalsProvider';
export { default as PipelineModal } from '../components/PipelineModal';

// Utility Components
export { default as DevicePermissionChecker } from '../components/DevicePermissionChecker';

// Export all AI Tools
export * from '../components/ai';
export * from '../components/aiTools';

// Export Dashboard sections
export * from '../components/dashboard';
export * from '../components/sections';

// Export UI components
export * from '../components/ui';

// Export contexts, hooks, services, etc.
export * from '../contexts';
export * from '../hooks';
export * from '../services';
export * from '../store';
export * from '../types';
export * from '../utils';
