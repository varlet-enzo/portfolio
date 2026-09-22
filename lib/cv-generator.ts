export interface CVProject {
  name: string;
  yearFr: string;
  yearEn: string;
  role: string;
  bulletsFr: string[];
  bulletsEn: string[];
  tech: string;
  linkLabel: string;
  linkUrl: string;
}

export interface CVData {
  taglineFr: string;
  taglineEn: string;
  email: string;
  linkedin: string;
  github: string;
  itch: string;
  location: string;
  profilFr: string;
  profilEn: string;
  formationTitleFr: string;
  formationTitleEn: string;
  formationDate: string;
  formationSchool: string;
  benevolaTitleFr: string;
  benevolaTitleEn: string;
  benevolaDateFr: string;
  benevolaDateEn: string;
  benevolaLocation: string;
  benevolaDescFr: string;
  benevolaDescEn: string;
  projects: CVProject[];
  portfolioUrl: string;
  skillsEnginesHtml: string;
  skillsLanguagesHtml: string;
  skillsToolsHtml: string;
  skillsSoftFr: string;
  skillsSoftEn: string;
  interestJVHtml: string;
  interestEscaladeHtml: string;
  interestAnimeHtml: string;
  interestSerieHtml: string;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function attr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function projectHtml(p: CVProject): string {
  const bullets = p.bulletsFr.map((fr, i) => {
    const en = p.bulletsEn[i] ?? fr;
    return `          <li data-fr="${attr(fr)}" data-en="${attr(en)}">${esc(fr)}</li>`;
  }).join("\n");

  return `
      <div class="project">
        <div class="project-header">
          <div class="project-name">${esc(p.name)}</div>
          <div class="project-year" data-fr="${attr(p.yearFr)}" data-en="${attr(p.yearEn)}">${esc(p.yearFr)}</div>
        </div>
        <div class="project-role">${esc(p.role)}</div>
        <ul class="project-bullets">
${bullets}
        </ul>
        <div class="project-footer">
          <span class="project-tech">${esc(p.tech)}</span>
          <a class="project-link" href="${attr(p.linkUrl)}" target="_blank">${esc(p.linkLabel)}</a>
        </div>
      </div>`;
}

export function generateCVHtml(d: CVData): string {
  const projects = d.projects.map(projectHtml).join("\n");

  return `<title>Enzo Varlet</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap">

<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #FFFFFF;
    --text:    #141414;
    --muted:   #686868;
    --accent:  #1C3E32;
    --rule:    #D8D8D8;
    --light:   #F7F7F7;
  }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--rule);
  }
  .ctrl-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 9px;
    border: 1px solid var(--rule);
    background: none;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.12s, border-color 0.12s;
  }
  .ctrl-btn.active, .ctrl-btn:hover { color: var(--accent); border-color: var(--accent); }
  .ctrl-sep { width: 1px; height: 14px; background: var(--rule); margin: 0 2px; }

  .page {
    max-width: 780px;
    margin: 0 auto;
    padding: 32px 44px 36px;
  }

  .cv-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 46px;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--text);
    text-wrap: balance;
  }
  .cv-name em { font-style: normal; color: var(--accent); }
  .cv-tagline {
    margin-top: 10px;
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    letter-spacing: 0.01em;
  }
  .cv-contact {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: var(--muted);
  }
  .cv-contact a { color: var(--muted); text-decoration: none; }
  .cv-contact a:hover { color: var(--accent); }
  .cv-contact .sep { margin: 0 8px; color: var(--rule); }

  .divider { border: none; border-top: 1px solid var(--rule); margin: 14px 0; }
  .divider.thin { margin: 8px 0; }

  .section {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 0 32px;
    margin-bottom: 12px;
  }
  .section:last-child { margin-bottom: 0; }
  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    padding-top: 2px;
    line-height: 1.6;
  }

  .profil { font-size: 12px; font-weight: 400; color: var(--text); line-height: 1.6; }

  .entry { margin-bottom: 6px; }
  .entry:last-child { margin-bottom: 0; }
  .entry-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .entry-title { font-size: 13px; font-weight: 500; color: var(--text); }
  .entry-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
  .entry-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .entry-desc { font-size: 12px; color: var(--muted); margin-top: 3px; line-height: 1.55; }

  .project { margin-bottom: 10px; }
  .project:last-child { margin-bottom: 0; }
  .project-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .project-name { font-size: 13.5px; font-weight: 500; color: var(--text); }
  .project-year { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
  .project-role { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--accent); margin-top: 2px; letter-spacing: 0.02em; }
  .project-bullets { margin: 5px 0 0 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; }
  .project-bullets li { font-size: 12px; color: var(--muted); line-height: 1.55; position: relative; padding-left: 10px; }
  .project-bullets li::before { content: '\\2013'; position: absolute; left: 0; color: var(--accent); font-size: 11px; }
  .project-portfolio-link { display: inline-block; margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.06em; color: var(--accent); text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 1px; }
  .project-portfolio-link:hover { opacity: 0.7; }
  .project-footer { display: flex; align-items: center; gap: 12px; margin-top: 5px; }
  .project-tech { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--muted); letter-spacing: 0.04em; }
  .project-link { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--accent); text-decoration: none; letter-spacing: 0.03em; }
  .project-link:hover { text-decoration: underline; }

  .skills-grid { display: flex; flex-direction: column; gap: 4px; }
  .skill-row { display: grid; grid-template-columns: 72px 1fr; gap: 0 16px; align-items: baseline; }
  .skill-cat { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .skill-list { font-size: 12.5px; color: var(--text); }
  .skill-list strong { font-weight: 500; }

  .lang-row { display: flex; gap: 28px; }
  .lang-item { font-size: 13px; }
  .lang-level { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); margin-left: 6px; }

  .interests-grid { display: flex; flex-direction: column; gap: 4px; }
  .interest-row { display: grid; grid-template-columns: 72px 1fr; gap: 0 16px; align-items: baseline; }
  .interest-cat { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding-top: 2px; }
  .interest-body { font-size: 12px; color: var(--muted); line-height: 1.55; }
  .interest-body strong { font-weight: 500; color: var(--text); }

  @media print {
    @page { size: A4 portrait; margin: 0; }
    .controls { display: none; }
    .page { padding: 22px 36px 24px; }
    .cv-name { font-size: 40px; }
    body { font-size: 11.5px; }
    .divider { margin: 10px 0; }
    .divider.thin { margin: 6px 0; }
    .section { margin-bottom: 10px; }
    a { color: inherit !important; text-decoration: none; }
  }

  @media (max-width: 580px) {
    .page { padding: 32px 20px 48px; }
    .cv-name { font-size: 38px; }
    .section { grid-template-columns: 1fr; gap: 6px 0; }
    .section-label { padding-bottom: 4px; }
  }
</style>

<div class="controls">
  <button class="ctrl-btn active" onclick="setLang('fr')" id="btn-fr">FR</button>
  <button class="ctrl-btn" onclick="setLang('en')" id="btn-en">EN</button>
  <div class="ctrl-sep"></div>
  <button class="ctrl-btn" onclick="window.print()">&#8595; PDF</button>
</div>

<div class="page">

  <header>
    <div class="cv-name">Enzo <em>Varlet</em></div>
    <div class="cv-tagline"
         data-fr="${attr(d.taglineFr)}"
         data-en="${attr(d.taglineEn)}">
      ${esc(d.taglineFr)}
    </div>
    <div class="cv-contact">
      <a href="mailto:${attr(d.email)}">${esc(d.email)}</a>
      <span class="sep">&#183;</span>
      <a href="${attr(d.linkedin)}" target="_blank">linkedin</a>
      <span class="sep">&#183;</span>
      <a href="${attr(d.github)}" target="_blank">github.com/varlet-enzo</a>
      <span class="sep">&#183;</span>
      <a href="${attr(d.itch)}" target="_blank">itch.io</a>
      <span class="sep">&#183;</span>
      <span>${esc(d.location)}</span>
    </div>
  </header>

  <hr class="divider">

  <div class="section">
    <div class="section-label" data-fr="Profil" data-en="Profile">Profil</div>
    <p class="profil"
       data-fr="${attr(d.profilFr)}"
       data-en="${attr(d.profilEn)}">
      ${esc(d.profilFr)}
    </p>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="Formation" data-en="Education">Formation</div>
    <div>
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title" data-fr="${attr(d.formationTitleFr)}" data-en="${attr(d.formationTitleEn)}">${esc(d.formationTitleFr)}</div>
          <div class="entry-date">${esc(d.formationDate)}</div>
        </div>
        <div class="entry-sub">${esc(d.formationSchool)}</div>
      </div>
    </div>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="B&#233;n&#233;volat" data-en="Volunteer">B&#233;n&#233;volat</div>
    <div>
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title" data-fr="${attr(d.benevolaTitleFr)}" data-en="${attr(d.benevolaTitleEn)}">${esc(d.benevolaTitleFr)}</div>
          <div class="entry-date" data-fr="${attr(d.benevolaDateFr)}" data-en="${attr(d.benevolaDateEn)}">${esc(d.benevolaDateFr)}</div>
        </div>
        <div class="entry-sub">${esc(d.benevolaLocation)}</div>
        <div class="entry-desc"
             data-fr="${attr(d.benevolaDescFr)}"
             data-en="${attr(d.benevolaDescEn)}">
          ${esc(d.benevolaDescFr)}
        </div>
      </div>
    </div>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="Projets" data-en="Projects">Projets</div>
    <div>
${projects}

      <a class="project-portfolio-link" href="${attr(d.portfolioUrl)}" target="_blank"
         data-fr="Voir tous mes projets &#8594; portfolio" data-en="View all projects &#8594; portfolio">
        Voir tous mes projets &#8594; portfolio
      </a>
    </div>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="Comp&#233;tences" data-en="Skills">Comp&#233;tences</div>
    <div class="skills-grid">
      <div class="skill-row">
        <span class="skill-cat" data-fr="Moteurs" data-en="Engines">Moteurs</span>
        <span class="skill-list">${d.skillsEnginesHtml}</span>
      </div>
      <div class="skill-row">
        <span class="skill-cat" data-fr="Langages" data-en="Languages">Langages</span>
        <span class="skill-list">${d.skillsLanguagesHtml}</span>
      </div>
      <div class="skill-row">
        <span class="skill-cat" data-fr="Outils" data-en="Tools">Outils</span>
        <span class="skill-list">${d.skillsToolsHtml}</span>
      </div>
      <div class="skill-row" style="margin-top:4px;padding-top:8px;border-top:1px solid var(--rule);">
        <span class="skill-cat">Soft skills</span>
        <span class="skill-list" data-fr="${attr(d.skillsSoftFr)}" data-en="${attr(d.skillsSoftEn)}">${esc(d.skillsSoftFr)}</span>
      </div>
    </div>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="Int&#233;r&#234;ts" data-en="Interests">Int&#233;r&#234;ts</div>
    <div class="interests-grid">
      <div class="interest-row">
        <span class="interest-cat">JV</span>
        <span class="interest-body">${d.interestJVHtml}</span>
      </div>
      <div class="interest-row">
        <span class="interest-cat">Escalade</span>
        <span class="interest-body">${d.interestEscaladeHtml}</span>
      </div>
      <div class="interest-row">
        <span class="interest-cat">Anime</span>
        <span class="interest-body">${d.interestAnimeHtml}</span>
      </div>
      <div class="interest-row">
        <span class="interest-cat">S&#233;rie</span>
        <span class="interest-body">${d.interestSerieHtml}</span>
      </div>
    </div>
  </div>

  <hr class="divider thin">

  <div class="section">
    <div class="section-label" data-fr="Langues" data-en="Languages">Langues</div>
    <div class="lang-row">
      <div class="lang-item">
        <span data-fr="Fran&#231;ais" data-en="French">Fran&#231;ais</span>
        <span class="lang-level" data-fr="Langue maternelle" data-en="Native">Langue maternelle</span>
      </div>
      <div class="lang-item">
        <span data-fr="Anglais" data-en="English">Anglais</span>
        <span class="lang-level">B1</span>
      </div>
    </div>
  </div>

</div>

<script>
  function setLang(lang) {
    document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.querySelectorAll('[data-fr]').forEach(el => {
      const v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
  }
</script>
`;
}
