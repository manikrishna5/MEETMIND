const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const toggleDetails = document.getElementById('toggleDetails');
const detailsSection = document.getElementById('detailsSection');
const detailsInput = document.getElementById('detailsInput');
const detailsFileName = document.getElementById('detailsFileName');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');
const summarySection = document.getElementById('summarySection');

let mainFileUploaded = false;
let detailsExpanded = false;

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    fileName.textContent = `✓ ${file.name}`;
    fileName.style.display = 'inline-block';
    mainFileUploaded = true;
    submitBtn.disabled = false;
}

toggleDetails.addEventListener('click', () => {
    detailsExpanded = !detailsExpanded;
    detailsSection.classList.toggle('active');
    toggleDetails.textContent = detailsExpanded 
        ? 'Hide Participant Details' 
        : 'Add Participant Details (Optional)';
});

detailsInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        detailsFileName.textContent = `✓ ${e.target.files[0].name}`;
        detailsFileName.style.display = 'inline-block';
    }
});

submitBtn.addEventListener('click', () => {
    loading.classList.add('active');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        loading.classList.remove('active');
        summarySection.classList.add('active');
        summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2500);
});
