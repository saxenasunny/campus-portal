const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist!');
  process.exit(1);
}

const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
console.log('[OK] index.html exists, size:', html.length, 'bytes');
console.log('[OK] root div container found:', html.includes('id="root"'));

const assets = fs.readdirSync(path.join(distDir, 'assets'));
console.log('[OK] Total asset chunks created:', assets.length);

const expectedModules = [
  'TenantLoginPage',
  'StudentDashboard',
  'FacultyDashboard',
  'HODDashboard',
  'RegistrarDashboard',
  'AdminDashboard',
  'PlacementDashboard',
  'EmployerDashboard',
  'AccreditationDashboard',
  'NHEQFDashboard',
  'NAACADashboard',
  'NBAInsightsPage',
  'NIRFExportPage',
  'IIQACheckPage',
  'DVVCheckPage',
  'POAttainmentPage',
  'COAttainmentPage',
  'CLOManagementPage',
  'LibraryPage',
  'HostelPage',
  'TransportPage',
  'ProfilePage',
  'SettingsPage'
];

let allFound = true;
for (const mod of expectedModules) {
  const match = assets.find(a => a.startsWith(mod));
  if (match) {
    console.log(`  [PASS] ${mod.padEnd(25)} -> ${match}`);
  } else {
    console.error(`  [FAIL] Missing module chunk: ${mod}`);
    allFound = false;
  }
}

if (allFound) {
  console.log('\n[SUCCESS] All 23 core modules and dashboards verified in distribution bundle!');
} else {
  console.error('\n[ERROR] One or more module chunks were missing.');
  process.exit(1);
}
