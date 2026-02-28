# Matrix Chat

> Federated messaging with Citadel identity integration via hook_user_sync

| | |
|---|---|
| **Version** | 1.0.0 |
| **Type** | Sovereign Package |
| **Plugin** | ✅ Panel UI |
| **K8s** | ✅ Kustomize |
| **Docker** | ✅ Compose fragment |

## Install

```bash
# Via sovctl (preferred)
sovctl package install matrix

# Manual — Kubernetes
kubectl apply -k infra/

# Manual — Docker Compose
docker compose -f docker-compose.yaml -f packages/matrix/docker/compose.yaml up -d
```

## Contents

```
matrix/
├── sovpak.json     # Package manifest
├── README.md
├── plugin/                    # Panel UI plugin
│   ├── index.js
│   └── *.jsx
├── infra/                       # Kubernetes manifests
│   ├── kustomization.yaml
│   └── *.yaml
├── docker/                    # Docker Compose fragment
│   └── compose.yaml
└── config/                    # Default configuration
```

## Package Standard

This package follows the [Sovereign Package Manifest Specification](../../specs/PACKAGE_MANIFEST.md).

All deployment manifests are bundled — no external pulls needed at install time.
