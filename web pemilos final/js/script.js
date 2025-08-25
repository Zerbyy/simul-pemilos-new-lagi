// Data kandidat
const candidates = [
    {
        id: 1,
        name: "Ahmad Rizki",
        vision: "Mewujudkan OSIS yang aktif, kreatif, dan inovatif dengan meningkatkan kegiatan ekstrakurikuler dan memperkuat rasa kekeluargaan",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "Siti Nurhaliza",
        vision: "Menciptakan lingkungan sekolah yang nyaman dan kondusif untuk belajar dengan program-program yang menyenangkan dan bermanfaat",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "Budi Santoso",
        vision: "Memfokuskan pada pengembangan bakat siswa dan meningkatkan prestasi akademik maupun non-akademik sekolah",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    }
];

// Data admin
const adminCredentials = {
    username: "panlos",
    password: "panlosjaya"
};

// Data pemilih (biasanya dari database, di sini kita simpan di localStorage)
let voters = JSON.parse(localStorage.getItem('osis_voters')) || {};
let votes = JSON.parse(localStorage.getItem('osis_votes')) || {};
let students = JSON.parse(localStorage.getItem('osis_students')) || {};

// Inisialisasi jika pertama kali
if (Object.keys(votes).length === 0) {
    candidates.forEach(candidate => {
        votes[candidate.id] = 0;
    });
    localStorage.setItem('osis_votes', JSON.stringify(votes));
}

// Jika data siswa belum ada, buat data contoh
if (Object.keys(students).length === 0) {
    const sampleNames = [
        "Ahmad Rizki", "Siti Nurhaliza", "Budi Santoso", "Dewi Lestari", 
        "Eko Prasetyo", "Fitri Handayani", "Gunawan Wibisono", "Hesti Rahayu",
        "Indra Kurniawan", "Joko Susilo", "Kartika Sari", "Luki Hermawan",
        "Maya Wulandari", "Nina Safitri", "Oki Setiawan", "Putri Anggraini",
        "Rudi Hartono", "Sari Indah", "Tono Prabowo", "Umi Kulsum"
    ];
    
    sampleNames.forEach((name, index) => {
        const id = index + 1;
        students[id] = {
            name: name,
            class: `X-${Math.floor((index % 6) + 1)}`
        };
    });
    
    localStorage.setItem('osis_students', JSON.stringify(students));
}

// Elemen DOM
const loginPage = document.getElementById('login-page');
const candidatesPage = document.getElementById('candidates-page');
const votingPage = document.getElementById('voting-page');
const thankyouPage = document.getElementById('thankyou-page');
const adminPage = document.getElementById('admin-page');

const roleSelect = document.getElementById('role');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const usernameGroup = document.getElementById('username-group');
const passwordGroup = document.getElementById('password-group');
const nameGroup = document.getElementById('name-group');
const loginBtn = document.getElementById('login-btn');

const candidatesList = document.getElementById('candidates-list');
const confirmImg = document.getElementById('confirm-img');
const confirmName = document.getElementById('confirm-name');
const confirmVision = document.getElementById('confirm-vision');
const confirmVoteBtn = document.getElementById('confirm-vote');
const changeChoiceBtn = document.getElementById('change-choice');
const backToLoginBtn = document.getElementById('back-to-login');

const totalVotersElem = document.getElementById('total-voters');
const totalStudentsElem = document.getElementById('total-students');
const participationElem = document.getElementById('participation');
const adminResultsContainer = document.getElementById('admin-results-container');
const refreshResultsBtn = document.getElementById('refresh-results');
const logoutAdminBtn = document.getElementById('logout-admin');
const logoutStudentBtn = document.getElementById('logout-student');
const logoutVotingBtn = document.getElementById('logout-voting');

// Elemen baru untuk manajemen siswa
const resetVotesBtn = document.getElementById('reset-votes');
const manageStudentsBtn = document.getElementById('manage-students');
const studentManagementSection = document.getElementById('student-management');
const newNameInput = document.getElementById('new-name');
const newClassInput = document.getElementById('new-class');
const addStudentBtn = document.getElementById('add-student');
const generateStudentsBtn = document.getElementById('generate-students');
const studentsList = document.getElementById('students-list');

// Elemen untuk import Excel
const excelFileInput = document.getElementById('excel-file');
const importExcelBtn = document.getElementById('import-excel');
const downloadTemplateBtn = document.getElementById('download-template');

let selectedCandidate = null;
let currentVoter = null;

// Toggle form berdasarkan role
roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'admin') {
        usernameGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        nameGroup.style.display = 'none';
    } else {
        usernameGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        nameGroup.style.display = 'block';
    }
});

// Inisialisasi form
usernameGroup.style.display = 'none';
passwordGroup.style.display = 'none';

// Fungsi untuk menampilkan halaman
function showPage(page) {
    loginPage.classList.remove('active');
    candidatesPage.classList.remove('active');
    votingPage.classList.remove('active');
    thankyouPage.classList.remove('active');
    adminPage.classList.remove('active');
    
    page.classList.add('active');
}

// Event listener untuk login
loginBtn.addEventListener('click', () => {
    const role = roleSelect.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();
    
    if (role === 'admin') {
        if (username === adminCredentials.username && password === adminCredentials.password) {
            showAdminPage();
        } else {
            alert('Username atau password admin salah!');
        }
    } else {
        if (!name) {
            alert('Silakan masukkan nama Anda');
            return;
        }
        
        // Cari siswa berdasarkan nama
        let studentId = null;
        for (const id in students) {
            if (students[id].name.toLowerCase() === name.toLowerCase()) {
                studentId = id;
                break;
            }
        }
        
        if (!studentId) {
            alert('Nama tidak terdaftar sebagai siswa!');
            return;
        }
        
        // Cek apakah sudah voting
        if (voters[studentId]) {
            showThankYouPage();
        } else {
            currentVoter = studentId;
            showCandidates();
        }
    }
});

// Tampilkan daftar kandidat
function showCandidates() {
    candidatesList.innerHTML = '';
    
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name}" class="candidate-img">
            <div class="candidate-info">
                <h3 class="candidate-name">${candidate.name}</h3>
                <p class="candidate-vision">${candidate.vision}</p>
                <button class="select-candidate" data-id="${candidate.id}">Pilih Kandidat</button>
            </div>
        `;
        
        candidatesList.appendChild(card);
    });
    
    // Event listener untuk tombol pilih kandidat
    document.querySelectorAll('.select-candidate').forEach(button => {
        button.addEventListener('click', (e) => {
            const candidateId = parseInt(e.target.getAttribute('data-id'));
            selectedCandidate = candidates.find(c => c.id === candidateId);
            showVotingConfirmation();
        });
    });
    
    showPage(candidatesPage);
}

// Tampilkan konfirmasi voting
function showVotingConfirmation() {
    confirmImg.src = selectedCandidate.image;
    confirmName.textContent = selectedCandidate.name;
    confirmVision.textContent = selectedCandidate.vision;
    
    showPage(votingPage);
}

// Event listener untuk konfirmasi voting
confirmVoteBtn.addEventListener('click', () => {
    // Simpan vote
    votes[selectedCandidate.id]++;
    voters[currentVoter] = {
        candidateId: selectedCandidate.id,
        timestamp: new Date().toISOString()
    };
    
    // Update localStorage
    localStorage.setItem('osis_votes', JSON.stringify(votes));
    localStorage.setItem('osis_voters', JSON.stringify(voters));
    
    showThankYouPage();
});

// Tampilkan halaman terima kasih
function showThankYouPage() {
    showPage(thankyouPage);
}

// Event listener untuk ubah pilihan
changeChoiceBtn.addEventListener('click', () => {
    showCandidates();
});

// Tampilkan halaman admin
function showAdminPage() {
    // Hitung statistik
    const totalVoters = Object.keys(voters).length;
    const totalStudents = Object.keys(students).length;
    const participation = totalStudents > 0 ? (totalVoters / totalStudents) * 100 : 0;
    
    // Update elemen statistik
    totalVotersElem.textContent = totalVoters;
    totalStudentsElem.textContent = totalStudents;
    participationElem.textContent = participation.toFixed(1) + '%';
    
    // Tampilkan hasil voting
    adminResultsContainer.innerHTML = '';
    
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
    
    candidates.forEach(candidate => {
        const voteCount = votes[candidate.id] || 0;
        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h3>${candidate.name}</h3>
            <div class="result-bar-container">
                <div class="result-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="result-info">
                <span>${voteCount} suara</span>
                <span>${percentage.toFixed(1)}%</span>
            </div>
        `;
        
        adminResultsContainer.appendChild(resultItem);
    });
    
    // Animate the result bars
    setTimeout(() => {
        document.querySelectorAll('.result-bar').forEach(bar => {
            bar.style.width = bar.style.width;
        });
    }, 100);
    
    // Sembunyikan manajemen siswa
    studentManagementSection.style.display = 'none';
    
    showPage(adminPage);
}

// Event listener untuk reset voting
resetVotesBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mereset semua hasil voting? Tindakan ini tidak dapat dibatalkan.')) {
        // Reset votes
        candidates.forEach(candidate => {
            votes[candidate.id] = 0;
        });
        
        // Reset voters
        voters = {};
        
        // Update localStorage
        localStorage.setItem('osis_votes', JSON.stringify(votes));
        localStorage.setItem('osis_voters', JSON.stringify(voters));
        
        alert('Hasil voting berhasil direset!');
        showAdminPage();
    }
});

// Event listener untuk mengelola siswa
manageStudentsBtn.addEventListener('click', () => {
    studentManagementSection.style.display = studentManagementSection.style.display === 'none' ? 'block' : 'none';
    renderStudentsList();
});

// Event listener untuk menambah siswa
addStudentBtn.addEventListener('click', () => {
    const name = newNameInput.value.trim();
    const studentClass = newClassInput.value.trim();
    
    if (!name || !studentClass) {
        alert('Semua field harus diisi!');
        return;
    }
    
    // Cek apakah nama sudah terdaftar
    let nameExists = false;
    for (const id in students) {
        if (students[id].name.toLowerCase() === name.toLowerCase()) {
            nameExists = true;
            break;
        }
    }
    
    if (nameExists) {
        alert('Nama sudah terdaftar!');
        return;
    }
    
    // Generate ID baru
    const newId = Object.keys(students).length > 0 
        ? Math.max(...Object.keys(students).map(id => parseInt(id))) + 1 
        : 1;
    
    // Tambahkan siswa baru
    students[newId] = {
        name: name,
        class: studentClass
    };
    
    // Update localStorage
    localStorage.setItem('osis_students', JSON.stringify(students));
    
    // Reset form
    newNameInput.value = '';
    newClassInput.value = '';
    
    alert('Siswa berhasil ditambahkan!');
    renderStudentsList();
    showAdminPage();
});

// Event listener untuk generate data contoh
generateStudentsBtn.addEventListener('click', () => {
    if (confirm('Generate data contoh akan menimpa data siswa yang sudah ada. Lanjutkan?')) {
        students = {};
        
        const sampleNames = [
            "Ahmad Rizki", "Siti Nurhaliza", "Budi Santoso", "Dewi Lestari", 
            "Eko Prasetyo", "Fitri Handayani", "Gunawan Wibisono", "Hesti Rahayu",
            "Indra Kurniawan", "Joko Susilo", "Kartika Sari", "Luki Hermawan",
            "Maya Wulandari", "Nina Safitri", "Oki Setiawan", "Putri Anggraini",
            "Rudi Hartono", "Sari Indah", "Tono Prabowo", "Umi Kulsum"
        ];
        
        sampleNames.forEach((name, index) => {
            const id = index + 1;
            students[id] = {
                name: name,
                class: `X-${Math.floor((index % 6) + 1)}`
            };
        });
        
        // Update localStorage
        localStorage.setItem('osis_students', JSON.stringify(students));
        
        alert('Data contoh berhasil digenerate!');
        renderStudentsList();
        showAdminPage();
    }
});

// Fungsi untuk merender daftar siswa
function renderStudentsList() {
    studentsList.innerHTML = '';
    
    for (const id in students) {
        const student = students[id];
        const hasVoted = voters[id] ? 'Sudah' : 'Belum';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${hasVoted}</td>
            <td>
                <button class="button-danger delete-student" data-id="${id}">Hapus</button>
            </td>
        `;
        
        studentsList.appendChild(row);
    }
    
    // Event listener untuk tombol hapus
    document.querySelectorAll('.delete-student').forEach(button => {
        button.addEventListener('click', (e) => {
            const idToDelete = e.target.getAttribute('data-id');
            
            if (confirm(`Apakah Anda yakin ingin menghapus siswa dengan ID ${idToDelete}?`)) {
                delete students[idToDelete];
                localStorage.setItem('osis_students', JSON.stringify(students));
                renderStudentsList();
                showAdminPage();
            }
        });
    });
}

// Event listener untuk import Excel
importExcelBtn.addEventListener('click', handleExcelImport);

function handleExcelImport() {
    const file = excelFileInput.files[0];
    
    if (!file) {
        alert('Silakan pilih file Excel terlebih dahulu!');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Ambil sheet pertama
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Konversi ke JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['name', 'class'] });
            
            // Lewati baris pertama (header)
            const studentsData = jsonData.slice(1);
            
            if (studentsData.length === 0) {
                alert('Tidak ada data siswa yang ditemukan dalam file!');
                return;
            }
            
            if (confirm(`Akan mengimpor ${studentsData.length} data siswa. Lanjutkan?`)) {
                // Hitung ID terakhir
                let lastId = Object.keys(students).length > 0 
                    ? Math.max(...Object.keys(students).map(id => parseInt(id))) 
                    : 0;
                
                // Tambahkan siswa dari Excel
                let importedCount = 0;
                studentsData.forEach((student, index) => {
                    if (student.name && student.class) {
                        // Cek apakah nama sudah ada
                        let exists = false;
                        for (const id in students) {
                            if (students[id].name.toLowerCase() === student.name.toLowerCase()) {
                                exists = true;
                                break;
                            }
                        }
                        
                        if (!exists) {
                            lastId++;
                            students[lastId] = {
                                name: student.name,
                                class: student.class
                            };
                            importedCount++;
                        }
                    }
                });
                
                // Update localStorage
                localStorage.setItem('osis_students', JSON.stringify(students));
                
                alert(`Berhasil mengimpor ${importedCount} data siswa! ${studentsData.length - importedCount} data duplikat diabaikan.`);
                renderStudentsList();
                showAdminPage();
            }
        } catch (error) {
            console.error('Error processing Excel file:', error);
            alert('Terjadi kesalahan saat memproses file Excel. Pastikan format file benar.');
        }
    };
    
    reader.onerror = function() {
        alert('Terjadi kesalahan saat membaca file. Silakan coba lagi.');
    };
    
    reader.readAsArrayBuffer(file);
}

// Event listener untuk download template
downloadTemplateBtn.addEventListener('click', downloadExcelTemplate);

function downloadExcelTemplate() {
    try {
        // Buat workbook baru
        const wb = XLSX.utils.book_new();
        
        // Data untuk template
        const templateData = [
            ['Nama Siswa', 'Kelas'], // Header
            ['Ahmad Rizki', 'X IPA 1'],
            ['Siti Nurhaliza', 'X IPS 2'],
            ['Budi Santoso', 'XI IPA 3']
        ];
        
        // Buat worksheet dari data
        const ws = XLSX.utils.aoa_to_sheet(templateData);
        
        // Tambahkan worksheet ke workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
        
        // Simpan file
        XLSX.writeFile(wb, 'Template_Data_Siswa.xlsx');
    } catch (error) {
        console.error('Error creating template:', error);
        alert('Terjadi kesalahan saat membuat template. Silakan coba lagi.');
    }
}

// Event listener untuk refresh hasil
refreshResultsBtn.addEventListener('click', showAdminPage);

// Event listener untuk logout admin
logoutAdminBtn.addEventListener('click', () => {
    usernameInput.value = '';
    passwordInput.value = '';
    showPage(loginPage);
});

// Event listener untuk logout siswa
logoutStudentBtn.addEventListener('click', () => {
    nameInput.value = '';
    showPage(loginPage);
});

// Event listener untuk logout dari halaman voting
logoutVotingBtn.addEventListener('click', () => {
    nameInput.value = '';
    showPage(loginPage);
});

// Event listener untuk kembali ke login
backToLoginBtn.addEventListener('click', () => {
    nameInput.value = '';
    showPage(loginPage);
});

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
    // Pastikan semua halaman tersembunyi kecuali login
    showPage(loginPage);
    
    // Render daftar siswa jika diperlukan
    if (studentsList) {
        renderStudentsList();
    }
});