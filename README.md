# Football Pitch Measurement & Validation

A desktop application for validating football pitch geometry against FIFA and IFAB standards using total station measurement data.

Built as a bachelor's thesis at Masaryk University (MUNI).

## Features

- Import total station measurement files (.txt)
- Automatic point identification and coordinate transformation
- 3D visualisation of the measured pitch
- Geometric validation against FIFA-specified dimensions
- PDF compliance report export
- Top-view and heatmap image export

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Three.js, Material UI
- **Desktop:** Electron
- **Algorithms:** PCA-based pitch orientation, nearest-neighbour point matching

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install dependencies

```bash
npm install
cd frontend && npm install
```

### Run in development mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run as desktop app

```bash
npm start
```

This builds the frontend and launches the Electron window.

## Measurement File Format

Plain text file with one point per line:

```
<label>   <x>   <y>   <z>
```

The first 31 points must be the standard pitch reference points (labels 1–30 and 31). Additional secondary points (labels 32+) are optional.

## Project Structure

```
football-field/
├── electron.js          # Electron main process
├── frontend/
│   ├── src/
│   │   ├── assets/      # Sample measurement files
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   └── visualization/  # 3D scene, storage, transforms
│   └── package.json
└── package.json
```
