// Helper script to create a GitHub repository using GitHub REST API
import https from 'https';

const repoName = process.argv[2] || 'lol-mate';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN process environment variable is not defined.');
  console.log('Use: set GITHUB_TOKEN=your_personal_access_token && node scripts/create-github-repo.js');
  process.exit(1);
}

const data = JSON.stringify({
  name: repoName,
  description: 'RiftCoach AI - Real-Time LoL Companion & Gemini AI Coach',
  private: false,
  auto_init: false
});

const options = {
  hostname: 'api.github.com',
  path: '/user/repos',
  method: 'POST',
  headers: {
    'User-Agent': 'NodeJS-RiftCoach-App',
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const repo = JSON.parse(body);
      console.log(`✅ Repositorio creado exitosamente en GitHub!`);
      console.log(`URL: ${repo.html_url}`);
      console.log(`Clone URL: ${repo.clone_url}`);
    } else {
      console.error(`Error creando repositorio (${res.statusCode}):`, body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error en la petición HTTPS:', e);
});

req.write(data);
req.end();
