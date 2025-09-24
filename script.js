// Global variables
let currentUser = null;
let currentUserType = '';

// Sample data
const books = [
    { id: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', status: 'Available', location: 'A-101' },
    { id: 'B002', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', status: 'Issued', location: 'A-102' },
    { id: 'B003', title: '1984', author: 'George Orwell', category: 'Dystopian', status: 'Available', location: 'A-103' }
];

const members = [
    { id: 'M001', name: 'John Doe', email: 'john@email.com', phone: '+91-9876543210', duration: '12 months', status: 'Active' },
    { id: 'M002', name: 'Jane Smith', email: 'jane@email.com', phone: '+91-9876543211', duration: '6 months', status: 'Expired' }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 15);
    
    document.getElementById('issueDate').value = today;
    document.getElementById('issueDate').min = today;
    document.getElementById('returnDate').value = returnDate.toISOString().split('T')[0];
    document.getElementById('actualReturnDate').value = today;
});

// Login functions
function showLogin(type) {
    currentUserType = type;
    document.getElementById('loginForm').style.display = 'block';
    document.querySelector('.user-type-buttons').style.display = 'none';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (username && password) {
        if ((currentUserType === 'admin' && username === 'admin' && password === 'admin123') ||
            (currentUserType === 'user' && username === 'user' && password === 'user123')) {
            
            currentUser = username;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('logoutBtn').style.display = 'block';
            
            setupNavigation();
            showSection('dashboard');
        } else {
            showError('loginError', 'Invalid username or password');
        }
    } else {
        showError('loginError', 'Please enter username and password');
    }
}

function logout() {
    currentUser = null;
    currentUserType = '';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.querySelector('.user-type-buttons').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideError('loginError');
}

// Navigation setup
function setupNavigation() {
    const navMenu = document.getElementById('navMenu');
    let navButtons = [
        { id: 'dashboard', text: '📊 Dashboard', section: 'dashboard' }
    ];

    if (currentUserType === 'admin') {
        navButtons = navButtons.concat([
            { id: 'issueBook', text: '📤 Issue Book', section: 'issueBook' },
            { id: 'returnBook', text: '📥 Return Book', section: 'returnBook' },
            { id: 'finePayment', text: '💰 Fine Payment', section: 'finePayment' },
            { id: 'checkAvailability', text: '🔍 Check Availability', section: 'checkAvailability' },
            { id: 'membership', text: '👥 Membership', section: 'membership' },
            { id: 'bookManagement', text: '📚 Book Management', section: 'bookManagement' },
            { id: 'reports', text: '📊 Reports', section: 'reports' },
            { id: 'userManagement', text: '👤 User Management', section: 'userManagement' }
        ]);
    } else {
        navButtons = navButtons.concat([
            { id: 'issueBook', text: '📤 Issue Book', section: 'issueBook' },
            { id: 'returnBook', text: '📥 Return Book', section: 'returnBook' },
            { id: 'finePayment', text: '💰 Fine Payment', section: 'finePayment' },
            { id: 'checkAvailability', text: '🔍 Check Availability', section: 'checkAvailability' },
            { id: 'reports', text: '📊 My Transactions', section: 'reports' }
        ]);
    }

    navMenu.innerHTML = navButtons.map(btn => 
        `<button class="nav-btn" onclick="showSection('${btn.section}')">${btn.text}</button>`
    ).join('');
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Form handlers
function handleIssueBook(event) {
    event.preventDefault();
    
    const bookName = document.getElementById('issueBookName').value;
    const issueDate = document.getElementById('issueDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (!bookName || !issueDate || !returnDate) {
        showError('issueError', 'Please fill in all required fields');
        return false;
    }
    
    if (new Date(issueDate) < new Date().setHours(0,0,0,0)) {
        showError('issueError', 'Issue date cannot be less than today');
        return false;
    }
    
    // Auto-populate author based on book name
    const book = books.find(b => b.title.toLowerCase().includes(bookName.toLowerCase()));
    if (book) {
        document.getElementById('issueAuthor').value = book.author;
        showSuccess('issueSuccess', 'Book issued successfully!');
        event.target.reset();
        hideError('issueError');
    } else {
        showError('issueError', 'Book not found in library');
    }
    
    return false;
}

function handleReturnBook(event) {
    event.preventDefault();
    
    const bookName = document.getElementById('returnBookName').value;
    const serialNumber = document.getElementById('serialNumber').value;
    const returnDate = document.getElementById('actualReturnDate').value;
    
    if (!bookName || !serialNumber || !returnDate) {
        showError('returnError', 'Please fill in all required fields');
        return false;
    }
    
    // Auto-populate fields based on book
    const book = books.find(b => b.title.toLowerCase().includes(bookName.toLowerCase()));
    if (book) {
        document.getElementById('returnAuthor').value = book.author;
        document.getElementById('returnIssuedDate').value = '2025-09-10'; // Mock issue date
        showSuccess('returnSuccess', 'Book returned successfully!');
        event.target.reset();
        hideError('returnError');
    } else {
        showError('returnError', 'Book not found or not issued');
    }
    
    return false;
}

function handleFinePayment(event) {
    event.preventDefault();
    
    if (!document.getElementById('finePaidCheck').checked) {
        showError('fineError', 'Please confirm fine payment');
        return false;
    }
    
    showSuccess('fineSuccess', 'Fine payment processed successfully!');
    event.target.reset();
    hideError('fineError');
    return false;
}

function toggleFinePayment() {
    const isChecked = document.getElementById('finePaidCheck').checked;
    // Populate mock data when checked
    if (isChecked) {
        document.getElementById('fineBookName').value = 'Pride and Prejudice';
        document.getElementById('fineMemberName').value = 'Mike Johnson';
        document.getElementById('fineAmount').value = '95';
    }
}

function searchBooks() {
    const searchTerm = document.getElementById('searchBook').value.toLowerCase();
    const tableBody = document.getElementById('availabilityTableBody');
    
    if (!searchTerm) {
        showError('checkError', 'Please enter a search term');
        return;
    }
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    
    tableBody.innerHTML = filteredBooks.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td><span class="status-badge ${book.status === 'Available' ? 'status-active' : 'status-overdue'}">${book.status}</span></td>
            <td>${book.location}</td>
            <td><input type="radio" name="bookSelect" value="${book.id}" ${book.status !== 'Available' ? 'disabled' : ''}></td>
        </tr>
    `).join('');
}

// Membership functions
function showMembershipSection(type) {
    document.querySelectorAll('.membership-section').forEach(section => {
        section.style.display = 'none';
    });
    
    if (type === 'add') {
        document.getElementById('addMembership').style.display = 'block';
    } else if (type === 'update') {
        document.getElementById('updateMembership').style.display = 'block';
    } else if (type === 'list') {
        document.getElementById('viewMembers').style.display = 'block';
    }
}

function handleAddMembership(event) {
    event.preventDefault();
    
    const name = document.getElementById('memberName').value;
    const duration = document.querySelector('input[name="duration"]:checked').value;
    
    if (!name) {
        showError('membershipError', 'Name is mandatory');
        return false;
    }
    
    showSuccess('membershipSuccess', `Member added successfully! Duration: ${duration} months`);
    event.target.reset();
    hideError('membershipError');
    return false;
}

function loadMemberDetails() {
    const memberNumber = document.getElementById('updateMemberNumber').value;
    if (memberNumber) {
        document.getElementById('updateMemberForm').style.display = 'block';
        showSuccess('membershipSuccess', 'Member details loaded successfully!');
    } else {
        showError('membershipError', 'Please enter membership number');
    }
}

function updateMembershipStatus() {
    const extension = document.querySelector('input[name="extension"]:checked').value;
    if (extension === 'cancel') {
        showSuccess('membershipSuccess', 'Membership cancelled successfully!');
    } else {
        showSuccess('membershipSuccess', `Membership extended by ${extension} months!`);
    }
}

// Book Management functions
function showBookSection(type) {
    document.querySelectorAll('.book-section').forEach(section => {
        section.style.display = 'none';
    });
    
    if (type === 'add') {
        document.getElementById('addBook').style.display = 'block';
    } else if (type === 'update') {
        document.getElementById('updateBook').style.display = 'block';
    } else if (type === 'list') {
        document.getElementById('viewBooks').style.display = 'block';
    }
}

function handleAddBook(event) {
    event.preventDefault();
    
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    
    if (!title || !author) {
        showError('bookError', 'Title and Author are mandatory fields');
        return false;
    }
    
    showSuccess('bookSuccess', `${category === 'book' ? 'Book' : 'Movie'} added successfully!`);
    event.target.reset();
    hideError('bookError');
    return false;
}

function loadBookDetails() {
    const bookId = document.getElementById('updateBookId').value;
    if (bookId) {
        document.getElementById('updateBookForm').style.display = 'block';
        // Mock data
        document.getElementById('updateBookTitle').value = 'Sample Book Title';
        document.getElementById('updateBookAuthor').value = 'Sample Author';
        showSuccess('bookSuccess', 'Book details loaded successfully!');
    } else {
        showError('bookError', 'Please enter book ID');
    }
}

function updateBookDetails() {
    const title = document.getElementById('updateBookTitle').value;
    const author = document.getElementById('updateBookAuthor').value;
    
    if (!title || !author) {
        showError('bookError', 'All fields are mandatory');
        return;
    }
    
    showSuccess('bookSuccess', 'Book updated successfully!');
}

// Report functions
function showReportSection(type) {
    document.querySelectorAll('.report-section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.getElementById(type === 'active' ? 'activeIssues' : 
                          type === 'overdue' ? 'overdueReturns' :
                          type === 'pending' ? 'pendingIssues' :
                          type === 'members' ? 'masterMembers' :
                          'masterBooks').style.display = 'block';
}

// User Management functions
function showUserSection(type) {
    document.querySelectorAll('.user-section').forEach(section => {
        section.style.display = 'none';
    });
    
    if (type === 'add') {
        document.getElementById('addUser').style.display = 'block';
    } else if (type === 'update') {
        document.getElementById('updateUser').style.display = 'block';
    } else if (type === 'list') {
        document.getElementById('viewUsers').style.display = 'block';
    }
}

function handleAddUser(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    if (!name) {
        showError('userError', 'Name is mandatory');
        return false;
    }
    
    showSuccess('userSuccess', `${userType === 'new' ? 'New' : 'Existing'} user added successfully!`);
    event.target.reset();
    hideError('userError');
    return false;
}

function loadUserDetails() {
    const userId = document.getElementById('updateUserId').value;
    if (userId) {
        document.getElementById('updateUserForm').style.display = 'block';
        // Mock data
        document.getElementById('updateUserName').value = 'Sample User';
        document.getElementById('updateUserEmail').value = 'sample@email.com';
        showSuccess('userSuccess', 'User details loaded successfully!');
    } else {
        showError('userError', 'Please enter user ID');
    }
}

function updateUserDetails() {
    const name = document.getElementById('updateUserName').value;
    const email = document.getElementById('updateUserEmail').value;
    
    if (!name || !email) {
        showError('userError', 'All fields are mandatory');
        return;
    }
    
    showSuccess('userSuccess', 'User updated successfully!');
}

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        hideError(elementId);
    }, 5000);
}

function hideError(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Form validation helpers
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#FF6B6B';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Auto-populate return date when issue date changes
document.addEventListener('DOMContentLoaded', function() {
    const issueDateInput = document.getElementById('issueDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (issueDateInput) {
        issueDateInput.addEventListener('change', function() {
            const issueDate = new Date(this.value);
            const returnDate = new Date(issueDate);
            returnDate.setDate(returnDate.getDate() + 15);
            returnDateInput.value = returnDate.toISOString().split('T')[0];
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                if (currentUserType === 'admin') showSection('issueBook');
                break;
            case '3':
                e.preventDefault();
                if (currentUserType === 'admin') showSection('returnBook');
                break;
            case 'l':
                e.preventDefault();
                logout();
                break;
        }
    }
});

// Real-time search for book availability
document.getElementById('searchBook').addEventListener('input', function() {
    if (this.value.length >= 3) {
        searchBooks();
    }
});

// Form auto-save functionality (using memory storage)
const formData = {};

function autoSaveForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (!formData[formId]) formData[formId] = {};
            formData[formId][this.id] = this.value;
        });
    });
}

function loadSavedForm(formId) {
    if (formData[formId]) {
        Object.keys(formData[formId]).forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = formData[formId][inputId];
            }
        });
    }
}

// Initialize auto-save for all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = ['issueBook', 'returnBook', 'addMembership', 'addBook', 'addUser'];
    forms.forEach(formId => {
        if (document.getElementById(formId)) {
            autoSaveForm(formId);
        }
    });
});

// Responsive table handling
function makeTablesResponsive() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        const wrapper = table.parentNode;
        if (window.innerWidth < 768) {
            wrapper.style.overflowX = 'auto';
        } else {
            wrapper.style.overflowX = 'visible';
        }
    });
}

window.addEventListener('resize', makeTablesResponsive);
document.addEventListener('DOMContentLoaded', makeTablesResponsive);

// Print functionality for reports
function printReport(sectionId) {
    const section = document.getElementById(sectionId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Library Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .status-badge { padding: 2px 8px; border-radius: 10px; font-size: 0.8em; }
                .status-active { background: #e8f5e8; color: #2e7d32; }
                .status-overdue { background: #ffebee; color: #c62828; }
                .status-pending { background: #fff3e0; color: #f57c00; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <h1>Library Management System</h1>
            <h2>Report Generated: ${new Date().toLocaleDateString()}</h2>
            ${section.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Export functionality
function exportToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    let csv = [];
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    csv.push(headers.join(','));
    
    // Get data rows
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => {
            return '"' + td.textContent.trim().replace(/"/g, '""') + '"';
        });
        csv.push(cells.join(','));
    });
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
