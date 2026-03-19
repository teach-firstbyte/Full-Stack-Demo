var COLORS = [
  '#ef4444',
  '#f97316',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16'
];

var habits = [];
var completions = [];
var selectedColor = COLORS[0];

const API_URL = 'http://localhost:3001';

function getStreak(id) {
  return 0;
}

function getWeekPct(id) {
  return 0;
}

async function apiFetch(url, options = {}) {
  const res = await fetch(API_URL + url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadData() {
  habits = await apiFetch('/api/habits');
  renderToday();
}

function renderToday() {
  var total = habits.length;
  var count = habits.filter(function(h) { return h.completed; }).length;

  var pct = total > 0 ? Math.round((count / total) * 100) : 0;

  var dateText = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
  });
  document.getElementById('today-date-label').textContent = dateText;

  document.getElementById('today-count').textContent = count + ' of ' + total + ' habits completed';

  document.getElementById('today-pct').textContent = pct + '%';

  document.getElementById('progress-fill').style.width = pct + '%';

  var list = document.getElementById('today-list');

  if (habits.length === 0) {
      list.innerHTML = '<p class="empty-state">No habits yet. Go to "My Habits" to add some!</p>';
      return;
  }

  var html = '';
  for (var i = 0; i < habits.length; i++) {
      var habit = habits[i];
      var isDone = completions.includes(habit.id);
      html += buildHabitItem(habit, habit.completed);
  }
  list.innerHTML = html;
}

function renderHabits() {
  var colorHtml = '';
  for (var i = 0; i < COLORS.length; i++) {
      colorHtml += buildColorBtn(COLORS[i]);
  }
  document.getElementById('colors-row').innerHTML = colorHtml;

  var list = document.getElementById('habits-list');

  if (habits.length === 0) {
      list.innerHTML = '<p class="empty-state">No habits yet. Add one above!</p>';
      return;
  }

  var html = '';
  for (var i = 0; i < habits.length; i++) {
      html += buildHabitRow(habits[i]);
  }
  list.innerHTML = html;
}


function buildHabitItem(habit, isDone) {
  var doneClass = isDone ? 'done' : '';

  var tickSvg = '<svg viewBox="0 0 12 10"><polyline points="1 5 4 8 11 1"/></svg>';

  return (
      '<div class="habit-item ' + doneClass + '" onclick="toggleHabit(\'' + habit.id + '\')">' +
      '<div class="check-circle">' + tickSvg + '</div>' +
      '<div class="dot" style="background:' + habit.color + '"></div>' +
      '<span class="habit-name">' + habit.name + '</span>' +
      '</div>'
  );
}


function buildColorBtn(color) {
  var selectedClass = (color === selectedColor) ? 'selected' : '';

  return (
      '<div class="color-btn ' + selectedClass + '" ' +
      'style="background:' + color + '" ' +
      'onclick="selectColor(\'' + color + '\')">' +
      '</div>'
  );
}


function buildHabitRow(habit) {
  var trashIcon =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="3 6 5 6 21 6"/>' +
      '<path d="M19 6l-1 14H6L5 6"/>' +
      '<path d="M10 11v6"/>' +
      '<path d="M14 11v6"/>' +
      '<path d="M9 6V4h6v2"/>' +
      '</svg>';

  return (
      '<div class="habit-row">' +
      '<div class="dot" style="background:' + habit.color + '"></div>' +
      '<div>' +
      '<div class="habit-row-name">' + habit.name + '</div>' +
      '<div class="habit-row-stats">↗ ' + getStreak(habit.id) + ' day streak &nbsp; ' + getWeekPct(habit.id) + '% this week</div>' +
      '</div>' +
      '<button class="btn-delete" onclick="deleteHabit(\'' + habit.id + '\')">' + trashIcon + '</button>' +
      '</div>'
  );
}


function switchTab(tab) {
  var showingToday = (tab === 'today');

  if (showingToday) {
      document.getElementById('view-today').classList.remove('hidden');
      document.getElementById('view-habits').classList.add('hidden');
  } else {
      document.getElementById('view-today').classList.add('hidden');
      document.getElementById('view-habits').classList.remove('hidden');
  }

  if (showingToday) {
      document.getElementById('tab-today').classList.add('active');
      document.getElementById('tab-habits').classList.remove('active');
  } else {
      document.getElementById('tab-today').classList.remove('active');
      document.getElementById('tab-habits').classList.add('active');
  }

  if (showingToday) {
      renderToday();
  } else {
      renderHabits();
  }
}


async function toggleHabit(id) {
  var updated = await apiFetch('/api/completions/toggle/', { method: 'PATCH', body: { habitId: id } });

  var idx = habits.findIndex(function(h) { return h.id === id; });
  if (idx !== -1) habits[idx].completed = updated.completed;

  renderToday();
}

function selectColor(color) {
  selectedColor = color;

  var colorHtml = '';
  for (var i = 0; i < COLORS.length; i++) {
      colorHtml += buildColorBtn(COLORS[i]);
  }
  document.getElementById('colors-row').innerHTML = colorHtml;
}


async function addHabit() {
  var input = document.getElementById('habit-input');
  var name = input.value.trim();

  if (!name) {
      input.focus();
      return;
  }

  var newHabit = {
      id: habits.length.toString(),
      name: name,
      color: selectedColor
  };

  let habitResponse = await apiFetch('/api/habits', { method: 'POST', body: newHabit });
  habits.push(habitResponse);

  input.value = '';
  renderHabits();
}

function cancelAdd() {
  document.getElementById('habit-input').value = '';
  selectedColor = COLORS[0];
  renderHabits();
}

async function deleteHabit(id) {
  await apiFetch('/api/habits/' + id, { method: 'DELETE' });
  habits = habits.filter(function (habit) {
      return habit.id !== id;
  });

  renderHabits();
}

loadData();