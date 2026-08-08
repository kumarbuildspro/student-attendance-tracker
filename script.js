let students = JSON.parse(localStorage.getItem('students')) || [];

const studentForm = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const totalCount = document.getElementById('total-count');
const presentCount = document.getElementById('present-count');
const absentCount = document.getElementById('absent-count');

// Initialize App
function renderStudents() {
    studentList.innerHTML = '';
    let present = 0;
    let absent = 0;

    students.forEach((student, index) => {
        if (student.status === 'Present') present++;
        if (student.status === 'Absent') absent++;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${student.roll}</td>
            <td>${student.name}</td>
            <td>
                <button class="btn-status ${student.status.toLowerCase()}" onclick="toggleStatus(${index})">
                    ${student.status}
                </button>
            </td>
            <td>
                <button class="btn-delete" onclick="deleteStudent(${index})">🗑️</button>
            </td>
        `;
        studentList.appendChild(tr);
    });

    // Update Stats
    totalCount.textContent = students.length;
    presentCount.textContent = present;
    absentCount.textContent = absent;

    // Save to LocalStorage
    localStorage.setItem('students', JSON.stringify(students));
}

// Add Student
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const roll = document.getElementById('roll-no').value;

    students.push({
        name: name,
        roll: roll,
        status: 'Present' // Default Present
    });

    studentForm.reset();
    renderStudents();
});

// Toggle Status (Present <-> Absent)
function toggleStatus(index) {
    students[index].status = students[index].status === 'Present' ? 'Absent' : 'Present';
    renderStudents();
}

// Delete Student
function deleteStudent(index) {
    students.splice(index, 1);
    renderStudents();
}

// Initial Load
renderStudents();

// --- Service Worker Register Code ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered!'))
            .catch(err => console.log('Service Worker Failed!', err));
    });
}

// --- Custom Install / Shortcut Prompt Logic ---
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Browser ke default prompt ko roko
    e.preventDefault();
    deferredPrompt = e;
    
    // Hamara custom Install Button dikhao
    installBtn.style.display = 'inline-block';

    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        // Browser install prompt dikhao
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User ne Shortcut/App Install kar liya');
            }
            deferredPrompt = null;
        });
    });
});
