let tabungan = JSON.parse(localStorage.getItem("tabungan")) || [];

function tambahTabungan() {
  const jumlah = parseInt(document.getElementById("jumlah").value);
  if (isNaN(jumlah) || jumlah <= 0) {
    alert("Masukkan jumlah tabungan yang valid.");
    return;
  }

  const tanggal = new Date().toISOString().split("T")[0];
  tabungan.push({ tanggal, jumlah });
  localStorage.setItem("tabungan", JSON.stringify(tabungan));
  document.getElementById("jumlah").value = "";
  render();
}

function render() {
  const list = document.getElementById("listTabungan");
  list.innerHTML = "";
  const filterTanggal = document.getElementById("filterTanggal").value;
  let total = 0;
  let totalHariIni = 0;
  const hariIni = new Date().toISOString().split("T")[0];

  tabungan.forEach(item => {
    if (!filterTanggal || item.tanggal === filterTanggal) {
      const li = document.createElement("li");
      li.textContent = `${item.tanggal} - Rp${item.jumlah.toLocaleString()}`;
      list.appendChild(li);
    }
    total += item.jumlah;
    if (item.tanggal === hariIni) {
      totalHariIni += item.jumlah;
    }
  });

  document.getElementById("totalSemua").textContent = `Total tabungan: Rp${total.toLocaleString()}`;
  document.getElementById("statusHariIni").textContent = `Total hari ini: Rp${totalHariIni.toLocaleString()}`;
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
