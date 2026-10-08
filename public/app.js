document.addEventListener('DOMContentLoaded', () => {
  // Node.js API Form
  const form = document.getElementById('api-form');
  const input = document.getElementById('user-name');
  const output = document.getElementById('json-output');
  const statusBadge = document.getElementById('response-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    const url = `/api/hello${name ? `?name=${encodeURIComponent(name)}` : ''}`;

    statusBadge.textContent = 'Fetching...';
    statusBadge.className = 'status-badge idle';
    output.textContent = '// Sending request to ' + url + '...';

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      statusBadge.textContent = `HTTP ${res.status}`;
      statusBadge.className = res.ok ? 'status-badge success' : 'status-badge error';
      output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      statusBadge.textContent = 'Error';
      statusBadge.className = 'status-badge error';
      output.textContent = JSON.stringify({ error: err.message }, null, 2);
    }
  });

  // Python FastAPI AI Form
  const aiForm = document.getElementById('ai-form');
  const aiInput = document.getElementById('ai-input');
  const aiOutput = document.getElementById('ai-json-output');
  const aiStatusBadge = document.getElementById('ai-response-status');

  aiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textData = aiInput.value.trim();
    const url = `/api/proses_ai${textData ? `?input=${encodeURIComponent(textData)}` : ''}`;

    aiStatusBadge.textContent = 'Processing...';
    aiStatusBadge.className = 'status-badge idle';
    aiOutput.textContent = '// Sending request to FastAPI: ' + url + '...';

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      aiStatusBadge.textContent = `HTTP ${res.status}`;
      aiStatusBadge.className = res.ok ? 'status-badge success' : 'status-badge error';
      aiOutput.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      aiStatusBadge.textContent = 'Error';
      aiStatusBadge.className = 'status-badge error';
      aiOutput.textContent = JSON.stringify({ error: err.message }, null, 2);
    }
  });
});
