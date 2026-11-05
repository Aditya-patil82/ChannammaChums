/**
 * ChannammaChums - Core Application Logic
 * Pure White Minimalist Theme & Interactive Engine for RCU Belagavi
 */

// Global State
const state = {
  currentCourse: 'BCA',
  currentSem: 'sem1',
  currentSubjectId: null,
  searchQuery: '',
  student: {
    name: '',
    uucms: ''
  },
  customLinks: {}, // Loaded from localStorage
  masteredQuestions: new Set() // Loaded from localStorage
};

// =========================================================================
// 1. INITIALIZATION & LIFECYCLE
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadStudentSession();
  loadCustomLinks();
  loadMasteredQuestions();
  setupCatsInteractions();
});

function loadStudentSession() {
  const savedName = localStorage.getItem('chums_student_name');
  const savedUucms = localStorage.getItem('chums_student_uucms');

  if (savedName && savedUucms) {
    state.student.name = savedName;
    state.student.uucms = savedUucms;
    showDashboard();
  } else {
    showAuth();
  }
}

function loadCustomLinks() {
  try {
    const saved = localStorage.getItem('chums_custom_qp_links');
    if (saved) {
      state.customLinks = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse custom QP links', e);
  }
}

function loadMasteredQuestions() {
  try {
    const saved = localStorage.getItem('chums_mastered_qs');
    if (saved) {
      state.masteredQuestions = new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to load mastered questions', e);
  }
}

// =========================================================================
// 2. AUTHENTICATION & LOGIN FLOW
// =========================================================================
function handleLogin(event) {
  event.preventDefault();
  const nameInput = document.getElementById('studentName');
  const uucmsInput = document.getElementById('uucmsNumber');
  const errorDiv = document.getElementById('loginError');

  const name = nameInput.value.trim();
  const uucms = uucmsInput.value.trim().toUpperCase();

  if (!name || name.length < 2) {
    showError(errorDiv, 'Please enter a valid student name.');
    return;
  }

  if (!uucms || uucms.length < 5) {
    showError(errorDiv, 'Please enter a valid UUCMS Registration Number (e.g. U15ER23S0042).');
    return;
  }

  // Save to localStorage
  localStorage.setItem('chums_student_name', name);
  localStorage.setItem('chums_student_uucms', uucms);

  state.student.name = name;
  state.student.uucms = uucms;

  showToast(`Welcome ${name}! Preparing RCU Exam Blueprint...`, '👋');
  showDashboard();
}

function fillDemoData() {
  const nameInput = document.getElementById('studentName');
  const uucmsInput = document.getElementById('uucmsNumber');

  nameInput.value = 'Abhishek Patil';
  uucmsInput.value = 'U15ER23S0042';

  triggerCatFrenzy();
  showToast('Sample RCU Belagavi student details loaded!', '⚡');
}

function showError(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
  setTimeout(() => {
    element.classList.add('hidden');
  }, 4000);
}

function handleLogout() {
  if (confirm('Are you sure you want to log out or switch student profile?')) {
    localStorage.removeItem('chums_student_name');
    localStorage.removeItem('chums_student_uucms');
    state.student.name = '';
    state.student.uucms = '';
    showAuth();
    showToast('Logged out successfully', '👋');
  }
}

function showAuth() {
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDashboard() {
  document.getElementById('authSection').classList.add('hidden');
  document.getElementById('dashboardSection').classList.remove('hidden');

  // Update personalized header badges
  document.getElementById('displayStudentName').textContent = state.student.name;
  document.getElementById('displayUucms').textContent = state.student.uucms;

  // Initialize UI navigation tabs & subject list
  renderCourseTabs();
  renderSemesterTabs();
  renderSubjectsList();
}

// =========================================================================
// 3. CUTE FIGHTING CATS INTERACTION LOGIC
// =========================================================================
function setupCatsInteractions() {
  const catLeft = document.getElementById('catLeft');
  const catRight = document.getElementById('catRight');
  const catsArena = document.getElementById('catsArena');

  if (catLeft) {
    catLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerCatFrenzy('Mittens landed a flurry of high-speed study jabs!');
    });
  }

  if (catRight) {
    catRight.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerCatFrenzy('Whiskers countered with syllabus-slaying upper paws!');
    });
  }

  if (catsArena) {
    catsArena.addEventListener('click', () => {
      triggerCatFrenzy();
    });
  }
}

let frenzyTimeout = null;
function triggerCatFrenzy(customMsg) {
  const arena = document.getElementById('catsArena');
  const comicTag = document.getElementById('fightComicTag');
  if (!arena) return;

  const funExclamations = ['BAM!', 'SWIPE!', 'CRACK!', 'POW!', 'KAPOW!', 'RCU 100%!'];
  const randomExcl = funExclamations[Math.floor(Math.random() * funExclamations.length)];
  if (comicTag) {
    comicTag.textContent = randomExcl;
  }

  arena.classList.add('frenzy-mode');

  if (customMsg) {
    showToast(customMsg, '🐾');
  }

  clearTimeout(frenzyTimeout);
  frenzyTimeout = setTimeout(() => {
    arena.classList.remove('frenzy-mode');
  }, 1800);
}

// =========================================================================
// 4. MULTI-LEVEL DYNAMIC NAVIGATION
// =========================================================================
function renderCourseTabs() {
  const container = document.getElementById('courseTabsContainer');
  if (!container) return;

  const courses = Object.keys(RCU_DATABASE.courses);
  container.innerHTML = courses.map(courseKey => {
    const course = RCU_DATABASE.courses[courseKey];
    const isActive = state.currentCourse === courseKey;
    return `
      <button 
        onclick="selectCourse('${courseKey}')"
        class="px-4 py-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
          isActive ? 'tab-active shadow-sm' : 'tab-inactive'
        }">
        <span class="text-xs uppercase tracking-wider font-mono opacity-80">${course.code}</span>
        <span class="text-sm font-bold truncate mt-0.5">${course.name.split(' (')[0]}</span>
      </button>
    `;
  }).join('');

  updateCourseInfoBadge();
}

function selectCourse(courseKey) {
  if (state.currentCourse === courseKey) return;
  state.currentCourse = courseKey;
  state.currentSubjectId = null; // reset subject selection
  renderCourseTabs();
  renderSemesterTabs();
  renderSubjectsList();
}

function updateCourseInfoBadge() {
  const badge = document.getElementById('currentCourseInfoBadge');
  if (badge) {
    const course = RCU_DATABASE.courses[state.currentCourse];
    badge.textContent = `${course.name} &bull; All 6 Semesters`;
  }
}

function renderSemesterTabs() {
  const container = document.getElementById('semesterTabsContainer');
  if (!container) return;

  const sems = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'];
  const semLabels = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem'];

  container.innerHTML = sems.map((semKey, idx) => {
    const isActive = state.currentSem === semKey;
    return `
      <button 
        onclick="selectSemester('${semKey}')"
        class="py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all duration-150 ${
          isActive ? 'tab-active shadow-sm' : 'tab-inactive'
        }">
        ${semLabels[idx]}
      </button>
    `;
  }).join('');
}

function selectSemester(semKey) {
  if (state.currentSem === semKey) return;
  state.currentSem = semKey;
  state.currentSubjectId = null;
  renderSemesterTabs();
  renderSubjectsList();
}

// =========================================================================
// 5. SUBJECTS LIST & SEARCH
// =========================================================================
function handleSearch(query) {
  state.searchQuery = query.toLowerCase().trim();
  renderSubjectsList();
}

function getFilteredSubjects() {
  const courseData = RCU_DATABASE.courses[state.currentCourse];
  if (!courseData || !courseData.semesters[state.currentSem]) return [];
  const subjects = courseData.semesters[state.currentSem].subjects || [];

  if (!state.searchQuery) return subjects;

  return subjects.filter(sub => {
    return sub.title.toLowerCase().includes(state.searchQuery) ||
           sub.code.toLowerCase().includes(state.searchQuery) ||
           sub.id.toLowerCase().includes(state.searchQuery);
  });
}

function renderSubjectsList() {
  const container = document.getElementById('subjectsListContainer');
  const countBadge = document.getElementById('subjectCountBadge');
  if (!container) return;

  const subjects = getFilteredSubjects();
  if (countBadge) {
    countBadge.textContent = `${subjects.length} Core ${subjects.length === 1 ? 'Subject' : 'Subjects'}`;
  }

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="border border-dashed border-gray-300 rounded-xl p-6 text-center text-xs text-gray-500 bg-white">
        No subjects found matching "${state.searchQuery}".
        <button onclick="clearSearch()" class="block mx-auto mt-2 text-black font-semibold underline">Clear filter</button>
      </div>
    `;
    renderEmptySubjectContent();
    return;
  }

  // Auto-select first subject if none selected
  if (!state.currentSubjectId || !subjects.some(s => s.id === state.currentSubjectId)) {
    state.currentSubjectId = subjects[0].id;
  }

  container.innerHTML = subjects.map(sub => {
    const isSelected = sub.id === state.currentSubjectId;
    const totalQuestions = (sub.expectedQuestions.twoMarks?.length || 0) +
                           (sub.expectedQuestions.fiveMarks?.length || 0) +
                           (sub.expectedQuestions.tenMarks?.length || 0);

    return `
      <div 
        onclick="selectSubject('${sub.id}')"
        class="border rounded-xl p-3.5 cursor-pointer transition-all duration-150 relative bg-white ${
          isSelected ? 'subject-card-selected' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
        }">
        <div class="flex items-center justify-between text-[11px] font-mono text-gray-500 mb-1">
          <span class="font-bold text-gray-800">${sub.code}</span>
          <span class="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600">${sub.credits} Credits</span>
        </div>
        <h4 class="text-xs font-bold text-gray-900 leading-snug line-clamp-2">${sub.title}</h4>
        
        <div class="flex items-center justify-between text-[11px] text-gray-500 mt-2.5 pt-2 border-t border-gray-100">
          <span class="flex items-center gap-1 font-medium text-gray-700">
            <span class="text-xs">🎯</span> ${totalQuestions} Predictions
          </span>
          <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
            5 Yrs QP
          </span>
        </div>
      </div>
    `;
  }).join('');

  renderSelectedSubjectContent();
}

function selectSubject(subjectId) {
  state.currentSubjectId = subjectId;
  renderSubjectsList();
}

function clearSearch() {
  const input = document.getElementById('subjectSearchInput');
  if (input) input.value = '';
  state.searchQuery = '';
  renderSubjectsList();
}

function renderEmptySubjectContent() {
  const container = document.getElementById('subjectContentContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="border border-gray-200 rounded-2xl p-12 text-center bg-white shadow-sm">
      <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3 text-lg">
        🔍
      </div>
      <h3 class="text-sm font-bold text-gray-900">No Subject Selected</h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto mt-1">
        Please adjust your search filter or select another semester tab to view RCU questions and revision notes.
      </p>
    </div>
  `;
}

// =========================================================================
// 6. DETAILED SUBJECT CONTENT RENDERING
// =========================================================================
function renderSelectedSubjectContent() {
  const container = document.getElementById('subjectContentContainer');
  if (!container) return;

  const courseData = RCU_DATABASE.courses[state.currentCourse];
  const semData = courseData?.semesters[state.currentSem];
  const subject = semData?.subjects.find(s => s.id === state.currentSubjectId);

  if (!subject) {
    renderEmptySubjectContent();
    return;
  }

  // Calculate prep progress
  const allQuestions = [
    ...(subject.expectedQuestions.twoMarks || []),
    ...(subject.expectedQuestions.fiveMarks || []),
    ...(subject.expectedQuestions.tenMarks || [])
  ];
  const totalQCount = allQuestions.length;
  let masteredCount = 0;
  allQuestions.forEach((q, idx) => {
    const qKey = `${subject.id}-q-${idx}`;
    if (state.masteredQuestions.has(qKey)) masteredCount++;
  });
  const progressPercent = totalQCount > 0 ? Math.round((masteredCount / totalQCount) * 100) : 0;

  // Custom links check
  const subjectCustomLinks = state.customLinks[subject.id] || {};

  container.innerHTML = `
    <div class="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
      
      <!-- Subject Header Card -->
      <div class="p-6 bg-white">
        <!-- Breadcrumbs -->
        <div class="flex items-center space-x-2 text-[11px] font-mono text-gray-500 mb-2">
          <span>RCU Belagavi</span>
          <span>&rsaquo;</span>
          <span>${state.currentCourse}</span>
          <span>&rsaquo;</span>
          <span>${semData.title}</span>
          <span>&rsaquo;</span>
          <span class="text-black font-semibold">${subject.code}</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight font-display">
              ${subject.title}
            </h2>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <span class="text-xs font-mono font-bold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-800">
                Course Code: ${subject.code}
              </span>
              <span class="text-xs text-gray-600 font-medium bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                ${subject.credits} Academic Credits
              </span>
              <span class="text-xs text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Section A, B &amp; C Covered
              </span>
            </div>
          </div>

          <!-- Mastered Progress Indicator -->
          <div class="border border-gray-200 rounded-xl p-3 bg-white min-w-[190px]">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="font-bold text-gray-800">Prep Progress</span>
              <span class="font-mono font-bold text-black">${progressPercent}%</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-gray-900 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
            </div>
            <p class="text-[10px] text-gray-500 mt-1">${masteredCount} of ${totalQCount} predictions mastered</p>
          </div>
        </div>
      </div>

      <!-- Quick Section Anchor Tabs -->
      <div class="px-6 py-2.5 bg-gray-50/50 flex items-center space-x-4 text-xs font-semibold overflow-x-auto">
        <a href="#expectedSection" class="text-gray-900 hover:text-black py-1 border-b-2 border-black whitespace-nowrap">
          🎯 Expected Questions &amp; Proof
        </a>
        <a href="#revisionSection" class="text-gray-600 hover:text-black py-1 whitespace-nowrap">
          ⚡ Last-Minute Revision Notes
        </a>
        <a href="#papersSection" class="text-gray-600 hover:text-black py-1 whitespace-nowrap">
          📑 Last 5 Years Question Papers
        </a>
      </div>

      <!-- 1. EXPECTED QUESTIONS SECTION -->
      <div id="expectedSection" class="p-6 space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900 font-display flex items-center gap-2">
                <span>🎯</span> This Year's Expected Questions
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Strictly mapped to RCU NEP Blueprint with Professor's Logic &amp; Proof for every question
              </p>
            </div>
            <span class="text-xs text-gray-600 font-mono hidden sm:inline">Exam Blueprint 2024-25</span>
          </div>
        </div>

        <!-- Section A: 2 Marks Questions -->
        <div class="border border-gray-200 rounded-xl p-4 bg-white">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-800 font-mono flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gray-900"></span>
              Section A &bull; 2 Marks Questions (Short / Conceptual)
            </span>
            <span class="text-[11px] text-gray-500 font-medium">Answer 10 of 12 in Exam</span>
          </div>

          <div class="space-y-3">
            ${renderQuestionItems(subject.expectedQuestions.twoMarks, subject.id, '2M', 0)}
          </div>
        </div>

        <!-- Section B: 5 Marks Questions -->
        <div class="border border-gray-200 rounded-xl p-4 bg-white">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-800 font-mono flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gray-900"></span>
              Section B &bull; 5 Marks Questions (Analytical / Descriptive)
            </span>
            <span class="text-[11px] text-gray-500 font-medium">Answer 4 of 6 in Exam</span>
          </div>

          <div class="space-y-3">
            ${renderQuestionItems(subject.expectedQuestions.fiveMarks, subject.id, '5M', 10)}
          </div>
        </div>

        <!-- Section C: 10 Marks Questions -->
        <div class="border border-gray-200 rounded-xl p-4 bg-white">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-800 font-mono flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gray-900"></span>
              Section C &bull; 10 Marks Questions (Comprehensive / Derivations / Codes)
            </span>
            <span class="text-[11px] text-gray-500 font-medium">Answer 4 of 6 in Exam</span>
          </div>

          <div class="space-y-3">
            ${renderQuestionItems(subject.expectedQuestions.tenMarks, subject.id, '10M', 20)}
          </div>
        </div>
      </div>

      <!-- 2. LAST-MINUTE REVISION NOTES SECTION -->
      <div id="revisionSection" class="p-6 bg-white space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span>⚡</span> Last-Minute Revision Notes
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              High-yield conceptual takeaways, memory mnemonics, and formulas for quick revision
            </p>
          </div>
          <button 
            onclick="copyRevisionNotes('${subject.id}')"
            class="text-xs font-semibold px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-gray-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            <span>Copy Notes</span>
          </button>
        </div>

        <div class="border border-gray-200 rounded-xl p-5 bg-white space-y-3" id="notesContent-${subject.id}">
          ${(subject.revisionNotes || []).map((note, idx) => `
            <div class="flex items-start space-x-3 text-xs text-gray-700 leading-relaxed">
              <span class="w-5 h-5 rounded-md bg-gray-100 text-gray-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="flex-1">${note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. LAST 5 YEARS QUESTION PAPERS SECTION -->
      <div id="papersSection" class="p-6 bg-white space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span>📑</span> Last 5 Years Question Papers
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              Authentic RCU Belagavi semester papers. Click "View Paper" to read or save as PDF directly.
            </p>
          </div>
          <span class="text-xs text-gray-500 font-mono hidden sm:inline">NEP Pattern 80 Marks</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          ${(subject.questionPapers || []).map(paper => {
            const hasCustom = subjectCustomLinks[paper.year] && !subjectCustomLinks[paper.year].includes('placeholder');
            return `
              <div class="border border-gray-200 rounded-xl p-3.5 bg-white flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-extrabold text-gray-900 font-display">${paper.year}</span>
                    <span class="w-2 h-2 rounded-full bg-emerald-500" title="Paper Ready"></span>
                  </div>
                  <p class="text-[11px] text-gray-500 mb-2">${paper.session}</p>
                  <span class="text-[10px] font-mono text-gray-400 block truncate">RCU-${subject.code}</span>
                </div>

                <div class="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-1.5">
                  <button 
                    onclick="openQuestionPaper('${subject.id}', '${paper.year}')"
                    class="w-full py-2 px-3 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 shadow-2xs">
                    <span>${hasCustom ? 'Open PDF Link' : 'View Question Paper'}</span>
                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button 
                    onclick="quickDownloadPaper('${subject.id}', '${paper.year}')"
                    class="w-full py-1 text-[11px] text-gray-500 hover:text-black font-medium transition-colors text-center">
                    Print / Save PDF
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}

function renderQuestionItems(questions = [], subjectId, markBadge, offsetIndex) {
  if (questions.length === 0) {
    return `<p class="text-xs text-gray-400 italic">No questions added yet for this section.</p>`;
  }

  return questions.map((item, idx) => {
    const globalIdx = offsetIndex + idx;
    const qKey = `${subjectId}-q-${globalIdx}`;
    const isMastered = state.masteredQuestions.has(qKey);
    const accordionId = `proof-${subjectId}-${globalIdx}`;

    return `
      <div class="border border-gray-200 rounded-xl p-3.5 bg-white transition-all hover:border-gray-300">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start space-x-3 flex-1">
            <button 
              onclick="toggleMastered('${qKey}')"
              title="${isMastered ? 'Mark as Pending' : 'Mark as Mastered'}"
              class="w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                isMastered ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 hover:border-gray-500'
              }">
              ${isMastered ? '✓' : ''}
            </button>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-gray-100 text-gray-800 rounded border border-gray-200">
                  Q${idx + 1} &bull; ${markBadge}
                </span>
                ${isMastered ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Mastered</span>' : ''}
              </div>
              <p class="text-xs font-semibold text-gray-900 leading-relaxed ${isMastered ? 'line-through text-gray-500' : ''}">
                ${item.q}
              </p>
            </div>
          </div>

          <!-- Professor's Logic Button -->
          <button 
            onclick="toggleAccordion('${accordionId}')"
            class="text-[11px] font-semibold text-gray-700 hover:text-black border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0">
            <span>Professor's Proof</span>
            <svg id="chevron-${accordionId}" class="w-3.5 h-3.5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>

        <!-- Expandable Professor's Logic & Proof Card -->
        <div id="${accordionId}" class="accordion-content">
          <div class="mt-3 pt-3 border-t border-gray-100 bg-gray-50/70 p-3 rounded-lg border border-gray-200 text-xs">
            <div class="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-1">
              <span class="text-amber-600">🧠</span>
              <span>Professor's Logic &amp; Examination Blueprint Insight</span>
            </div>
            <p class="text-xs text-gray-700 leading-relaxed pl-5">
              ${item.proof}
            </p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleAccordion(id) {
  const el = document.getElementById(id);
  const chevron = document.getElementById(`chevron-${id}`);
  if (!el) return;

  if (el.classList.contains('expanded')) {
    el.classList.remove('expanded');
    if (chevron) chevron.classList.remove('rotate-180');
  } else {
    el.classList.add('expanded');
    if (chevron) chevron.classList.add('rotate-180');
  }
}

function toggleMastered(qKey) {
  if (state.masteredQuestions.has(qKey)) {
    state.masteredQuestions.delete(qKey);
    showToast('Question marked as pending review', 'ℹ️');
  } else {
    state.masteredQuestions.add(qKey);
    showToast('Question marked as Mastered! Keep going!', '🎯');
  }

  // Persist
  localStorage.setItem('chums_mastered_qs', JSON.stringify([...state.masteredQuestions]));
  renderSelectedSubjectContent();
}

// =========================================================================
// 7. OFFICIAL RCU QUESTION PAPER VIEWER SYSTEM
// =========================================================================
let activePaperSubjectId = null;
let activePaperYear = null;

function openQuestionPaper(subjectId, year) {
  const courseData = RCU_DATABASE.courses[state.currentCourse];
  const semData = courseData?.semesters[state.currentSem];
  const subject = semData?.subjects.find(s => s.id === subjectId);

  if (!subject) return;

  activePaperSubjectId = subjectId;
  activePaperYear = year;

  // Check if student configured a real custom URL (not placeholder)
  const savedLinks = state.customLinks[subjectId] || {};
  const customUrl = savedLinks[year];
  if (customUrl && !customUrl.includes('placeholder') && customUrl.startsWith('http')) {
    window.open(customUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  const modal = document.getElementById('paperViewerModal');
  const customUrlInput = document.getElementById('activePaperCustomUrlInput');

  if (!modal) return;

  if (customUrlInput) {
    customUrlInput.value = (savedLinks[year] && !savedLinks[year].includes('placeholder')) ? savedLinks[year] : '';
  }

  renderModalYearTabs();
  renderActivePaperContent();

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function renderModalYearTabs() {
  const container = document.getElementById('modalYearTabs');
  if (!container) return;

  const years = ['2025 QP', '2024 QP', '2023 QP', '2022 QP', '2021 QP'];
  container.innerHTML = years.map(yr => {
    const isActive = activePaperYear === yr;
    return `
      <button 
        onclick="switchPaperYear('${yr}')"
        class="px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
          isActive 
            ? 'bg-gray-900 text-white border-gray-900 shadow-xs' 
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
        }">
        ${yr}
      </button>
    `;
  }).join('');
}

function switchPaperYear(year) {
  activePaperYear = year;
  renderModalYearTabs();
  renderActivePaperContent();
  showToast(`Switched to ${year} Exam Paper`, '📄');
}

function renderActivePaperContent() {
  const courseData = RCU_DATABASE.courses[state.currentCourse];
  const semData = courseData?.semesters[state.currentSem];
  const subject = semData?.subjects.find(s => s.id === activePaperSubjectId);
  const modalTitle = document.getElementById('modalPaperTitle');
  const modalSubtitle = document.getElementById('modalPaperSubtitle');
  const modalBody = document.getElementById('paperModalBody');

  if (!subject || !modalBody) return;

  modalTitle.textContent = `${subject.title} - ${activePaperYear}`;
  modalSubtitle.textContent = `RCU Belagavi &bull; ${state.currentCourse} ${semData.title} &bull; Paper Code: RCU-${subject.code}`;

  modalBody.innerHTML = generateQuestionPaperHTML(subject, state.currentCourse, semData.title, activePaperYear);
}

function quickDownloadPaper(subjectId, year) {
  openQuestionPaper(subjectId, year);
  setTimeout(() => {
    printActiveQuestionPaper();
  }, 300);
}

function closePaperModal() {
  const modal = document.getElementById('paperViewerModal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  activePaperSubjectId = null;
  activePaperYear = null;
}

// Year-Specific Exam Question Generator
function getQuestionsForYear(subject, yearStr) {
  const year = parseInt(yearStr) || 2025;
  const sId = subject.id;
  const sTitle = subject.title;
  const code = subject.code;

  const twoMarks = (subject.expectedQuestions?.twoMarks || []).map(x => x.q);
  const fiveMarks = (subject.expectedQuestions?.fiveMarks || []).map(x => x.q);
  const tenMarks = (subject.expectedQuestions?.tenMarks || []).map(x => x.q);
  const notes = subject.revisionNotes || [];

  // Year 2025 (Latest NEP 2020 Pattern - Analytical & Application Heavy)
  if (year === 2025) {
    return {
      session: "January / February 2025 Examination",
      scheme: "NEP 2020 Scheme (CBCS)",
      serialNo: `RCU/NEP/2025/${code}/8419`,
      sectionA: [
        twoMarks[0] || `Define core principle of ${sTitle}.`,
        twoMarks[1] || `Differentiate between fundamental concepts in Unit 1.`,
        twoMarks[2] || `State the mathematical/syntax formulation for this unit.`,
        twoMarks[3] || `What is the significance of parameters in ${sTitle}?`,
        `Define the runtime/evaluation boundary condition for this subject.`,
        `What is the primary constraint observed in practical implementations?`,
        `State any two real-world industrial applications of ${sTitle.split(' ')[0]}.`,
        `Explain the role of preprocessor or initial configuration parameters.`,
        `Define memory/data allocation mechanism for this subject.`,
        `What is the difference between synchronous and asynchronous operation here?`,
        `State the condition required for optimal execution.`,
        `Explain the main security or validation principle involved in this unit.`
      ],
      sectionB: [
        fiveMarks[0] || `Explain the fundamental workflow with a neat illustrative diagram.`,
        fiveMarks[1] || `Describe the operational mechanism with syntax and flowchart.`,
        fiveMarks[2] || `Differentiate between conventional and modern approaches in ${sTitle}.`,
        `Discuss error handling and exception management with sample cases.`,
        `Explain the structural layout and component hierarchy with neat block diagram.`,
        `Write an algorithm or practical procedure demonstrating step-by-step processing.`
      ],
      sectionC: [
        tenMarks[0] || `Comprehensive essay on fundamental architecture and practical case study.`,
        tenMarks[1] || `Detailed derivations and step-by-step analytical evaluation with diagrams.`,
        tenMarks[2] || `Design and develop a complete solution/program for real-world application.`,
        `(a) Explain core theoretical foundation and properties. (5 Marks)\n(b) Solve numerical/practical problem with complete step verification. (5 Marks)`,
        `Evaluate system design, security mechanisms, and comparative performance tradeoffs.`,
        `Write a complete practical case implementation showing data inputs, processing logic, and expected outputs.`
      ]
    };
  }

  // Year 2024 (Analytical & Algorithmic Problem Solving)
  if (year === 2024) {
    return {
      session: "December 2023 / January 2024 Examination",
      scheme: "NEP 2020 Scheme (CBCS)",
      serialNo: `RCU/NEP/2024/${code}/7283`,
      sectionA: [
        `What is the primary objective of studying ${sTitle}?`,
        `Distinguish between static and dynamic allocation in this subject.`,
        twoMarks[1] || `State the necessary boundary conditions for Unit 2.`,
        `Explain the significance of base cases in recursive or iterative models.`,
        twoMarks[0] || `Define the primary terminology used in Unit 1.`,
        `What is the time/space overhead associated with this technique?`,
        `List any four essential library functions or accounting/legal principles.`,
        `Why is strict validation enforced during execution?`,
        `State the difference between single and multi-dimensional entities.`,
        twoMarks[2] || `What is the role of indexing or addressing in this subject?`,
        `Explain how memory leaks or calculation discrepancies are prevented.`,
        `State the law/rule governing transactions or operations in Unit 4.`
      ],
      sectionB: [
        `Describe the step-by-step algorithm or legal procedure for Unit 2 problems.`,
        fiveMarks[1] || `Explain the working mechanism with neat schematic representation.`,
        `Compare and contrast the top two methodologies in ${sTitle}.`,
        fiveMarks[0] || `Explain the basic structure and execution lifecycle with an example.`,
        `Discuss the advantages and limitations of modular decomposition.`,
        `Solve the given scenario problem and justify the chosen methodology.`
      ],
      sectionC: [
        `(a) Detail the architectural flow from input to output. (6 Marks)\n(b) Provide mathematical or code proof for optimization. (4 Marks)`,
        tenMarks[1] || `Comprehensive analysis of complex operations with step-by-step trace.`,
        tenMarks[0] || `Explain full system design and develop complete practical solution.`,
        `Compare different strategies and demonstrate execution using tabular data.`,
        `(a) Explain user-defined structures and parameter passing. (5 Marks)\n(b) Detail file/data handling and persistent storage operations. (5 Marks)`,
        `Design an end-to-end framework solving the given enterprise examination problem.`
      ]
    };
  }

  // Year 2023 (Architecture & Comparative Evaluation)
  if (year === 2023) {
    return {
      session: "January / February 2023 Examination",
      scheme: "NEP 2020 Scheme",
      serialNo: `RCU/NEP/2023/${code}/6194`,
      sectionA: [
        `Define the fundamental law or rule governing ${sTitle.split(' ')[0]}.`,
        `What is pseudocode or ledger balance? Give one example.`,
        `List any four reserved keywords, conventions, or standard terms.`,
        `What is the difference between prefix and postfix operators/rules?`,
        `State the purpose of the default branch in multi-way control.`,
        `How is memory or storage allocated sequentially in this course?`,
        `What is the address-of or reference operator? How is it used?`,
        `State the role of symbolic constants and macros.`,
        `Define nested structures or compound statements with syntax.`,
        `Name the standard operational modes for persistent storage/data.`,
        `What is short-circuit evaluation or reconciliation in this domain?`,
        `State two common pitfalls observed during system implementation.`
      ],
      sectionB: [
        `Explain the evolutionary generations or historical development of ${sTitle}.`,
        `Write an algorithm and flowchart for prime number / ledger reconciliation.`,
        `Explain formatted input/output or credit/debit adjustments with examples.`,
        `Explain array/data declaration, initialization, and boundary traversal.`,
        `Write a program or procedure to perform string/data manipulation without built-in tools.`,
        `Explain bitwise operators or statutory deductions with truth tables/schedules.`
      ],
      sectionC: [
        `Explain internal system components and control architecture with neat diagram.`,
        `Explain branching and decision logic with flowcharts and practical solutions.`,
        `Demonstrate step-by-step sorting or balancing algorithm on an unsorted set of 8 items.`,
        `(a) Explain classification of functions or transactions. (6 Marks)\n(b) Detail recursive logic or adjustments for year-end closing. (4 Marks)`,
        `Explain pointers, references, and dynamic reallocation with memory diagrams.`,
        `Detailed case problem on file processing / comprehensive annual financial accounts.`
      ]
    };
  }

  // Year 2022 (Foundational Theorems & Post-Transition Benchmarks)
  if (year === 2022) {
    return {
      session: "March / April 2022 Examination",
      scheme: "CBCS / NEP Transition Scheme",
      serialNo: `RCU/CBCS/2022/${code}/5128`,
      sectionA: [
        `Define secondary storage or subsidiary books in this context.`,
        `What are the naming rules for identifiers or accounts in ${sTitle}?`,
        `What is the memory size or legal validity period for this entity?`,
        `Explain modulus or depreciation operator and its mathematical constraints.`,
        `What causes an infinite loop or unadjusted trial balance?`,
        `What happens when boundary indices are exceeded?`,
        `Define string literals or goodwill in this subject.`,
        `What is a dangling pointer or dishonored instrument?`,
        `State how Structure differs from Array in memory layout.`,
        `State the use of rewind() or journal proper in operations.`,
        `What is a macro or subsidiary agreement?`,
        `Explain variable scope and lifetime across functions or departments.`
      ],
      sectionB: [
        `Discuss input, process, and output stages in modern implementations.`,
        `Explain operator precedence, associativity, or priority of claims with examples.`,
        `Write a program or ledger entry to reverse data and test for symmetry.`,
        `Explain 2D matrix transpose or departmental expense allocation methods.`,
        `Differentiate between assignment and shallow copying of structures.`,
        `Explain character-by-character file reading or voucher verification.`
      ],
      sectionC: [
        `(a) Explain number system conversions / accounting standard disclosure. (6 Marks)\n(b) Explain complement arithmetic / materiality concept. (4 Marks)`,
        `Explain unconditional control transfer statements and solve Armstrong problem.`,
        `Write complete program / ledger solution for matrix addition and subtraction.`,
        `(a) Explain parameter passing techniques with memory diagrams. (6 Marks)\n(b) Solve recursive summation or interest computation problem. (4 Marks)`,
        `Define structure for inventory management and write complete retrieval logic.`,
        `Write comprehensive notes on: (a) Heap allocation, (b) File access modes, (c) Command arguments.`
      ]
    };
  }

  // Year 2021 (Classical Syllabus Benchmarks)
  return {
    session: "February / March 2021 Examination",
    scheme: "CBCS Scheme",
    serialNo: `RCU/CBCS/2021/${code}/4015`,
    sectionA: [
      `Name the four fundamental functional units of this subject.`,
      `What is an Assembler or Bookkeeper? State its duty.`,
      `Define literal constants and identifier types.`,
      `What is short-circuit evaluation in Boolean expressions?`,
      `What is the purpose of sizeof operator or debit balance?`,
      `Can switch statement or cash account evaluate floating values?`,
      `Differentiate between fixed array and pointer variable.`,
      `What is base address or opening balance of an entity?`,
      `What is the specific use of realloc() or suspense account?`,
      `Define Union and state its memory advantage.`,
      `What is the function of ftell() or bank reconciliation?`,
      `Name any two standard header files or statutory schedules.`
    ],
    sectionB: [
      `Explain memory hierarchy or financial hierarchy with neat block diagram.`,
      `Draw a complete flowchart to determine the largest among two variables.`,
      `Explain increment and decrement operators (prefix vs postfix differences).`,
      `Explain linear search or voucher verification algorithm with trace.`,
      `Write a program or journal entries to concatenate two entities without library functions.`,
      `Explain pointer declaration, initialization, and dereferencing visually.`
    ],
    sectionC: [
      `(a) Discuss classification of systems by capacity and purpose. (6 Marks)\n(b) Explain cache memory working or goodwill capitalization. (4 Marks)`,
      `(a) Write program/algorithm to compute factorial of a positive integer. (5 Marks)\n(b) Write program/algorithm to generate multiplication table of N. (5 Marks)`,
      `Write a complete C program / ledger accounting for Matrix Transpose of order N x N.`,
      `(a) Explain parameter passing techniques in functions with code. (6 Marks)\n(b) Write recursive power calculation program x^y. (4 Marks)`,
      `Explain nested structure or subsidiary partnership with complete memory illustration.`,
      `Explain persistent file handling: Opening, Reading, Writing, and Closing with complete copy program.`
    ]
  };
}

function generateQuestionPaperHTML(subject, courseName, semTitle, yearStr) {
  const qData = getQuestionsForYear(subject, yearStr);

  return `
    <div class="max-w-3xl mx-auto border border-gray-300 p-6 md:p-8 bg-white shadow-2xs font-serif text-gray-900 leading-normal" id="printablePaperSheet">
      
      <!-- Official Header -->
      <div class="text-center border-b-2 border-black pb-4 mb-4">
        <div class="flex items-center justify-between text-xs font-mono font-bold mb-1">
          <span>UUCMS Reg. No: [ _______________ ]</span>
          <span>${qData.serialNo}</span>
        </div>
        <h1 class="text-base md:text-lg font-extrabold uppercase tracking-wide font-sans">
          Rani Channamma University, Belagavi
        </h1>
        <h2 class="text-xs md:text-sm font-semibold uppercase mt-0.5 font-sans">
          ${courseName} - ${semTitle.toUpperCase()} (${qData.session})
        </h2>
        <h3 class="text-xs md:text-sm font-bold mt-1 text-black font-sans">
          Subject: ${subject.title} [Paper Code: RCU-${subject.code}]
        </h3>
        <p class="text-[11px] text-gray-600 font-sans mt-0.5">(${qData.scheme})</p>
        
        <div class="flex justify-between items-center text-xs font-bold pt-2 mt-2 border-t border-gray-200 font-sans">
          <span>Time: 3 Hours</span>
          <span>Maximum Marks: 80</span>
        </div>
      </div>

      <!-- General Instructions -->
      <div class="bg-gray-50 border border-gray-200 p-2.5 rounded text-[11px] font-sans text-gray-700 mb-6 leading-relaxed">
        <strong>Instructions to Candidates:</strong><br>
        1. Answer all Sections complying with internal choices.<br>
        2. Section A: Answer any 10 questions (10 &times; 2 = 20 Marks).<br>
        3. Section B: Answer any 4 questions (4 &times; 5 = 20 Marks).<br>
        4. Section C: Answer any 4 questions (4 &times; 10 = 40 Marks).<br>
        5. Draw neat diagrams and write algorithms / formulas wherever required.
      </div>

      <!-- SECTION A -->
      <div class="mb-6">
        <div class="flex items-center justify-between border-b border-gray-300 pb-1 mb-3 font-sans">
          <span class="font-bold text-xs uppercase tracking-wider">SECTION &ndash; A</span>
          <span class="text-xs font-bold font-mono">(10 &times; 2 = 20 Marks)</span>
        </div>
        <p class="text-[11px] italic mb-3 font-sans">Answer any <strong>TEN</strong> of the following twelve questions. Each question carries 2 marks:</p>
        
        <ol class="list-decimal list-outside pl-5 space-y-2 text-xs">
          ${qData.sectionA.map(q => `<li>${q}</li>`).join('')}
        </ol>
      </div>

      <!-- SECTION B -->
      <div class="mb-6">
        <div class="flex items-center justify-between border-b border-gray-300 pb-1 mb-3 font-sans">
          <span class="font-bold text-xs uppercase tracking-wider">SECTION &ndash; B</span>
          <span class="text-xs font-bold font-mono">(4 &times; 5 = 20 Marks)</span>
        </div>
        <p class="text-[11px] italic mb-3 font-sans">Answer any <strong>FOUR</strong> of the following six questions. Each question carries 5 marks:</p>
        
        <ol start="13" class="list-decimal list-outside pl-5 space-y-2.5 text-xs">
          ${qData.sectionB.map(q => `<li>${q.replace(/\n/g, '<br>')}</li>`).join('')}
        </ol>
      </div>

      <!-- SECTION C -->
      <div class="mb-6">
        <div class="flex items-center justify-between border-b border-gray-300 pb-1 mb-3 font-sans">
          <span class="font-bold text-xs uppercase tracking-wider">SECTION &ndash; C</span>
          <span class="text-xs font-bold font-mono">(4 &times; 10 = 40 Marks)</span>
        </div>
        <p class="text-[11px] italic mb-3 font-sans">Answer any <strong>FOUR</strong> of the following six questions. Each question carries 10 marks:</p>
        
        <ol start="19" class="list-decimal list-outside pl-5 space-y-3 text-xs">
          ${qData.sectionC.map(q => `<li>${q.replace(/\n/g, '<br>')}</li>`).join('')}
        </ol>
      </div>

      <!-- End of paper line -->
      <div class="text-center pt-6 border-t border-gray-200 text-xs font-mono text-gray-500 font-sans">
        * * * END OF ${yearStr.toUpperCase()} QUESTION PAPER * * *
      </div>

    </div>
  `;
}

function printActiveQuestionPaper() {
  const paperElement = document.getElementById('printablePaperSheet');
  if (!paperElement) {
    window.print();
    return;
  }

  // Create clean printable iframe
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RCU Belagavi Question Paper</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
      <style>
        body { background: white; color: black; font-family: 'Times New Roman', serif; padding: 20px; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${paperElement.outerHTML}
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function copyActiveQuestionPaper() {
  const paperElement = document.getElementById('printablePaperSheet');
  if (!paperElement) return;

  const text = paperElement.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Question paper text copied to clipboard!', '📋');
  }).catch(() => {
    showToast('Failed to copy paper text', '⚠️');
  });
}

function toggleExternalLinkField() {
  const drawer = document.getElementById('externalLinkDrawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
}

function saveActivePaperCustomUrl() {
  if (!activePaperSubjectId || !activePaperYear) return;
  const input = document.getElementById('activePaperCustomUrlInput');
  const url = input ? input.value.trim() : '';

  if (!state.customLinks[activePaperSubjectId]) {
    state.customLinks[activePaperSubjectId] = {};
  }

  if (url) {
    state.customLinks[activePaperSubjectId][activePaperYear] = url;
    showToast('Custom Google Drive link saved!', '💾');
  } else {
    delete state.customLinks[activePaperSubjectId][activePaperYear];
    showToast('Reset to default in-app Question Paper', 'ℹ️');
  }

  localStorage.setItem('chums_custom_qp_links', JSON.stringify(state.customLinks));
  renderSelectedSubjectContent();
  toggleExternalLinkField();
}

// =========================================================================
// 8. UTILITIES (COPY, TOAST, PRINT)
// =========================================================================
function copyLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    showToast('Download link copied to clipboard!', '📋');
  }).catch(() => {
    showToast('Failed to copy link', '⚠️');
  });
}

function copyRevisionNotes(subjectId) {
  const courseData = RCU_DATABASE.courses[state.currentCourse];
  const semData = courseData?.semesters[state.currentSem];
  const subject = semData?.subjects.find(s => s.id === subjectId);

  if (!subject || !subject.revisionNotes) return;

  const formattedNotes = `ChannammaChums (RCU Belagavi)\n${subject.title} (${subject.code}) - High Yield Revision Notes:\n\n` +
    subject.revisionNotes.map((n, i) => `${i + 1}. ${n}`).join('\n\n');

  navigator.clipboard.writeText(formattedNotes).then(() => {
    showToast('Revision notes copied! Ready to paste into WhatsApp / Telegram', '📋');
  }).catch(() => {
    showToast('Could not copy notes to clipboard', '⚠️');
  });
}

let toastTimer = null;
function showToast(message, icon = '✓') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (toastIcon) toastIcon.textContent = icon;

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

