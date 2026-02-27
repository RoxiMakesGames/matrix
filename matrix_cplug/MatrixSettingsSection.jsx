// ---------------------------------------------------------------------------
// Matrix Settings Section — contributed to settings framework via hook_settings.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { useKernel } from '../../cms/kernel/providers.jsx';
import { Toggle, Field, SettingsShell } from '../../cms/components/index.js';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';

export function MatrixSettingsSection() {
  const { getService } = useKernel();
  const storage = getService('storage');
  const matrix = getService('matrix');
  const [saved, setSaved] = useState(false);

  const [config, setConfig] = useState(() => ({
    homeserver: storage?.get('settings.matrix_homeserver') || '',
    autoSync:   storage?.get('settings.matrix_auto_sync') ?? true,
  }));

  const update = (k, v) => setConfig(prev => ({ ...prev, [k]: v }));
  const connected = matrix?.isConnected?.() || false;

  const handleSave = () => {
    storage?.set('settings.matrix_homeserver', config.homeserver);
    storage?.set('settings.matrix_auto_sync', config.autoSync);

    if (config.homeserver && matrix) {
      try { matrix.configure(config.homeserver); } catch {}
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsShell
      pluginId="matrix"
      serviceId="matrix"
      title="Matrix"
      icon={MessageCircle}
      iconColor="text-blue-400"
      badge={{ label: connected ? 'Connected' : 'Disconnected', color: connected ? 'emerald' : 'slate' }}
      onSave={handleSave}
      saved={saved}
      routingDefaults={{ defaultSubdomain: 'matrix', defaultPort: 8008 }}
    >
      <div className="space-y-5">
        <Field label="Homeserver URL" value={config.homeserver} onChange={v => update('homeserver', v)}
          placeholder="https://matrix.opensovereign.dev" />
        <Toggle card label="Auto-sync Users" desc="Provision Matrix accounts when Citadel users are created"
          value={config.autoSync} onChange={v => update('autoSync', v)} />

        <div className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3">
          Matrix uses Citadel identity. Users synced via <code className="text-emerald-400">hook_user_sync</code>.
        </div>
      </div>
    </SettingsShell>
  );
}
