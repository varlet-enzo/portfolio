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
  phone: string;
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
    return `            <li data-fr="${attr(fr)}" data-en="${attr(en)}">${esc(fr)}</li>`;
  }).join("\n");

  return `
          <div class="project">
            <div class="project-header">
              <span class="project-name">${esc(p.name)}</span>
              <span class="project-year" data-fr="${attr(p.yearFr)}" data-en="${attr(p.yearEn)}">${esc(p.yearFr)}</span>
            </div>
            <span class="project-role">${esc(p.role)}</span>
            <ul class="bullets">
${bullets}
            </ul>
            <div class="project-footer">
              <span class="tech">${esc(p.tech)}</span>
              <a class="plink" href="${attr(p.linkUrl)}" target="_blank">${esc(p.linkLabel)}</a>
            </div>
          </div>`;
}

export function generateCVHtml(d: CVData): string {
  const projects = d.projects.map(projectHtml).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Enzo Varlet — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Share+Tech+Mono&display=swap">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --yellow:   #C8DC00;
  --ink:      #111827;
  --muted:    #4B5563;
  --dim:      #9CA3AF;
  --sidebar:  #F3F4F6;
  --white:    #FFFFFF;
  --rule:     #E5E7EB;
  --page-bg:  #DFE1E6;
}

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--page-bg);
  margin: 0;
  -webkit-font-smoothing: antialiased;
  overflow-x: auto;
}

/* ─── Controls ─── */
.controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--white);
  border-bottom: 1px solid var(--rule);
  min-width: 860px;
}
.ctrl-btn {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border: 1px solid var(--rule);
  background: none;
  color: var(--dim);
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;
}
.ctrl-btn:hover, .ctrl-btn.active { color: var(--ink); border-color: var(--ink); }
.ctrl-sep { width: 1px; height: 14px; background: var(--rule); margin: 0 2px; }

/* ─── Page ─── */
.cv {
  display: flex;
  width: 860px;
  min-width: 860px;
  margin: 0 auto;
  min-height: calc(100vh - 38px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
}

/* ─── Sidebar ─── */
.sidebar {
  width: 218px;
  flex-shrink: 0;
  background: var(--sidebar);
  border-left: 4px solid var(--yellow);
  padding: 28px 20px 36px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sb-name {
  font-family: 'Bebas Neue', sans-serif;
  line-height: 0.88;
  letter-spacing: 0.03em;
}
.sb-first { font-size: 46px; color: var(--ink); display: block; }
.sb-last  { font-size: 46px; color: var(--ink); display: block;
  text-decoration: underline; text-decoration-color: var(--yellow); text-decoration-thickness: 3px; text-underline-offset: 4px; }

.sb-tagline {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 300;
  color: var(--muted);
  line-height: 1.55;
}

.sb-rule { height: 1px; background: var(--rule); margin: 16px 0; }

.sb-sec { margin-bottom: 16px; }
.sb-sec:last-child { margin-bottom: 0; }

.sb-head {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--ink);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.sb-head::before { content: ''; display: block; width: 8px; height: 3px; background: var(--yellow); flex-shrink: 0; }

/* Contact */
.sb-links { display: flex; flex-direction: column; gap: 4px; }
.sb-link-row { display: flex; align-items: flex-start; gap: 6px; }
.sb-dot { color: var(--yellow); font-size: 8px; margin-top: 3px; flex-shrink: 0; line-height: 1; }
.sb-link-row a { font-size: 11.5px; color: var(--muted); text-decoration: none; line-height: 1.45; word-break: break-all; }
.sb-link-row a:hover { color: var(--ink); }
.sb-link-row span { font-size: 11.5px; color: var(--muted); line-height: 1.45; }

/* Skills */
.sb-skills { display: flex; flex-direction: column; gap: 6px; }
.sb-skill-cat {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dim);
  display: block;
  margin-bottom: 2px;
  padding-left: 5px;
  border-left: 2px solid var(--yellow);
}
.sb-skill-val { font-size: 12px; color: var(--ink); line-height: 1.5; }
.sb-skill-val strong { color: var(--ink); font-weight: 600; }
.sb-skill-soft { padding-top: 6px; border-top: 1px solid var(--rule); margin-top: 2px; }

/* Languages */
.sb-langs { display: flex; flex-direction: column; gap: 5px; }
.sb-lang { display: flex; justify-content: space-between; align-items: baseline; }
.sb-lang-name { font-size: 13px; color: var(--ink); }
.sb-lang-lvl { font-family: 'Share Tech Mono', monospace; font-size: 10.5px; color: var(--muted); }

/* Interests */
.sb-ints { display: flex; flex-direction: column; gap: 6px; }
.sb-int { display: flex; gap: 7px; align-items: flex-start; }
.sb-int-cat {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dim);
  width: 42px;
  flex-shrink: 0;
  padding-top: 2px;
  line-height: 1.4;
}
.sb-int-body { font-size: 12px; color: var(--muted); line-height: 1.5; }
.sb-int-body strong { font-weight: 500; color: var(--ink); }

/* ─── Main content ─── */
.content {
  flex: 1;
  background: var(--white);
  padding: 28px 28px 36px 30px;
  min-width: 0;
}

.sec { margin-bottom: 14px; }
.sec:last-child { margin-bottom: 0; }

.sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.sec-bar {
  width: 3px;
  height: 16px;
  background: var(--yellow);
  border-radius: 2px;
  flex-shrink: 0;
}
.sec-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
}

.profil { font-size: 13px; color: var(--muted); line-height: 1.7; }

.rule { height: 1px; background: var(--rule); margin: 12px 0; }

.entry-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.entry-title { font-size: 14.5px; font-weight: 500; color: var(--ink); }
.entry-date {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.entry-sub { font-size: 13px; color: var(--muted); margin-top: 1px; }
.entry-desc { font-size: 13px; color: var(--muted); margin-top: 3px; line-height: 1.6; font-style: italic; }

/* Projects */
.project { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--rule); }
.project:last-child { margin-bottom: 6px; padding-bottom: 0; border-bottom: none; }

.project-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.project-name { font-size: 15px; font-weight: 500; color: var(--ink); }
.project-year {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.project-role {
  display: inline-block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: var(--yellow);
  padding: 1px 6px 2px;
  border-radius: 2px;
  margin-top: 4px;
}

.bullets { list-style: none; margin: 6px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.bullets li {
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.6;
  padding-left: 12px;
  position: relative;
}
.bullets li::before {
  content: '\\25B8';
  position: absolute;
  left: 0;
  color: var(--yellow);
  font-size: 10.5px;
  top: 2px;
}

.project-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 5px; }
.tech { font-family: 'Share Tech Mono', monospace; font-size: 10.5px; color: var(--muted); letter-spacing: 0.05em; }
.plink {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10.5px;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--muted);
  padding-bottom: 1px;
  white-space: nowrap;
}
.plink:hover { border-color: var(--ink); }

.portfolio-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--ink);
  text-decoration: none;
  background: var(--yellow);
  padding: 3px 9px 4px;
  border-radius: 2px;
  margin-top: 6px;
  transition: opacity 0.12s;
}
.portfolio-link:hover { opacity: 0.85; }

/* ─── Print ─── */
@media print {
  @page { size: A4 portrait; margin: 0; }
  .controls { display: none !important; }
  body { background: var(--white); }
  .cv { max-width: 100%; min-height: 297mm; box-shadow: none; }
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  a { text-decoration: none; }
  .plink { border-bottom: none; }
  .portfolio-link { background: var(--yellow) !important; color: var(--ink) !important; }
}

@media (max-width: 600px) {
  .cv { flex-direction: column; min-height: unset; }
  .sidebar { width: 100%; }
}
</style>
</head>
<body>

<div class="controls">
  <button class="ctrl-btn active" onclick="setLang('fr')" id="btn-fr">FR</button>
  <button class="ctrl-btn" onclick="setLang('en')" id="btn-en">EN</button>
  <div class="ctrl-sep"></div>
  <button class="ctrl-btn" onclick="window.print()">&#8595;&nbsp;PDF</button>
</div>

<div class="cv">

  <!-- ── Sidebar ── -->
  <aside class="sidebar">

    <div class="sb-name">
      <span class="sb-first">Enzo</span>
      <span class="sb-last">Varlet</span>
    </div>

    <div class="sb-tagline"
         data-fr="${attr(d.taglineFr)}"
         data-en="${attr(d.taglineEn)}">${esc(d.taglineFr)}</div>

    <div class="sb-rule"></div>

    <div class="sb-sec">
      <div class="sb-head" data-fr="Contact" data-en="Contact">Contact</div>
      <div class="sb-links">
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><a href="tel:${attr(d.phone.replace(/ /g,''))}">${esc(d.phone)}</a></div>
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><a href="mailto:${attr(d.email)}">${esc(d.email)}</a></div>
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><a href="${attr(d.linkedin)}" target="_blank">linkedin</a></div>
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><a href="${attr(d.github)}" target="_blank">github.com/varlet-enzo</a></div>
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><a href="${attr(d.itch)}" target="_blank">qwazertya.itch.io</a></div>
        <div class="sb-link-row"><span class="sb-dot">&#9632;</span><span>${esc(d.location)}</span></div>
      </div>
    </div>

    <div class="sb-sec">
      <div class="sb-head" data-fr="Comp&#233;tences" data-en="Skills">Comp&#233;tences</div>
      <div class="sb-skills">
        <div>
          <span class="sb-skill-cat" data-fr="Moteurs" data-en="Engines">Moteurs</span>
          <span class="sb-skill-val">${d.skillsEnginesHtml}</span>
        </div>
        <div>
          <span class="sb-skill-cat" data-fr="Langages" data-en="Languages">Langages</span>
          <span class="sb-skill-val">${d.skillsLanguagesHtml}</span>
        </div>
        <div>
          <span class="sb-skill-cat" data-fr="Outils" data-en="Tools">Outils</span>
          <span class="sb-skill-val">${d.skillsToolsHtml}</span>
        </div>
        <div class="sb-skill-soft">
          <span class="sb-skill-cat">Soft skills</span>
          <span class="sb-skill-val"
                data-fr="${attr(d.skillsSoftFr)}"
                data-en="${attr(d.skillsSoftEn)}">${esc(d.skillsSoftFr)}</span>
        </div>
      </div>
    </div>

    <div class="sb-sec">
      <div class="sb-head" data-fr="Langues" data-en="Languages">Langues</div>
      <div class="sb-langs">
        <div class="sb-lang">
          <span class="sb-lang-name" data-fr="Fran&#231;ais" data-en="French">Fran&#231;ais</span>
          <span class="sb-lang-lvl" data-fr="Natif" data-en="Native">Natif</span>
        </div>
        <div class="sb-lang">
          <span class="sb-lang-name" data-fr="Anglais" data-en="English">Anglais</span>
          <span class="sb-lang-lvl">B1</span>
        </div>
      </div>
    </div>

    <div class="sb-sec">
      <div class="sb-head" data-fr="Int&#233;r&#234;ts" data-en="Interests">Int&#233;r&#234;ts</div>
      <div class="sb-ints">
        <div class="sb-int">
          <span class="sb-int-cat">JV</span>
          <span class="sb-int-body">${d.interestJVHtml}</span>
        </div>
        <div class="sb-int">
          <span class="sb-int-cat" data-fr="Escalade" data-en="Climbing">Escalade</span>
          <span class="sb-int-body">${d.interestEscaladeHtml}</span>
        </div>
        <div class="sb-int">
          <span class="sb-int-cat">Anime</span>
          <span class="sb-int-body">${d.interestAnimeHtml}</span>
        </div>
        <div class="sb-int">
          <span class="sb-int-cat" data-fr="S&#233;rie" data-en="Series">S&#233;rie</span>
          <span class="sb-int-body">${d.interestSerieHtml}</span>
        </div>
      </div>
    </div>

  </aside>

  <!-- ── Content ── -->
  <main class="content">

    <div class="sec">
      <div class="sec-head">
        <div class="sec-bar"></div>
        <span class="sec-label" data-fr="Profil" data-en="Profile">Profil</span>
      </div>
      <p class="profil"
         data-fr="${attr(d.profilFr)}"
         data-en="${attr(d.profilEn)}">${esc(d.profilFr)}</p>
    </div>

    <div class="rule"></div>

    <div class="sec">
      <div class="sec-head">
        <div class="sec-bar"></div>
        <span class="sec-label" data-fr="Formation" data-en="Education">Formation</span>
      </div>
      <div class="entry-head">
        <span class="entry-title"
              data-fr="${attr(d.formationTitleFr)}"
              data-en="${attr(d.formationTitleEn)}">${esc(d.formationTitleFr)}</span>
        <span class="entry-date">${esc(d.formationDate)}</span>
      </div>
      <div class="entry-sub">${esc(d.formationSchool)}</div>
    </div>

    <div class="rule"></div>

    <div class="sec">
      <div class="sec-head">
        <div class="sec-bar"></div>
        <span class="sec-label" data-fr="B&#233;n&#233;volat" data-en="Volunteer">B&#233;n&#233;volat</span>
      </div>
      <div class="entry-head">
        <span class="entry-title"
              data-fr="${attr(d.benevolaTitleFr)}"
              data-en="${attr(d.benevolaTitleEn)}">${esc(d.benevolaTitleFr)}</span>
        <span class="entry-date"
              data-fr="${attr(d.benevolaDateFr)}"
              data-en="${attr(d.benevolaDateEn)}">${esc(d.benevolaDateFr)}</span>
      </div>
      <div class="entry-sub">${esc(d.benevolaLocation)}</div>
      <div class="entry-desc"
           data-fr="${attr(d.benevolaDescFr)}"
           data-en="${attr(d.benevolaDescEn)}">${esc(d.benevolaDescFr)}</div>
    </div>

    <div class="rule"></div>

    <div class="sec">
      <div class="sec-head">
        <div class="sec-bar"></div>
        <span class="sec-label" data-fr="Projets" data-en="Projects">Projets</span>
      </div>
      <div>
${projects}
        <a class="portfolio-link" href="${attr(d.portfolioUrl)}" target="_blank"
           data-fr="Tous mes projets &#8594; portfolio" data-en="All projects &#8594; portfolio">
          Tous mes projets &#8594; portfolio
        </a>
      </div>
    </div>

  </main>
</div>

<script>
  function setLang(lang) {
    document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.querySelectorAll('[data-fr]').forEach(function(el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
  }
</script>
</body>
</html>
`;
}
