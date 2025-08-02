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
  if (isNaN(jumlah) || jumlah <= 0) {
    alert("Masukkan jumlah tabungan yang valid.");
    return;
  }

  // Get current date in local timezone
  const today = new Date();
  const tanggal = today.getFullYear() + '-' + 
                 String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(today.getDate()).padStart(2, '0');
  
  console.log("Menambah tabungan:", { tanggal, jumlah }); // Debug log
  
  tabungan.push({ tanggal, jumlah });
  localStorage.setItem("tabungan", JSON.stringify(tabungan));
  
  console.log("Data tabungan sekarang:", tabungan); // Debug log
  
  document.getElementById("jumlah").value = "";
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
      li.textContent = `${item.tanggal} - Rp${item.jumlah.toLocaleString()}`;
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