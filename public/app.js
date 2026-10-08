document.addEventListener('DOMContentLoaded', () => {
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
});
