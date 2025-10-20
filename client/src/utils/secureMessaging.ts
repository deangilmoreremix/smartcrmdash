import { logger } from './logger';

interface MessageData {
  type: string;
  data?: any;
  source?: string;
  timestamp?: number;
}

interface SecureMessageOptions {
  allowedOrigins: string[];
  validateMessage?: (message: MessageData) => boolean;
  onMessage?: (message: MessageData, origin: string) => void;
  onError?: (error: Error) => void;
}

class SecureMessaging {
  private allowedOrigins: string[] = [];
  private validateMessage?: (message: MessageData) => boolean;
  private onMessage?: (message: MessageData, origin: string) => void;
  private onError?: (error: Error) => void;

  constructor(options: SecureMessageOptions) {
    this.allowedOrigins = options.allowedOrigins;
    this.validateMessage = options.validateMessage;
    this.onMessage = options.onMessage;
    this.onError = options.onError;

    this.setupMessageListener();
  }

  private setupMessageListener() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    try {
      // Validate origin
      if (!this.allowedOrigins.includes(event.origin)) {
        logger.warn('Message from unauthorized origin blocked', {
          origin: event.origin,
          allowedOrigins: this.allowedOrigins
        });
        return;
      }

      // Validate message structure
      if (!event.data || typeof event.data !== 'object') {
        logger.warn('Invalid message structure received', { data: event.data });
        return;
      }

      const message: MessageData = event.data;

      // Validate required fields
      if (!message.type || typeof message.type !== 'string') {
        logger.warn('Message missing required type field', message);
        return;
      }

      // Custom validation if provided
      if (this.validateMessage && !this.validateMessage(message)) {
        logger.warn('Message failed custom validation', message);
        return;
      }

      // Add timestamp if not present
      if (!message.timestamp) {
        message.timestamp = Date.now();
      }

      // Add source origin
      message.source = event.origin;

      logger.debug('Secure message received', { type: message.type, origin: event.origin });

      // Call the message handler
      this.onMessage?.(message, event.origin);

    } catch (error) {
      logger.error('Error handling secure message', error);
      this.onError?.(error as Error);
    }
  }

  // Send message to specific origin
  sendMessage(targetWindow: Window, message: MessageData, targetOrigin: string) {
    if (!this.allowedOrigins.includes(targetOrigin)) {
      const error = new Error(`Cannot send message to unauthorized origin: ${targetOrigin}`);
      logger.error('Message send blocked', error);
      this.onError?.(error);
      return;
    }

    try {
      const secureMessage = {
        ...message,
        timestamp: Date.now(),
        source: window.location.origin
      };

      targetWindow.postMessage(secureMessage, targetOrigin);
      logger.debug('Secure message sent', { type: message.type, targetOrigin });
    } catch (error) {
      logger.error('Failed to send secure message', error);
      this.onError?.(error as Error);
    }
  }

  // Send message to iframe
  sendToIframe(iframe: HTMLIFrameElement, message: MessageData) {
    if (!iframe.contentWindow) {
      const error = new Error('Iframe contentWindow not available');
      logger.error('Cannot send message to iframe', error);
      this.onError?.(error);
      return;
    }

    // For iframes, we need to determine the target origin
    // This is a simplified approach - in production, you might need more sophisticated origin detection
    const iframeSrc = iframe.src;
    let targetOrigin = '*'; // Default to allow any origin (less secure)

    if (iframeSrc) {
      try {
        const url = new URL(iframeSrc);
        targetOrigin = url.origin;

        if (!this.allowedOrigins.includes(targetOrigin)) {
          const error = new Error(`Iframe origin not in allowed list: ${targetOrigin}`);
          logger.error('Iframe message blocked', error);
          this.onError?.(error);
          return;
        }
      } catch (error) {
        logger.warn('Could not parse iframe src URL, using wildcard origin', { src: iframeSrc });
      }
    }

    this.sendMessage(iframe.contentWindow, message, targetOrigin);
  }

  // Update allowed origins
  updateAllowedOrigins(origins: string[]) {
    this.allowedOrigins = origins;
    logger.info('Allowed origins updated', { origins });
  }

  // Cleanup
  destroy() {
    window.removeEventListener('message', this.handleMessage.bind(this));
    logger.debug('Secure messaging destroyed');
  }
}

// Factory function to create secure messaging instance
export function createSecureMessaging(options: SecureMessageOptions): SecureMessaging {
  return new SecureMessaging(options);
}

// Default allowed origins for SmartCRM
export const DEFAULT_ALLOWED_ORIGINS = [
  'https://contacts.smartcrm.vip',
  'https://analytics.smartcrm.vip',
  'https://agency.smartcrm.vip',
  'https://pipeline.smartcrm.vip',
  'https://research.smartcrm.vip',
  'https://salesmax.smartcrm.vip',
  'https://referrals.smartcrm.vip',
  'https://contentai.smartcrm.vip',
  'https://calendar.smartcrm.vip',
  'https://ai-analytics.smartcrm.vip',
  window.location.origin // Allow same origin
];

// Message type constants
export const MESSAGE_TYPES = {
  READY: 'REMOTE_READY',
  NAVIGATE: 'NAVIGATE',
  DATA_SYNC: 'DATA_SYNC',
  THEME_CHANGE: 'THEME_CHANGE',
  ERROR: 'ERROR',
  PING: 'PING',
  PONG: 'PONG'
} as const;

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];