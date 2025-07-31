// White Label System - Main Export File
// This file provides easy access to all white-label components

export { WhiteLabelProvider, useWhiteLabel } from '../../contexts/WhiteLabelContext';
export { WhiteLabelEditor } from './WhiteLabelEditor';
export { BrandingPanel } from './BrandingPanel';
export { ColorSchemeEditor } from './ColorSchemeEditor';
export { LogoUploader } from './LogoUploader';
export { PreviewPanel } from './PreviewPanel';

// Default export for the main editor
export { default } from './WhiteLabelEditor';
