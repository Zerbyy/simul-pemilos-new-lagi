// Data kandidat
const candidates = [
    {
        id: 1,
        name: "Damar",
        vision: "Mewujudkan OSIS yang aktif, kreatif, dan inovatif dengan meningkatkan kegiatan ekstrakurikuler dan memperkuat rasa kekeluargaan",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "Sunshine",
        vision: "Menciptakan lingkungan sekolah yang nyaman dan kondusif untuk belajar dengan program-program yang menyenangkan dan bermanfaat",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "Ali",
        vision: "Memfokuskan pada pengembangan bakat siswa dan meningkatkan prestasi akademik maupun non-akademik sekolah",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    }
];

// Data admin
const adminCredentials = {
    username: "panlos",
    password: "panlosjaya"
};

// Fungsi untuk mendapatkan/menyimpan data dengan error handling
function getLocalStorageData(key, defaultValue = {}) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage for key ${key}:`, error);
        return defaultValue;
    }
}

function setLocalStorageData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage for key ${key}:`, error);
        alert('Terjadi kesalahan penyimpanan data. Silakan coba lagi.');
        return false;
    }
}

// Data pemilih (biasanya dari database, di sini kita simpan di localStorage)
let voters = getLocalStorageData('osis_voters', {});
let votes = getLocalStorageData('osis_votes', {});
let students = getLocalStorageData('osis_students', {});

// Inisialisasi jika pertama kali
if (Object.keys(votes).length === 0) {
    candidates.forEach(candidate => {
        votes[candidate.id] = 0;
    });
    setLocalStorageData('osis_votes', votes);
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
    
    setLocalStorageData('osis_students', students);
}

// Elemen DOM
let loginPage, candidatesPage, votingPage, thankyouPage, adminPage;
let roleSelect, usernameInput, passwordInput, nameInput, usernameGroup, passwordGroup, nameGroup, loginBtn;
let candidatesList, confirmImg, confirmName, confirmVision, confirmVoteBtn, changeChoiceBtn, backToLoginBtn;
let totalVotersElem, totalStudentsElem, participationElem, adminResultsContainer, refreshResultsBtn;
let logoutAdminBtn, logoutStudentBtn, logoutVotingBtn;
let resetVotesBtn, manageStudentsBtn, studentManagementSection, newNameInput, newClassInput;
let addStudentBtn, generateStudentsBtn, studentsList;
let excelFileInput, importExcelBtn, downloadTemplateBtn;

let selectedCandidate = null;
let currentVoter = null;

// Fungsi untuk mendapatkan elemen DOM dengan error handling
function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id ${id} not found`);
    }
    return element;
}

// Inisialisasi elemen DOM
function initializeElements() {
    loginPage = getElementByIdSafe('login-page');
    candidatesPage = getElementByIdSafe('candidates-page');
    votingPage = getElementByIdSafe('voting-page');
    thankyouPage = getElementByIdSafe('thankyou-page');
    adminPage = getElementByIdSafe('admin-page');
    
    roleSelect = getElementByIdSafe('role');
    usernameInput = getElementByIdSafe('username');
    passwordInput = getElementByIdSafe('password');
    nameInput = getElementByIdSafe('name');
    usernameGroup = getElementByIdSafe('username-group');
    passwordGroup = getElementByIdSafe('password-group');
    nameGroup = getElementByIdSafe('name-group');
    loginBtn = getElementByIdSafe('login-btn');
    
    candidatesList = getElementByIdSafe('candidates-list');
    confirmImg = getElementByIdSafe('confirm-img');
    confirmName = getElementByIdSafe('confirm-name');
    confirmVision = getElementByIdSafe('confirm-vision');
    confirmVoteBtn = getElementByIdSafe('confirm-vote');
    changeChoiceBtn = getElementByIdSafe('change-choice');
    backToLoginBtn = getElementByIdSafe('back-to-login');
    
    totalVotersElem = getElementByIdSafe('total-voters');
    totalStudentsElem = getElementByIdSafe('total-students');
    participationElem = getElementByIdSafe('participation');
    adminResultsContainer = getElementByIdSafe('admin-results-container');
    refreshResultsBtn = getElementByIdSafe('refresh-results');
    logoutAdminBtn = getElementByIdSafe('logout-admin');
    logoutStudentBtn = getElementByIdSafe('logout-student');
    logoutVotingBtn = getElementByIdSafe('logout-voting');
    
    resetVotesBtn = getElementByIdSafe('reset-votes');
    manageStudentsBtn = getElementByIdSafe('manage-students');
    studentManagementSection = getElementByIdSafe('student-management');
    newNameInput = getElementByIdSafe('new-name');
    newClassInput = getElementByIdSafe('new-class');
    addStudentBtn = getElementByIdSafe('add-student');
    generateStudentsBtn = getElementByIdSafe('generate-students');
    studentsList = getElementByIdSafe('students-list');
    
    excelFileInput = getElementByIdSafe('excel-file');
    importExcelBtn = getElementByIdSafe('import-excel');
    downloadTemplateBtn = getElementByIdSafe('download-template');
}

// Toggle form berdasarkan role
function setupRoleToggle() {
    if (!roleSelect) return;
    
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'admin') {
            if (usernameGroup) usernameGroup.style.display = 'block';
            if (passwordGroup) passwordGroup.style.display = 'block';
            if (nameGroup) nameGroup.style.display = 'none';
        } else {
            if (usernameGroup) usernameGroup.style.display = 'none';
            if (passwordGroup) passwordGroup.style.display = 'none';
            if (nameGroup) nameGroup.style.display = 'block';
        }
    });
}

// Inisialisasi form
function initializeForm() {
    if (usernameGroup) usernameGroup.style.display = 'none';
    if (passwordGroup) passwordGroup.style.display = 'none';
}

// Fungsi untuk menampilkan halaman
function showPage(page) {
    if (!page) return;
    
    const pages = [loginPage, candidatesPage, votingPage, thankyouPage, adminPage];
    pages.forEach(p => {
        if (p) p.classList.remove('active');
    });
    
    page.classList.add('active');
}

// Event listener untuk login
function setupLoginHandler() {
    if (!loginBtn) return;
    
    loginBtn.addEventListener('click', () => {
        if (!roleSelect || !nameInput) return;
        
        const role = roleSelect.value;
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
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
}

// Tampilkan daftar kandidat
function showCandidates() {
    if (!candidatesList) return;
    
    candidatesList.innerHTML = '';
    
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name}" class="candidate-img" onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia'">
            <div class="candidate-info">
                <h3 class="candidate-name">${candidate.name}</h3>
                <p class="candidate-vision">${candidate.vision}</p>
                <button class="select-candidate" data-id="${candidate.id}">Pilih Kandidat</button>
            </div>
        `;
        
        candidatesList.appendChild(card);
    });
    
    // Event listener untuk tombol pilih kandidat
    setTimeout(() => {
        document.querySelectorAll('.select-candidate').forEach(button => {
            button.addEventListener('click', (e) => {
                const candidateId = parseInt(e.target.getAttribute('data-id'));
                selectedCandidate = candidates.find(c => c.id === candidateId);
                showVotingConfirmation();
            });
        });
    }, 100);
    
    showPage(candidatesPage);
}

// Tampilkan konfirmasi voting
function showVotingConfirmation() {
    if (!confirmImg || !confirmName || !confirmVision) return;
    
    confirmImg.src = selectedCandidate.image;
    confirmImg.onerror = function() {
        this.src = 'https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia';
    };
    confirmName.textContent = selectedCandidate.name;
    confirmVision.textContent = selectedCandidate.vision;
    
    showPage(votingPage);
}

// Event listener untuk konfirmasi voting
function setupVoteConfirmation() {
    if (!confirmVoteBtn) return;
    
    confirmVoteBtn.addEventListener('click', () => {
        // Simpan vote
        votes[selectedCandidate.id]++;
        voters[currentVoter] = {
            candidateId: selectedCandidate.id,
            timestamp: new Date().toISOString()
        };
        
        // Update localStorage
        if (setLocalStorageData('osis_votes', votes)) {
            setLocalStorageData('osis_voters', voters);
        }
        
        showThankYouPage();
    });
}

// Tampilkan halaman terima kasih
function showThankYouPage() {
    showPage(thankyouPage);
}

// Event listener untuk ubah pilihan
function setupChangeChoiceHandler() {
    if (!changeChoiceBtn) return;
    
    changeChoiceBtn.addEventListener('click', () => {
        showCandidates();
    });
}

// Tampilkan halaman admin
function showAdminPage() {
    // Hitung statistik
    const totalVoters = Object.keys(voters).length;
    const totalStudents = Object.keys(students).length;
    const participation = totalStudents > 0 ? (totalVoters / totalStudents) * 100 : 0;
    
    // Update elemen statistik
    if (totalVotersElem) totalVotersElem.textContent = totalVoters;
    if (totalStudentsElem) totalStudentsElem.textContent = totalStudents;
    if (participationElem) participationElem.textContent = participation.toFixed(1) + '%';
    
    // Tampilkan hasil voting
    if (adminResultsContainer) {
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
    }
    
    // Sembunyikan manajemen siswa
    if (studentManagementSection) {
        studentManagementSection.style.display = 'none';
    }
    
    showPage(adminPage);
}

// Event listener untuk reset voting
function setupResetVotesHandler() {
    if (!resetVotesBtn) return;
    
    resetVotesBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset semua hasil voting? Tindakan ini tidak dapat dibatalkan.')) {
            // Reset votes
            candidates.forEach(candidate => {
                votes[candidate.id] = 0;
            });
            
            // Reset voters
            voters = {};
            
            // Update localStorage
            if (setLocalStorageData('osis_votes', votes)) {
                setLocalStorageData('osis_voters', voters);
            }
            
            alert('Hasil voting berhasil direset!');
            showAdminPage();
        }
    });
}

// Event listener untuk mengelola siswa
function setupManageStudentsHandler() {
    if (!manageStudentsBtn || !studentManagementSection) return;
    
    manageStudentsBtn.addEventListener('click', () => {
        studentManagementSection.style.display = studentManagementSection.style.display === 'none' ? 'block' : 'none';
        renderStudentsList();
    });
}

// Event listener untuk menambah siswa
function setupAddStudentHandler() {
    if (!addStudentBtn || !newNameInput || !newClassInput) return;
    
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
        if (setLocalStorageData('osis_students', students)) {
            // Reset form
            newNameInput.value = '';
            newClassInput.value = '';
            
            alert('Siswa berhasil ditambahkan!');
            renderStudentsList();
            showAdminPage();
        }
    });
}

// Event listener untuk generate data contoh
function setupGenerateStudentsHandler() {
    if (!generateStudentsBtn) return;
    
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
            if (setLocalStorageData('osis_students', students)) {
                alert('Data contoh berhasil digenerate!');
                renderStudentsList();
                showAdminPage();
            }
        }
    });
}

// Fungsi untuk merender daftar siswa
function renderStudentsList() {
    if (!studentsList) return;
    
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
    setTimeout(() => {
        document.querySelectorAll('.delete-student').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = e.target.getAttribute('data-id');
                
                if (confirm(`Apakah Anda yakin ingin menghapus siswa dengan ID ${idToDelete}?`)) {
                    delete students[idToDelete];
                    if (setLocalStorageData('osis_students', students)) {
                        renderStudentsList();
                        showAdminPage();
                    }
                }
            });
        });
    }, 100);
}

// Event listener untuk import Excel
function setupExcelImportHandler() {
    if (!importExcelBtn || !excelFileInput) return;
    
    importExcelBtn.addEventListener('click', handleExcelImport);
}

function handleExcelImport() {
    const file = excelFileInput.files[0];
    
    if (!file) {
        alert('Silakan pilih file Excel terlebih dahulu!');
        return;
    }
    
    // Validasi ukuran file (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
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
                if (setLocalStorageData('osis_students', students)) {
                    alert(`Berhasil mengimpor ${importedCount} data siswa! ${studentsData.length - importedCount} data duplikat diabaikan.`);
                    renderStudentsList();
                    showAdminPage();
                }
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
function setupDownloadTemplateHandler() {
    if (!downloadTemplateBtn) return;
    
    downloadTemplateBtn.addEventListener('click', downloadExcelTemplate);
}

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
function setupRefreshResultsHandler() {
    if (!refreshResultsBtn) return;
    
    refreshResultsBtn.addEventListener('click', showAdminPage);
}

// Event listener untuk logout
function setupLogoutHandlers() {
    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener('click', () => {
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            showPage(loginPage);
        });
    }
    
    if (logoutStudentBtn) {
        logoutStudentBtn.addEventListener('click', () => {
            if (nameInput) nameInput.value = '';
            showPage(loginPage);
        });
    }
    
    if (logoutVotingBtn) {
        logoutVotingBtn.addEventListener('click', () => {
            if (nameInput) nameInput.value = '';
            showPage(loginPage);
        });
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            if (nameInput) nameInput.value = '';
            showPage(loginPage);
        });
    }
}

// Inisialisasi semua handler
function initializeAllHandlers() {
    initializeElements();
    setupRoleToggle();
    initializeForm();
    setupLoginHandler();
    setupVoteConfirmation();
    setupChangeChoiceHandler();
    setupResetVotesHandler();
    setupManageStudentsHandler();
    setupAddStudentHandler();
    setupGenerateStudentsHandler();
    setupExcelImportHandler();
    setupDownloadTemplateHandler();
    setupRefreshResultsHandler();
    setupLogoutHandlers();
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeAllHandlers();
        // Pastikan semua halaman tersembunyi kecuali login
        showPage(loginPage);
        
        // Render daftar siswa jika diperlukan
        renderStudentsList();
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman.');
    }
});
