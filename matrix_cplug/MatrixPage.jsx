// ---------------------------------------------------------------------------
// Matrix Page — Matrix homeserver configuration and room management.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { useKernel } from '../../cms/kernel/providers.jsx';
import { MessageCircle, Settings, Wifi, WifiOff, Plus, Hash, Users, Globe } from 'lucide-react';

export function MatrixPage() {
  const { getService } = useKernel();
  const matrix = getService('matrix');

  const [homeserver, setHomeserver] = useState(matrix?.getHomeserver?.() || '');
  const [saved, setSaved] = useState(false);
  const connected = matrix?.isConnected?.() || false;

  const handleSave = () => {
    if (!homeserver) return;
    try {
      matrix?.configure?.(homeserver);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-400" /> Matrix
        </h1>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
          connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'
        }`}>
          {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500">
          Matrix provides federated real-time communication. Configure your homeserver to enable
          encrypted messaging, rooms, and bridges to other platforms.
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" /> Homeserver Configuration
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Homeserver URL</label>
            <input value={homeserver} onChange={e => setHomeserver(e.target.value)}
              placeholder="https://matrix.opensovereign.dev"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <button onClick={handleSave}
            className="self-end px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4">
        <FeatureCard icon={Hash} title="Rooms" desc="Create and manage Matrix rooms" color="blue" />
        <FeatureCard icon={Users} title="Bridges" desc="Connect to Discord, Slack, IRC" color="purple" />
        <FeatureCard icon={Globe} title="Federation" desc="Federate with other homeservers" color="emerald" />
      </div>

      <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-5 text-center">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-slate-700" />
        <p className="text-sm text-slate-500">
          Matrix room management and bridge configuration will be available once a homeserver is connected.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{desc}</div>
    </div>
  );
}
