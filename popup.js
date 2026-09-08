// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

function setInput(id, val) {
  document.getElementById(id).value = val;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

// Hook Generation Engine
const hookTemplates = {
  patterns: [
    { type: 'contrarian', templates: [
      "Everyone says {topic} is dead. They're wrong.\n\nHere's why:",
      "Unpopular opinion: {topic}\n\nNot the take you expected:",
      "I used to believe {topic}.\n\nThen I learned the hard way:",
      "Stop saying {topic}.\n\nHere's what actually works:",
    ]},
    { type: 'story', templates: [
      "I worked on {topic}.\n\nHere's what I wish I knew on day 1:",
      "A practical path from zero to {topic}.\n\nUse this playbook:",
      "How {topic} changed after consistent work.\n\nHere's the breakdown:",
    ]},
    { type: 'list', templates: [
      "{topic} in 2026:\n\n{facts}\n\nThread below 👇",
      "7 things about {topic} nobody talks about:\n\n{facts}\n\nSave this.",
    ]},
    { type: 'question', templates: [
      "What's the hardest part about {topic}?\n\nFor me it was:",
      "If you're struggling with {topic}, read this.",
    ]},
  ],
  facts: [
    "Most people skip the foundation",
    "The 80/20 rule applies harder here than anywhere",
    "I tested 12 approaches before finding one that worked",
    "The industry doesn't want you to know this",
    "Beginners consistently overestimate what they can do in 1 year",
    "The tools don't matter as much as the system",
  ]
};

function generateHooks() {
  const input = document.getElementById('hook-input').value.trim();
  if (!input) { showToast('Enter a topic first!'); return; }

  const output = document.getElementById('hook-output');
  const results = document.getElementById('hook-results');
  output.classList.add('show');
  results.innerHTML = '<div class="loading">Generating</div>';

  setTimeout(() => {
    const topic = input;
    const shuffled = [...hookTemplates.facts].sort(() => Math.random() - 0.5);
    const templates = hookTemplates.patterns.flatMap(p => p.templates);
    const shuffledTemplates = templates.sort(() => Math.random() - 0.5);
    const selectedFacts = shuffled.slice(0, 3).join('\n• ');

    const hooks = [];
    for (let i = 0; i < 6; i++) {
      const tpl = shuffledTemplates[i % shuffledTemplates.length];
      let hook = tpl
        .replace(/{topic}/g, topic)
        .replace(/{facts}/g, selectedFacts);
      hooks.push(hook);
    }

    results.innerHTML = hooks.map((h, i) => `
      <div class="hook-item" onclick="copyHook(this, ${i})">
        <span class="hook-num">${String(i+1).padStart(2,'0')}</span>
        <span class="hook-type">framework</span>
        <span class="copy-btn" onclick="event.stopPropagation(); copyHook(this.parentElement, ${i})">📋 copy</span>
        <div style="margin-top:4px; color:#ccc; white-space:pre-wrap;">${h}</div>
      </div>
    `).join('');
  }, 800);
}

function copyHook(el, idx) {
  const text = el.querySelector('div').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
}

// LinkedIn Post Generator
let liTone = 'professional';
function setLiTone(t) {
  liTone = t;
  document.querySelectorAll('#panel-linkedin .btn-secondary').forEach(b => b.style.background = '#2a2a4a');
  event.target.style.background = '#667eea';
}

function generateLinkedIn() {
  const input = document.getElementById('li-input').value.trim();
  if (!input) { showToast('Enter a topic!'); return; }

  const output = document.getElementById('li-output');
  const results = document.getElementById('li-results');
  output.classList.add('show');
  results.innerHTML = '<div class="loading">Writing</div>';

  setTimeout(() => {
    const tones = {
      professional: {
        opener: [
          `I'm excited to share my latest progress on ${input}.`,
          `Reflecting on my journey with ${input}, I've learned some valuable lessons.`,
          `After months of work, I can finally share my thoughts on ${input}.`,
        ],
        structure: `Here's what I discovered:\n\n• [Key insight 1]\n• [Key insight 2]\n• [Key insight 3]\n\nThe biggest takeaway: [conclusion]\n\nI'd love to hear your perspective on this. What's your experience with ${input}?\n\n#${input.replace(/\s/g, '')} #ProfessionalDevelopment #Growth`,
      },
      conversational: {
        opener: [
          `Let's talk about ${input}.`,
          `Quick story time about ${input}...`,
          `I have a confession about ${input}.`,
        ],
        structure: `So here's the thing:\n\n${input} is not what most people think.\n\nAfter going through it myself, here's what I learned:\n\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]\n\nDrop a comment if this resonated with you 👇\n\n#${input.replace(/\s/g, '')}`,
      },
      controversial: {
        opener: [
          `I'm going to say something controversial about ${input}.`,
          `Hot take: ${input} is overrated. Here's why.`,
          `Unpopular opinion about ${input} that might make some people mad:`,
        ],
        structure: `Most people think ${input} is about [common belief].\n\nBut the reality is much more nuanced.\n\nHere's the uncomfortable truth:\n\n• [Counterpoint 1]\n• [Counterpoint 2]\n• [Counterpoint 3]\n\nAm I wrong? Let me know in the comments.\n\n#${input.replace(/\s/g, '')}`,
      }
    };

    const t = tones[liTone];
    const opener = t.opener[Math.floor(Math.random() * t.opener.length)];
    const content = t.structure
      .replace(/\[Key insight \d+\]/g, `Insight about ${input}`)
      .replace(/\[Lesson \d+\]/g, `Key lesson from my experience`);

    results.innerHTML = `
      <div style="font-size:12px; line-height:1.7; color:#ddd; white-space:pre-wrap;">${opener}\n\n${content}</div>
      <button class="btn btn-secondary" style="margin-top:8px;" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('div').textContent); showToast('Copied!')">📋 Copy to clipboard</button>
    `;
  }, 800);
}

// Twitter Thread Generator
function generateThread() {
  const input = document.getElementById('thread-input').value.trim();
  if (!input) { showToast('Enter a topic!'); return; }

  const output = document.getElementById('thread-output');
  const results = document.getElementById('thread-results');
  output.classList.add('show');
  results.innerHTML = '<div class="loading">Writing thread</div>';

  setTimeout(() => {
    const thread = [
      { num: 1, type: 'hook', text: `🧵 ${input}\n\nA thread on why this matters more than ever:` },
      { num: 2, type: 'point', text: `1/ Most people approach ${input} completely backwards.\n\nThey start with tactics before understanding the fundamentals.\n\nThat's like building a house on sand.` },
      { num: 3, type: 'point', text: `2/ Here's the framework that actually works:\n\n• Step 1: Understand the landscape\n• Step 2: Find your unique angle\n• Step 3: Execute consistently\n\nSimple in theory. Hard in practice.` },
      { num: 4, type: 'point', text: `3/ The biggest mistake I see:\n\nPeople copy others instead of developing their own voice.\n\nOriginality always wins in the long run.` },
      { num: 5, type: 'point', text: `4/ The uncomfortable truth:\n\n${input} takes longer than you think.\n\nThere are no shortcuts. Just consistent, deliberate practice over months (not days).` },
      { num: 6, type: 'point', text: `5/ What I wish I knew earlier:\n\n• Start before you feel ready\n• Ship imperfect work\n\nThe best time to start was yesterday.\nThe second best time is now.` },
      { num: 7, type: 'close', text: `That's the thread.\n\nIf you found this helpful:\n🔄 Repost to help others\n❤️ Like if it resonated\n💬 Comment your biggest takeaway` },
    ];

    results.innerHTML = thread.map(t => `
      <div class="hook-item" onclick="copyHook(this, 0)" style="cursor:text;">
        <span class="hook-num">${t.num}</span>
        <span class="hook-type">${t.type}</span>
        <span class="copy-btn" onclick="event.stopPropagation(); navigator.clipboard.writeText(this.parentElement.innerText); showToast('Copied!')">📋 copy</span>
        <div style="margin-top:4px; color:#ccc; white-space:pre-wrap;">${t.text}</div>
      </div>
    `).join('');
  }, 1000);
}

// Local Content Checker — analyzes only the text the user provides
function analyzeSEO() {
  const input = document.getElementById('seo-input').value.trim();
  if (!input) { showToast('Paste some content first!'); return; }

  const output = document.getElementById('seo-output');
  const words = input.match(/[\p{L}\p{N}'’-]+/gu) || [];
  const sentences = input.split(/[.!?。！？]+/).filter(s => s.trim());
  const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim());
  const links = (input.match(/https?:\/\/\S+|\[[^\]]+\]\([^)]+\)/g) || []).length;
  const avgSentence = sentences.length ? Math.round(words.length / sentences.length) : words.length;
  const longSentences = sentences.filter(s => (s.match(/[\p{L}\p{N}'’-]+/gu) || []).length > 25).length;
  const headings = input.split('\n').filter(l => /^#{1,6}\s|^[A-Z][A-Z\s\d:—-]{5,}$/.test(l.trim())).length;
  const freq = {};
  words.map(w => w.toLowerCase()).filter(w => w.length > 4).forEach(w => freq[w] = (freq[w] || 0) + 1);
  const repeated = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5);
  let score = 100;
  if (words.length < 100) score -= 20;
  if (avgSentence > 25) score -= 15;
  if (paragraphs.length < 2) score -= 10;
  if (!headings) score -= 10;
  if (!links) score -= 5;
  score = Math.max(0, score);
  const checks = [
    { pass: words.length >= 100, text: `Length: ${words.length} words${words.length < 100 ? ' — consider adding detail' : ''}` },
    { pass: avgSentence <= 25, text: `Average sentence: ${avgSentence} words` },
    { pass: longSentences === 0, text: `${longSentences} sentence(s) over 25 words` },
    { pass: paragraphs.length >= 2, text: `${paragraphs.length} paragraph(s)` },
    { pass: headings > 0, text: `${headings} heading(s) detected` },
    { pass: links > 0, text: `${links} link(s) detected` }
  ];
  output.style.display = 'block';
  output.innerHTML = `
    <div class="seo-score"><div class="seo-score-num" style="color:${score >= 70 ? '#4ade80' : '#fbbf24'}">${score}</div>
      <div><div style="font-size:13px;font-weight:600">Content score</div><div class="seo-score-label">Local heuristic, not a search-ranking guarantee</div></div></div>
    <div class="section-title">Measured results</div>
    ${checks.map(c => `<div class="seo-check ${c.pass ? 'pass' : 'warn'}">${c.pass ? '✅' : '⚠️'} ${c.text}</div>`).join('')}
    <hr class="separator"><div class="section-title">Most repeated words</div>
    <div style="font-size:11px;color:#aaa">${repeated.length ? repeated.map(([w,n]) => `${w} (${n})`).join(' · ') : 'Not enough text'}</div>
    <button class="btn btn-secondary" onclick="navigator.clipboard.writeText(this.parentElement.innerText); showToast('Copied!')">📋 Copy Report</button>`;
}
