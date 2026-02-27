// ---------------------------------------------------------------------------
// Matrix Plugin — Matrix communication protocol (core).
//
// IDENTITY INTEGRATION:
//   Matrix does NOT own identity. Users are provisioned from the Citadel
//   user plugin via hook_user_sync. Matrix accounts are created/updated
//   when users are created or log in.
// ---------------------------------------------------------------------------

import { definePlugin } from '../../cms/kernel/index.js';
import { MessageCircle } from 'lucide-react';
import { MatrixPage } from './MatrixPage.jsx';
import { MatrixSettingsSection } from './MatrixSettingsSection.jsx';

export default definePlugin({
  id: 'matrix_cplug',
  name: 'Matrix',
  type: 'core',
  required: true,
  version: '0.6.0',
  description: 'Matrix protocol — federated messaging with Citadel identity integration via hook_user_sync.',
  icon: MessageCircle,
  category: 'Core',
  tags: ['core-required', 'communication', 'federation', 'chat'],
  requires: ['system_cplug', 'user_cplug', 'auth_cplug'],

  routes: [
    { path: '/communication/matrix', component: MatrixPage, label: 'Matrix', permission: 'admin.config' },
  ],

  menuItems: [
    { id: 'matrix', to: '/communication/matrix', icon: MessageCircle, label: 'Matrix', section: 'communication', order: 0, permission: 'admin.config' },
  ],

  extensionPoints: {
    'matrix:bridges':     'Matrix bridge plugins (Discord, Slack, IRC, etc.)',
    'matrix:bots':        'Matrix bot integrations',
    'matrix:widgets':     'Matrix widget definitions',
  },

  hooks: {
    hook_init({ registerService, getService }) {
      const permission = getService('permission_cplug');

      registerService('matrix', {
        _homeserver: null,
        _connected: false,
        _identityMaps: new Map(),

        configure(homeserver) {
          if (!permission.hasPermission('matrix.admin')) {
            throw new Error('Permission denied: matrix.admin required');
          }
          this._homeserver = homeserver;
        },

        isConnected() { return this._connected; },
        getHomeserver() { return this._homeserver; },

        /**
         * Sync a Citadel user to Matrix — create/update Synapse account.
         */
        async syncUser(user) {
          if (!this._homeserver) return { status: 'skipped', reason: 'No homeserver configured' };
          const map = {
            citadel_user_id: user.id,
            matrix_user_id: `@${user.name}:${new URL(this._homeserver).hostname}`,
            synced_at: new Date().toISOString(),
            status: 'active',
          };
          this._identityMaps.set(`user:${user.id}`, map);
          return map;
        },

        getIdentityMaps() { return [...this._identityMaps.values()]; },
      });
    },

    hook_permission() {
      return [
        { id: 'matrix.admin', label: 'Administer Matrix', module: 'matrix' },
        { id: 'matrix.rooms', label: 'Manage rooms', module: 'matrix' },
        { id: 'matrix.bridges', label: 'Manage bridges', module: 'matrix' },
        { id: 'matrix.sync', label: 'Sync users to Matrix', module: 'matrix' },
      ];
    },

    // Contribute Matrix settings to the settings framework
    hook_settings() {
      return {
        id: 'matrix',
        label: 'Matrix',
        icon: MessageCircle,
        weight: 65,
        category: 'Services',
        pluginId: 'matrix_cplug',
        component: MatrixSettingsSection,
      };
    },

    // Contribute Matrix admin section
    hook_admin() {
      return {
        id: 'matrix',
        label: 'Matrix',
        icon: MessageCircle,
        weight: 65,
        pluginId: 'matrix_cplug',
        component: MatrixPage,
      };
    },

    // Respond to user lifecycle events — provision Matrix accounts
    hook_user_sync({ action, user, getService }) {
      const matrix = getService?.('matrix');
      if (!matrix) return;

      if (action === 'create' || action === 'login') {
        try {
          matrix.syncUser(user);
          console.log(`[Matrix] User sync (${action}): ${user.name}`);
        } catch (e) {
          console.warn(`[Matrix] User sync failed for ${user.name}:`, e.message);
        }
      }
    },
  },
});
