// Network connectivity test utility for remote apps
export class NetworkConnectivityTest {
  private static instance: NetworkConnectivityTest;
  private testResults = new Map<string, { accessible: boolean; lastTest: number; error?: string }>();

  static getInstance(): NetworkConnectivityTest {
    if (!NetworkConnectivityTest.instance) {
      NetworkConnectivityTest.instance = new NetworkConnectivityTest();
    }
    return NetworkConnectivityTest.instance;
  }

  async testRemoteApp(url: string): Promise<{ accessible: boolean; error?: string }> {
    console.log(`🌐 DEBUG: Testing connectivity to remote app: ${url}`);

    try {
      // Test multiple endpoints for the remote app
      const testUrls = [
        `${url}/remoteEntry.js`,
        `${url}/assets/remoteEntry.js`,
        `${url}/static/js/remoteEntry.js`,
        url // Try the base URL as well
      ];

      for (const testUrl of testUrls) {
        console.log(`🔍 DEBUG: Testing URL: ${testUrl}`);

        try {
          const response = await fetch(testUrl, {
            method: 'HEAD',
            mode: 'no-cors', // Allow cross-origin requests
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            },
            // Set a reasonable timeout
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });

          console.log(`✅ DEBUG: Successfully reached ${testUrl} (status: ${response.status || 'opaque'})`);

          // Store successful result
          this.testResults.set(url, {
            accessible: true,
            lastTest: Date.now()
          });

          return { accessible: true };

        } catch (urlError) {
          console.warn(`❌ DEBUG: Failed to reach ${testUrl}:`, urlError);
          // Continue to next URL
        }
      }

      // All URLs failed
      const error = `All test URLs failed for ${url}`;
      console.error(`❌ DEBUG: ${error}`);

      this.testResults.set(url, {
        accessible: false,
        lastTest: Date.now(),
        error
      });

      return { accessible: false, error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
      console.error(`❌ DEBUG: Network test failed for ${url}:`, errorMessage);

      this.testResults.set(url, {
        accessible: false,
        lastTest: Date.now(),
        error: errorMessage
      });

      return { accessible: false, error: errorMessage };
    }
  }

  async testAllRemoteApps(urls: string[]): Promise<Map<string, { accessible: boolean; error?: string }>> {
    console.log(`🌐 DEBUG: Testing connectivity to ${urls.length} remote apps`);

    const results = new Map<string, { accessible: boolean; error?: string }>();

    // Test all apps concurrently but limit concurrency to avoid overwhelming
    const concurrencyLimit = 3;
    for (let i = 0; i < urls.length; i += concurrencyLimit) {
      const batch = urls.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(url => this.testRemoteApp(url));

      const batchResults = await Promise.all(batchPromises);

      batch.forEach((url, index) => {
        results.set(url, batchResults[index]);
      });
    }

    console.log(`📊 DEBUG: Connectivity test results:`, Object.fromEntries(results));
    return results;
  }

  getCachedResult(url: string): { accessible: boolean; error?: string } | null {
    const result = this.testResults.get(url);
    if (result && Date.now() - result.lastTest < 300000) { // 5 minutes cache
      return { accessible: result.accessible, error: result.error };
    }
    return null;
  }

  clearCache(): void {
    this.testResults.clear();
  }
}

export const networkTest = NetworkConnectivityTest.getInstance();