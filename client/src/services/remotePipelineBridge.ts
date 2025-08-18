// Remote Pipeline Bridge - Cross-Origin Communication Service
export interface CRMDeal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contactId: string;
  contactName?: string;
  company?: string;
  probability?: number;
  expectedCloseDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRMPipelineData {
  deals: CRMDeal[];
  stages: string[];
  totalValue: number;
  activeDeals: number;
}

export interface PipelineMessage {
  type: string;
  data?: any;
  source: 'CRM' | 'REMOTE_PIPELINE';
  timestamp: number;
}

export class RemotePipelineBridge {
  private iframe: HTMLIFrameElement | null = null;
  private messageHandlers = new Map<string, (data: any) => void>();
  private targetOrigin = 'https://cheery-syrniki-b5b6ca.netlify.app';
  private isConnected = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Listen for messages from remote pipeline
    window.addEventListener('message', this.handleMessage.bind(this));
    
    console.log('🔗 Pipeline Bridge initialized');
  }

  private handleMessage(event: MessageEvent) {
    // Security check - only accept messages from our target origin
    if (event.origin !== this.targetOrigin) {
      return;
    }

    try {
      const message: PipelineMessage = event.data;
      
      if (!message || typeof message !== 'object' || message.source !== 'REMOTE_PIPELINE') {
        return;
      }

      console.log('📨 Pipeline message received:', message.type, message.data);

      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse pipeline message:', error);
    }
  }

  public setIframe(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    console.log('📺 Pipeline iframe connected');
  }

  public onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  private sendMessage(type: string, data?: any) {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.warn('⚠️ No pipeline iframe available for messaging');
      return;
    }

    const message: PipelineMessage = {
      type,
      data,
      source: 'CRM',
      timestamp: Date.now()
    };

    try {
      this.iframe.contentWindow.postMessage(message, this.targetOrigin);
      console.log('📤 Pipeline message sent:', type, data);
    } catch (error) {
      console.error('❌ Failed to send pipeline message:', error);
    }
  }

  // Initialize CRM connection with pipeline data
  public initializeCRM(pipelineData: CRMPipelineData, crmInfo: { name: string; version: string }) {
    console.log('🚀 Initializing CRM connection with pipeline data');
    this.sendMessage('CRM_INIT', {
      pipelineData,
      crmInfo,
      timestamp: Date.now()
    });
  }

  // Sync deals with remote pipeline
  public syncDeals(deals: CRMDeal[]) {
    console.log('🔄 Syncing deals with remote pipeline:', deals.length, 'deals');
    this.sendMessage('SYNC_DEALS', { deals });
  }

  // Request pipeline data from remote
  public requestPipelineData() {
    console.log('📥 Requesting pipeline data from remote');
    this.sendMessage('REQUEST_PIPELINE_DATA');
  }

  // Update deal in remote pipeline
  public updateDeal(dealId: string, updates: Partial<CRMDeal>) {
    console.log('✏️ Updating deal in remote pipeline:', dealId, updates);
    this.sendMessage('UPDATE_DEAL', { dealId, updates });
  }

  // Create new deal in remote pipeline
  public createDeal(deal: Omit<CRMDeal, 'id'>) {
    console.log('📝 Creating deal in remote pipeline:', deal);
    this.sendMessage('CREATE_DEAL', { deal });
  }

  // Delete deal in remote pipeline
  public deleteDeal(dealId: string) {
    console.log('🗑️ Deleting deal in remote pipeline:', dealId);
    this.sendMessage('DELETE_DEAL', { dealId });
  }

  // Move deal to different stage
  public moveDeal(dealId: string, newStage: string, position?: number) {
    console.log('↔️ Moving deal in remote pipeline:', dealId, 'to', newStage);
    this.sendMessage('MOVE_DEAL', { dealId, newStage, position });
  }

  // Set connection status
  public setConnected(status: boolean) {
    this.isConnected = status;
    console.log('🔗 Pipeline connection status:', status ? 'Connected' : 'Disconnected');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Inject bridge code into remote pipeline (if accessible)
  public injectBridgeCode() {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.warn('⚠️ Cannot inject bridge code - no iframe available');
      return;
    }

    const bridgeScript = `
      // CRM Pipeline Bridge Integration
      window.crmBridge = {
        send: (type, data) => {
          window.parent.postMessage({
            type,
            data,
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        },
        
        ready: () => {
          window.parent.postMessage({
            type: 'REMOTE_READY',
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        },
        
        onDealUpdate: (deal) => {
          window.parent.postMessage({
            type: 'DEAL_UPDATED',
            data: deal,
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        },
        
        onDealCreate: (deal) => {
          window.parent.postMessage({
            type: 'DEAL_CREATED',
            data: deal,
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        },
        
        onDealDelete: (dealId) => {
          window.parent.postMessage({
            type: 'DEAL_DELETED',
            data: { id: dealId },
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        },
        
        onStageChange: (dealId, oldStage, newStage) => {
          window.parent.postMessage({
            type: 'DEAL_STAGE_CHANGED',
            data: { dealId, oldStage, newStage },
            source: 'REMOTE_PIPELINE',
            timestamp: Date.now()
          }, '*');
        }
      };
      
      // Notify CRM that bridge is ready
      setTimeout(() => {
        if (window.crmBridge) {
          window.crmBridge.ready();
        }
      }, 1000);
    `;

    try {
      // Attempt to inject script (will only work if same-origin or CORS allows)
      const script = this.iframe.contentDocument?.createElement('script');
      if (script) {
        script.textContent = bridgeScript;
        this.iframe.contentDocument?.head?.appendChild(script);
        console.log('✅ Bridge script injected successfully');
      }
    } catch (error) {
      console.log('ℹ️ Bridge injection not possible (CORS/Same-origin policy) - using postMessage only');
      // Fallback: send bridge code as message
      this.sendMessage('INJECT_BRIDGE', { script: bridgeScript });
    }
  }

  // Cleanup
  public disconnect() {
    console.log('🔌 Disconnecting pipeline bridge');
    this.messageHandlers.clear();
    this.iframe = null;
    this.isConnected = false;
  }
}