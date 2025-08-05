let tabungan = JSON.parse(localStorage.getItem("tabungan")) || [];

// Debug: Check data on load
console.log("Data tabungan saat load:", tabungan);

// Function to clear all data (untuk debugging)
function clearAllData() {
  if (confirm("Hapus semua data tabungan?")) {
    localStorage.removeItem("tabungan");
    tabungan = [];
    render();
    console.log("Data tabungan telah dihapus");
  }
}

function tambahTabungan() {
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const tanggalInput = document.getElementById("tanggalTabungan").value;
  
  if (isNaN(jumlah) || jumlah <= 0) {
    alert("Masukkan jumlah tabungan yang valid.");
    return;
  }

  // Use selected date or current date
  let tanggal;
  if (tanggalInput) {
    tanggal = tanggalInput;
  } else {
    // Get current date in local timezone
    const today = new Date();
    tanggal = today.getFullYear() + '-' + 
              String(today.getMonth() + 1).padStart(2, '0') + '-' + 
              String(today.getDate()).padStart(2, '0');
  }
  
  console.log("Menambah tabungan:", { tanggal, jumlah }); // Debug log
  
  tabungan.push({ tanggal, jumlah });
  localStorage.setItem("tabungan", JSON.stringify(tabungan));
  
  console.log("Data tabungan sekarang:", tabungan); // Debug log
  
  document.getElementById("jumlah").value = "";
  document.getElementById("tanggalTabungan").value = "";
  render();
}

function render() {
  const list = document.getElementById("listTabungan");
  list.innerHTML = "";
  const filterTanggal = document.getElementById("filterTanggal").value;
  let total = 0;
  let totalHariIni = 0;
  
  // Get current date in local timezone
  const today = new Date();
  const hariIni = today.getFullYear() + '-' + 
                  String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(today.getDate()).padStart(2, '0');

  console.log("Hari ini:", hariIni); // Debug log
  console.log("Data tabungan:", tabungan); // Debug log

  tabungan.forEach((item, index) => {
    if (!filterTanggal || item.tanggal === filterTanggal) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      
      li.innerHTML = `
        <div class="savings-info">
          <span style="color: #667eea; font-weight: 600;">💰</span>
          <strong>${item.tanggal}</strong> - Rp${item.jumlah.toLocaleString()}
        </div>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editTabungan(${index})" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-delete" onclick="hapusTabungan(${index})" title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      
      list.appendChild(li);
    }
    total += item.jumlah;
    if (item.tanggal === hariIni) {
      totalHariIni += item.jumlah;
      console.log("Tabungan hari ini ditemukan:", item); // Debug log
    }
  });

  console.log("Total hari ini:", totalHariIni); // Debug log

  document.getElementById("totalSemua").innerHTML = `<i class="bi bi-piggy-bank"></i> Total tabungan: Rp${total.toLocaleString()}`;
  document.getElementById("statusHariIni").innerHTML = `<i class="bi bi-calendar-check"></i> Total hari ini: Rp${totalHariIni.toLocaleString()}`;
}

// Function to delete savings entry
function hapusTabungan(index) {
  const item = tabungan[index];
  if (confirm(`Hapus tabungan tanggal ${item.tanggal} sebesar Rp${item.jumlah.toLocaleString()}?`)) {
    tabungan.splice(index, 1);
    localStorage.setItem("tabungan", JSON.stringify(tabungan));
    render();
    
    // Show deletion notification
    showNotification(`🗑️ Tabungan tanggal ${item.tanggal} berhasil dihapus!`, 'warning');
  }
}

// Function to edit savings entry
function editTabungan(index) {
  const item = tabungan[index];
  showEditModal(index, item.tanggal, item.jumlah);
}

// Function to show edit modal
function showEditModal(index, tanggal, jumlah) {
  const modal = document.createElement('div');
  modal.className = 'edit-modal';
  modal.innerHTML = `
    <div class="edit-modal-content">
      <h3><i class="bi bi-pencil-square me-2"></i>Edit Tabungan</h3>
      <div class="form-group">
        <label for="editTanggal">📅 Tanggal:</label>
        <input type="date" id="editTanggal" value="${tanggal}">
      </div>
      <div class="form-group">
        <label for="editJumlah">💰 Jumlah (Rp):</label>
        <input type="number" id="editJumlah" value="${jumlah}" placeholder="Masukkan jumlah">
      </div>
      <div class="modal-buttons">
        <button class="btn-save" onclick="simpanEdit(${index})">
          <i class="bi bi-check-circle me-1"></i>Simpan
        </button>
        <button class="btn-cancel" onclick="tutupModal()">
          <i class="bi bi-x-circle me-1"></i>Batal
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Focus on amount input
  setTimeout(() => {
    document.getElementById('editJumlah').select();
  }, 100);
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      tutupModal();
    }
  });
}

// Function to save edited entry
function simpanEdit(index) {
  const tanggalBaru = document.getElementById('editTanggal').value;
  const jumlahBaru = parseInt(document.getElementById('editJumlah').value);
  
  if (!tanggalBaru || isNaN(jumlahBaru) || jumlahBaru <= 0) {
    alert('Masukkan tanggal dan jumlah yang valid!');
    return;
  }
  
  const itemLama = tabungan[index];
  tabungan[index] = { tanggal: tanggalBaru, jumlah: jumlahBaru };
  localStorage.setItem("tabungan", JSON.stringify(tabungan));
  
  tutupModal();
  render();
  
  // Show success notification
  showNotification(`✅ Tabungan berhasil diubah dari ${itemLama.tanggal} (Rp${itemLama.jumlah.toLocaleString()}) menjadi ${tanggalBaru} (Rp${jumlahBaru.toLocaleString()})!`, 'success');
}

// Function to close modal
function tutupModal() {
  const modal = document.querySelector('.edit-modal');
  if (modal) {
    modal.style.animation = 'modalSlideOut 0.3s ease forwards';
    setTimeout(() => modal.remove(), 300);
  }
}

// Function to show notifications
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const isMobile = window.innerWidth <= 768;
  
  let bgColor;
  switch(type) {
    case 'warning':
      bgColor = 'linear-gradient(135deg, #ffc107, #e0a800)';
      break;
    case 'error':
      bgColor = 'linear-gradient(135deg, #dc3545, #c82333)';
      break;
    default:
      bgColor = 'linear-gradient(135deg, #28a745, #20c997)';
  }
  
  notification.innerHTML = `
    <div style="
      position: fixed;
      ${isMobile ? 'top: 15px; left: 15px; right: 15px;' : 'top: 30px; right: 30px; max-width: 400px;'}
      background: ${bgColor};
      color: white;
      padding: ${isMobile ? '15px' : '20px 25px'};
      border-radius: 15px;
      font-weight: 600;
      font-size: ${isMobile ? '0.9rem' : '1rem'};
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10001;
      animation: slideInBounce 0.5s ease;
      text-align: center;
    ">
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutBounce 0.5s ease forwards';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function exportCSV() {
  if (tabungan.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  let csv = "Tanggal,Jumlah\n";
  tabungan.forEach(item => {
    csv += `${item.tanggal},${item.jumlah}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tabungan.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

render();