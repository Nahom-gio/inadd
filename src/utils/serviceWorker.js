// Service Worker registration and management utility

let swRegistration = null;

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', swRegistration);

      // Handle service worker updates
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Service Worker updated');
        }
      });

      // Handle service worker errors
      navigator.serviceWorker.addEventListener('error', error => {
        console.error('Service Worker error:', error);
      });

      return swRegistration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  } else {
    console.log('Service Worker not supported');
    return null;
  }
};

// Unregister service worker
export const unregisterServiceWorker = async () => {
  if (swRegistration) {
    try {
      await swRegistration.unregister();
      console.log('Service Worker unregistered');
      return true;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }
  return false;
};

// Check if service worker is registered
export const isServiceWorkerRegistered = () => {
  return swRegistration !== null;
};

// Get service worker registration
export const getServiceWorkerRegistration = () => {
  return swRegistration;
};

// Update service worker
export const updateServiceWorker = async () => {
  if (swRegistration) {
    try {
      await swRegistration.update();
      console.log('Service Worker update requested');
      return true;
    } catch (error) {
      console.error('Service Worker update failed:', error);
      return false;
    }
  }
  return false;
};

// Skip waiting for service worker
export const skipWaiting = async () => {
  if (swRegistration && swRegistration.waiting) {
    try {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      console.log('Service Worker skip waiting requested');
      return true;
    } catch (error) {
      console.error('Service Worker skip waiting failed:', error);
      return false;
    }
  }
  return false;
};

// Show update notification
const showUpdateNotification = () => {
  // Check if browser supports notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('INAD PROMOTION Update Available', {
      body: 'A new version is available. Click to update.',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      tag: 'update-available',
      requireInteraction: true,
      actions: [
        {
          action: 'update',
          title: 'Update Now',
        },
        {
          action: 'dismiss',
          title: 'Later',
        },
      ],
    });

    notification.addEventListener('click', event => {
      if (event.action === 'update') {
        updateServiceWorker();
      }
      notification.close();
    });

    notification.addEventListener('close', () => {
      // Auto-update after 5 seconds if not dismissed
      setTimeout(() => {
        updateServiceWorker();
      }, 5000);
    });
  } else {
    // Fallback: show in-page notification
    showInPageUpdateNotification();
  }
};

// Show in-page update notification
const showInPageUpdateNotification = () => {
  // Create update notification element
  const notification = document.createElement('div');
  notification.className =
    'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium">Update Available</p>
        <p class="text-xs text-blue-200 mt-1">A new version is available. Click to update.</p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button class="bg-blue-400 hover:bg-blue-300 rounded-md inline-flex text-white p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    <div class="mt-3 flex space-x-2">
      <button class="bg-blue-400 hover:bg-blue-300 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Update Now
      </button>
      <button class="bg-transparent hover:bg-blue-400 text-blue-200 text-xs px-3 py-1 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Later
      </button>
    </div>
  `;

  // Add event listeners
  const updateButton = notification.querySelector('button:first-of-type');
  const laterButton = notification.querySelector('button:last-of-type');
  const closeButton = notification.querySelector(
    'button.bg-blue-400.hover\\:bg-blue-300'
  );

  updateButton.addEventListener('click', () => {
    updateServiceWorker();
    notification.remove();
  });

  laterButton.addEventListener('click', () => {
    notification.remove();
  });

  closeButton.addEventListener('click', () => {
    notification.remove();
  });

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  }
  return 'unsupported';
};

// Check notification permission
export const getNotificationPermission = () => {
  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'unsupported';
};

// Send message to service worker
export const sendMessageToSW = message => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

// Check if service worker is controlling the page
export const isServiceWorkerControlling = () => {
  return navigator.serviceWorker && navigator.serviceWorker.controller !== null;
};

// Get service worker state
export const getServiceWorkerState = () => {
  if (swRegistration) {
    return {
      installing: swRegistration.installing?.state || null,
      waiting: swRegistration.waiting?.state || null,
      active: swRegistration.active?.state || null,
      controlling: isServiceWorkerControlling(),
    };
  }
  return null;
};

// Export default registration function
export default registerServiceWorker;
