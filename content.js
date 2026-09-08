// Content script - detects social media platforms and shows AI tools
(function() {
  const site = window.location.hostname;
  let injected = false;

  function injectPanel() {
    if (injected) return;
    injected = true;

    const panel = document.createElement('div');
    panel.id = 'ai-content-panel';
    panel.style.cssText = `
      position: fixed; bottom: 80px; right: 20px; z-index: 2147483647;
      background: #0f0f1a; border: 1px solid #2a2a4a; border-radius: 12px;
      padding: 12px; width: 280px; font-family: -apple-system, sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;

    const siteName = site.includes('twitter.com') || site.includes('x.com') ? 'Twitter/X' :
                     site.includes('linkedin.com') ? 'LinkedIn' :
                     site.includes('reddit.com') ? 'Reddit' : 'Web';

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:12px;font-weight:700;color:#667eea;">🤖 AI Toolkit</span>
        <span style="font-size:9px;background:#667eea;color:#fff;padding:1px 5px;border-radius:3px;font-weight:700;">${siteName}</span>
      </div>
      <button id="ai-gen-btn" style="width:100%;padding:8px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
        ✨ Generate Content
      </button>
      <div id="ai-result" style="margin-top:8px;font-size:11px;color:#ccc;display:none;max-height:150px;overflow-y:auto;line-height:1.5;white-space:pre-wrap;"></div>
    `;

    document.body.appendChild(panel);

    document.getElementById('ai-gen-btn').addEventListener('click', () => {
      const result = document.getElementById('ai-result');
      result.style.display = 'block';
      result.textContent = 'Generating...';

      setTimeout(() => {
        const prompts = site.includes('twitter') || site.includes('x.com')
          ? `🧵 Thread idea:\n\n"${result.textContent}"\n\nHere's a hook:\n\n"Everyone gets ${result.textContent} wrong.\n\nA thread 👇"`
          : site.includes('linkedin')
          ? `💼 LinkedIn post:\n\nReflecting on ${result.textContent}:\n\n• Insight 1\n• Insight 2\n• Insight 3\n\nWhat's your take?`
          : `✍️ Content idea for "${result.textContent}":\n\nHook: "The truth about ${result.textContent} nobody tells you"\n\nStructure:\n1. Problem\n2. Solution\n3. CTA`;

        result.textContent = prompts;
      }, 600);
    });
  }

  // Auto-inject on relevant pages
  if (site.includes('twitter.com') || site.includes('x.com') ||
      site.includes('linkedin.com') || site.includes('reddit.com')) {
    setTimeout(injectPanel, 1000);
  }
})();
