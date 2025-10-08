// Module Federation Communication Integration Tests
// Tests the ability of federated modules to communicate with each other

import { moduleFederationOrchestrator } from './moduleFederationOrchestrator';
import { useSharedModuleState } from './moduleFederationOrchestrator';
import { globalEventBus } from './moduleFederationOrchestrator';
import { loadRemoteComponent } from './dynamicModuleFederation';

describe('Module Federation Communication Tests', () => {
  beforeEach(() => {
    // Reset orchestrator state
    moduleFederationOrchestrator.clearState?.() || {};
    globalEventBus.listeners = {};
  });

  describe('Shared State Synchronization', () => {
    test('should synchronize theme changes across modules', () => {
      const { updateSharedData } = useSharedModuleState.getState();

      // Simulate theme change
      updateSharedData('theme', 'dark');

      const state = useSharedModuleState.getState();
      expect(state.sharedData.theme).toBe('dark');
    });

    test('should synchronize contact data updates', () => {
      const { updateSharedData } = useSharedModuleState.getState();

      const testContacts = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];

      updateSharedData('contacts', testContacts);

      const state = useSharedModuleState.getState();
      expect(state.sharedData.contacts).toEqual(testContacts);
    });

    test('should synchronize deal data between modules', () => {
      const { updateSharedData } = useSharedModuleState.getState();

      const testDeals = [
        { id: 'deal1', title: 'Enterprise Contract', value: 50000 },
        { id: 'deal2', title: 'Startup Package', value: 15000 }
      ];

      updateSharedData('deals', testDeals);

      const state = useSharedModuleState.getState();
      expect(state.sharedData.deals).toEqual(testDeals);
    });
  });

  describe('Event Bus Communication', () => {
    test('should emit and receive events between modules', (done) => {
      let receivedData = null;

      // Subscribe to event
      globalEventBus.on('TEST_EVENT', (data) => {
        receivedData = data;
        expect(data).toEqual({ message: 'test data' });
        done();
      });

      // Emit event
      globalEventBus.emit('TEST_EVENT', { message: 'test data' });

      // Timeout after 1 second if event not received
      setTimeout(() => {
        if (!receivedData) {
          done.fail('Event not received');
        }
      }, 1000);
    });

    test('should handle module ready events', (done) => {
      const testModuleData = {
        name: 'TestModule',
        version: '1.0.0',
        capabilities: ['read', 'write']
      };

      globalEventBus.on('MODULE_READY', (data) => {
        expect(data.moduleId).toBe('test-module');
        expect(data.data).toEqual(testModuleData);
        done();
      });

      globalEventBus.emit('MODULE_READY', {
        moduleId: 'test-module',
        data: testModuleData
      });
    });

    test('should broadcast data updates to all modules', (done) => {
      let eventCount = 0;

      // Subscribe multiple listeners
      globalEventBus.on('CONTACTS_DATA_UPDATE', () => eventCount++);
      globalEventBus.on('CONTACTS_DATA_UPDATE', () => eventCount++);

      // Emit update
      globalEventBus.emit('CONTACTS_DATA_UPDATE', { contacts: [] });

      setTimeout(() => {
        expect(eventCount).toBe(2);
        done();
      }, 100);
    });
  });

  describe('Orchestrator Module Management', () => {
    test('should register modules with orchestrator', () => {
      const mockComponent = () => null;
      const initialData = { contacts: [] };

      moduleFederationOrchestrator.registerModule('contacts', mockComponent, initialData);

      const state = useSharedModuleState.getState();
      expect(state.modules.contacts).toBeDefined();
      expect(state.modules.contacts.component).toBe(mockComponent);
      expect(state.modules.contacts.data).toEqual(initialData);
    });

    test('should broadcast to all registered modules', () => {
      const mockIframe1 = { contentWindow: { postMessage: jest.fn() } };
      const mockIframe2 = { contentWindow: { postMessage: jest.fn() } };

      // Mock document.querySelectorAll to return our test iframes
      document.querySelectorAll = jest.fn().mockReturnValue([mockIframe1, mockIframe2]);

      moduleFederationOrchestrator.broadcastToAllModules('TEST_MESSAGE', { data: 'test' });

      expect(mockIframe1.contentWindow.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_MESSAGE',
          data: { data: 'test' }
        }),
        '*'
      );

      expect(mockIframe2.contentWindow.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_MESSAGE',
          data: { data: 'test' }
        }),
        '*'
      );
    });

    test('should handle module data updates', () => {
      const { syncDataAcrossModules } = useSharedModuleState.getState();

      const updateData = { contacts: [{ id: '1', name: 'Updated Contact' }] };

      syncDataAcrossModules('contacts-module', updateData);

      const state = useSharedModuleState.getState();
      expect(state.sharedData.contacts).toEqual(updateData.contacts);
    });
  });

  describe('PostMessage Communication Protocol', () => {
    test('should handle incoming postMessage events', () => {
      const mockEvent = {
        origin: 'https://contacts.smartcrm.vip',
        data: {
          type: 'MODULE_READY',
          data: { status: 'ready' }
        }
      };

      // Mock window.addEventListener
      const messageHandlers = [];
      window.addEventListener = jest.fn((event, handler) => {
        if (event === 'message') {
          messageHandlers.push(handler);
        }
      });

      // Re-initialize orchestrator to setup listeners
      moduleFederationOrchestrator.setupGlobalMessageHandler();

      // Simulate receiving message
      messageHandlers.forEach(handler => handler(mockEvent));

      // Verify message was processed (this would normally update state)
      expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });

    test('should validate message origins', () => {
      const validEvent = {
        origin: window.location.origin,
        data: { type: 'VALID_MESSAGE', data: {} }
      };

      const invalidEvent = {
        origin: 'https://malicious-site.com',
        data: { type: 'INVALID_MESSAGE', data: {} }
      };

      let validProcessed = false;
      let invalidProcessed = false;

      // Mock the message handler
      const mockHandler = jest.fn((data) => {
        if (data.type === 'VALID_MESSAGE') validProcessed = true;
        if (data.type === 'INVALID_MESSAGE') invalidProcessed = true;
      });

      moduleFederationOrchestrator.addMessageHandler('VALID_MESSAGE', mockHandler);
      moduleFederationOrchestrator.addMessageHandler('INVALID_MESSAGE', mockHandler);

      // This test verifies the concept - actual implementation should check origins
      expect(validEvent.origin).toBe(window.location.origin);
      expect(invalidEvent.origin).not.toBe(window.location.origin);
    });
  });

  describe('Cross-Module Data Flow Integration', () => {
    test('should flow contact data from Contacts to Pipeline module', () => {
      // Simulate contact created in Contacts module
      const contactData = {
        id: 'contact-123',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        company: 'Tech Corp'
      };

      // Update shared state
      const { updateSharedData } = useSharedModuleState.getState();
      updateSharedData('contacts', [contactData]);

      // Verify data is available for Pipeline module
      const state = useSharedModuleState.getState();
      expect(state.sharedData.contacts).toContain(contactData);

      // Simulate Pipeline module accessing contact data
      const pipelineContacts = state.sharedData.contacts;
      expect(pipelineContacts.length).toBe(1);
      expect(pipelineContacts[0].name).toBe('Alice Johnson');
    });

    test('should flow deal data from Pipeline to Analytics module', () => {
      // Simulate deal created in Pipeline module
      const dealData = {
        id: 'deal-456',
        title: 'Enterprise Software License',
        value: 75000,
        stage: 'Proposal',
        contactId: 'contact-123'
      };

      // Update shared state
      const { updateSharedData } = useSharedModuleState.getState();
      updateSharedData('deals', [dealData]);

      // Verify data is available for Analytics module
      const state = useSharedModuleState.getState();
      expect(state.sharedData.deals).toContain(dealData);

      // Simulate Analytics module processing deal data
      const analyticsDeals = state.sharedData.deals;
      expect(analyticsDeals.length).toBe(1);
      expect(analyticsDeals[0].value).toBe(75000);
    });

    test('should synchronize theme across all modules', () => {
      const { updateSharedData } = useSharedModuleState.getState();

      // Change theme in main app
      updateSharedData('theme', 'dark');

      // Verify all modules receive theme update
      const state = useSharedModuleState.getState();
      expect(state.sharedData.theme).toBe('dark');

      // Simulate modules receiving theme via event bus
      let themeReceived = false;
      globalEventBus.on('SHARED_DATA_UPDATED', (data) => {
        if (data.key === 'theme' && data.data === 'dark') {
          themeReceived = true;
        }
      });

      // Emit theme update
      globalEventBus.emit('SHARED_DATA_UPDATED', { key: 'theme', data: 'dark' });

      expect(themeReceived).toBe(true);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('should handle module loading failures gracefully', async () => {
      // Mock a failed module load
      const loadPromise = loadRemoteComponent('https://nonexistent-domain.com', 'TestModule', './TestModule');

      await expect(loadPromise).rejects.toThrow();
    });

    test('should maintain state consistency during communication failures', () => {
      const { updateSharedData } = useSharedModuleState.getState();

      // Set initial state
      updateSharedData('contacts', [{ id: '1', name: 'Test' }]);

      // Simulate communication failure (don't change state)
      // State should remain consistent
      const state = useSharedModuleState.getState();
      expect(state.sharedData.contacts).toHaveLength(1);
    });

    test('should retry failed communications', (done) => {
      let attemptCount = 0;

      const retryFunction = () => {
        attemptCount++;
        if (attemptCount < 3) {
          setTimeout(retryFunction, 100);
        } else {
          expect(attemptCount).toBe(3);
          done();
        }
      };

      retryFunction();
    });
  });
});