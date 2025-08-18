// Remote Pipeline Integration Code
// Add this JavaScript to your remote pipeline app (https://cheery-syrniki-b5b6ca.netlify.app)

(function() {
  'use strict';

  // CRM Pipeline Bridge for Remote App
  class CRMPipelineBridge {
    constructor() {
      this.crmData = null;
      this.deals = [];
      this.stages = [];
      this.isInitialized = false;
      
      // Listen for messages from parent CRM
      window.addEventListener('message', this.handleCRMMessage.bind(this));
      
      console.log('🔗 Pipeline Bridge initialized in remote app');
      
      // Notify parent CRM that we're ready
      setTimeout(() => {
        this.sendToCRM('REMOTE_READY', { timestamp: Date.now() });
      }, 500);
    }

    handleCRMMessage(event) {
      // Security: Only accept messages from your CRM domain
      const allowedOrigins = [
        'https://9f38fddb-d049-4cd4-9f57-c41b6a878a9d-00-2xv27ubfspt46.riker.replit.dev',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      try {
        const message = event.data;
        if (!message || message.source !== 'CRM') {
          return;
        }

        console.log('📨 CRM message received:', message.type, message.data);

        switch (message.type) {
          case 'CRM_INIT':
            this.handleCRMInit(message.data);
            break;
          case 'SYNC_DEALS':
            this.handleDealsSync(message.data.deals);
            break;
          case 'UPDATE_DEAL':
            this.handleDealUpdate(message.data);
            break;
          case 'CREATE_DEAL':
            this.handleDealCreate(message.data.deal);
            break;
          case 'DELETE_DEAL':
            this.handleDealDelete(message.data.dealId);
            break;
          case 'MOVE_DEAL':
            this.handleDealMove(message.data);
            break;
          case 'REQUEST_PIPELINE_DATA':
            this.sendPipelineDataToCRM();
            break;
          case 'INJECT_BRIDGE':
            // Bridge code injection (if needed)
            console.log('🔧 Bridge injection received');
            break;
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse CRM message:', error);
      }
    }

    handleCRMInit(data) {
      console.log('🚀 CRM initialization received:', data);
      this.crmData = data.crmInfo;
      this.deals = data.pipelineData.deals || [];
      this.stages = data.pipelineData.stages || [];
      this.isInitialized = true;
      
      // Update your pipeline UI with CRM data
      this.updatePipelineUI();
      
      // Send confirmation back to CRM
      this.sendToCRM('CRM_INIT_COMPLETE', {
        dealsReceived: this.deals.length,
        stagesReceived: this.stages.length
      });
    }

    handleDealsSync(deals) {
      console.log('🔄 Syncing deals from CRM:', deals.length);
      this.deals = deals;
      this.updatePipelineUI();
    }

    handleDealUpdate(data) {
      console.log('✏️ Deal update from CRM:', data);
      const dealIndex = this.deals.findIndex(deal => deal.id === data.dealId);
      if (dealIndex !== -1) {
        this.deals[dealIndex] = { ...this.deals[dealIndex], ...data.updates };
        this.updateDealInUI(data.dealId, data.updates);
      }
    }

    handleDealCreate(deal) {
      console.log('📝 New deal from CRM:', deal);
      const newDeal = {
        id: deal.id || Date.now().toString(),
        ...deal
      };
      this.deals.push(newDeal);
      this.addDealToUI(newDeal);
    }

    handleDealDelete(dealId) {
      console.log('🗑️ Delete deal from CRM:', dealId);
      this.deals = this.deals.filter(deal => deal.id !== dealId);
      this.removeDealFromUI(dealId);
    }

    handleDealMove(data) {
      console.log('↔️ Move deal from CRM:', data);
      const deal = this.deals.find(d => d.id === data.dealId);
      if (deal) {
        deal.stage = data.newStage;
        this.updateDealStageInUI(data.dealId, data.newStage, data.position);
      }
    }

    // Send message to parent CRM
    sendToCRM(type, data = null) {
      const message = {
        type,
        data,
        source: 'REMOTE_PIPELINE',
        timestamp: Date.now()
      };

      try {
        window.parent.postMessage(message, '*');
        console.log('📤 Message sent to CRM:', type, data);
      } catch (error) {
        console.error('❌ Failed to send message to CRM:', error);
      }
    }

    // Update your pipeline UI with CRM data
    updatePipelineUI() {
      console.log('🎨 Updating pipeline UI with', this.deals.length, 'deals');
      
      // Example: Update deal counts in your UI
      if (window.updateDealCounts) {
        window.updateDealCounts(this.deals);
      }
      
      // Example: Refresh pipeline columns
      if (window.refreshPipelineColumns) {
        window.refreshPipelineColumns(this.deals, this.stages);
      }
      
      // Example: Update statistics
      const totalValue = this.deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const activeDeals = this.deals.filter(deal => !deal.stage.includes('closed'));
      
      console.log('📊 Pipeline Stats:', {
        totalDeals: this.deals.length,
        totalValue: totalValue,
        activeDeals: activeDeals.length
      });
      
      // Trigger your app's native update methods
      this.triggerAppUpdate();
    }

    updateDealInUI(dealId, updates) {
      // Update specific deal in your UI
      console.log('🔄 Updating deal in UI:', dealId, updates);
      
      // Example implementation - replace with your actual UI update logic
      const dealElement = document.querySelector(`[data-deal-id="${dealId}"]`);
      if (dealElement) {
        if (updates.title) {
          const titleElement = dealElement.querySelector('.deal-title');
          if (titleElement) titleElement.textContent = updates.title;
        }
        
        if (updates.value) {
          const valueElement = dealElement.querySelector('.deal-value');
          if (valueElement) valueElement.textContent = this.formatCurrency(updates.value);
        }
      }
      
      this.triggerAppUpdate();
    }

    addDealToUI(deal) {
      // Add new deal to your UI
      console.log('➕ Adding deal to UI:', deal);
      this.triggerAppUpdate();
    }

    removeDealFromUI(dealId) {
      // Remove deal from your UI
      console.log('➖ Removing deal from UI:', dealId);
      const dealElement = document.querySelector(`[data-deal-id="${dealId}"]`);
      if (dealElement) {
        dealElement.remove();
      }
      this.triggerAppUpdate();
    }

    updateDealStageInUI(dealId, newStage, position) {
      // Move deal to different stage column
      console.log('↔️ Moving deal in UI:', dealId, 'to', newStage);
      this.triggerAppUpdate();
    }

    // Helper method to trigger your app's update mechanism
    triggerAppUpdate() {
      // Dispatch custom event that your app can listen to
      window.dispatchEvent(new CustomEvent('crmDataUpdated', {
        detail: {
          deals: this.deals,
          stages: this.stages,
          timestamp: Date.now()
        }
      }));
      
      // Call your app's refresh/update methods
      if (window.refreshPipeline) {
        window.refreshPipeline();
      }
      
      if (window.updatePipelineState) {
        window.updatePipelineState(this.deals);
      }
    }

    // Notify CRM when local changes happen
    onDealUpdated(deal) {
      this.sendToCRM('DEAL_UPDATED', deal);
    }

    onDealCreated(deal) {
      this.sendToCRM('DEAL_CREATED', deal);
    }

    onDealDeleted(dealId) {
      this.sendToCRM('DEAL_DELETED', { id: dealId });
    }

    onDealMoved(dealId, oldStage, newStage, position) {
      this.sendToCRM('DEAL_STAGE_CHANGED', {
        dealId,
        oldStage,
        newStage,
        position
      });
    }

    // Navigation helpers
    navigateToCRM(route) {
      this.sendToCRM('NAVIGATE', { route });
    }

    // Utility methods
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }

    sendPipelineDataToCRM() {
      this.sendToCRM('PIPELINE_DATA_RESPONSE', {
        deals: this.deals,
        stages: this.stages,
        statistics: {
          totalValue: this.deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
          activeDeals: this.deals.filter(deal => !deal.stage.includes('closed')).length,
          totalDeals: this.deals.length
        }
      });
    }
  }

  // Initialize the bridge
  const crmBridge = new CRMPipelineBridge();
  
  // Make bridge available globally for your app to use
  window.crmBridge = crmBridge;
  
  // Example: Listen for your app's events and sync with CRM
  window.addEventListener('crmDataUpdated', (event) => {
    console.log('📊 Pipeline data updated:', event.detail);
    // Your app logic here
  });

  console.log('✅ CRM Pipeline Bridge ready');
})();

// Usage Examples for Your Pipeline App:

/*
// 1. When a deal is updated in your pipeline:
window.crmBridge.onDealUpdated({
  id: 'deal-123',
  title: 'Updated Deal Title',
  value: 50000,
  stage: 'negotiation'
});

// 2. When a deal is created:
window.crmBridge.onDealCreated({
  id: 'new-deal-456',
  title: 'New Deal',
  value: 25000,
  stage: 'prospect',
  contactId: 'contact-789'
});

// 3. When a deal is moved between stages:
window.crmBridge.onDealMoved('deal-123', 'proposal', 'negotiation', 0);

// 4. When a deal is deleted:
window.crmBridge.onDealDeleted('deal-123');

// 5. Navigate back to CRM:
window.crmBridge.navigateToCRM('/dashboard');
window.crmBridge.navigateToCRM('/contacts');
window.crmBridge.navigateToCRM('/analytics');

// 6. Access synced data:
console.log('Current deals:', window.crmBridge.deals);
console.log('Pipeline stages:', window.crmBridge.stages);
*/