// Simulasi data perangkat awal
let devices = [
    { name: "DNS Server", ip: "192.168.100.5" },
    { name: "Web Server", ip: "192.168.100.6" },
    { name: "Router 1", ip: "192.168.100.1" },
    { name: "Router 2", ip: "192.168.100.2" },
    { name: "Client 1", ip: "192.168.100.7" },
    { name: "Client 2", ip: "192.168.100.4" },
];

// Daftar IP Address yang dipaksa offline
const offlineDevices = ["192.168.100.4", "192.168.100.2"];

// Fungsi untuk menghitung "latensi" simulasi
function simulatePing(ip) {
    return new Promise((resolve) => {
        const latency = Math.floor(Math.random() * 500) + 1; // Simulasi 1-100 ms
        setTimeout(() => {
            const isOnline = !offlineDevices.includes(ip);
            resolve({ ip, latency, isOnline });
        }, 500);
    });
}

// Fungsi untuk memperbarui tabel
async function updateTable() {
    const tableBody = document.getElementById("device-table");
    tableBody.innerHTML = ""; // Kosongkan tabel

    for (const device of devices) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.ip}</td>
            <td id="status-${device.ip}">Checking...</td>
            <td id="latency-${device.ip}">-</td>
            <td><button class="ping-button" onclick="checkDevice('${device.ip}')">Ping</button></td>
        `;
        tableBody.appendChild(row);

        checkDevice(device.ip);
    }
}

// Fungsi untuk melakukan ping ke perangkat
async function checkDevice(ip) {
    const statusCell = document.getElementById(`status-${ip}`);
    const latencyCell = document.getElementById(`latency-${ip}`);

    statusCell.textContent = "Checking...";
    latencyCell.textContent = "-";

    const result = await simulatePing(ip);

    if (result.isOnline) {
        statusCell.textContent = "Online";
        statusCell.className = "status-online";
        latencyCell.textContent = `${result.latency} ms`;
    } else {
        statusCell.textContent = "Offline";
        statusCell.className = "status-offline";
        latencyCell.textContent = "-";
    }
}

// Fungsi untuk menambahkan perangkat baru
function addDevice() {
    const nameInput = document.getElementById("device-name");
    const ipInput = document.getElementById("device-ip");

    const name = nameInput.value.trim();
    const ip = ipInput.value.trim();

    if (name === "" || ip === "") {
        alert("Nama perangkat dan IP Address harus diisi!");
        return;
    }

    // Validasi format IP sederhana
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    if (!ipPattern.test(ip)) {
        alert("Format IP Address tidak valid!");
        return;
    }

    devices.push({ name, ip });
    nameInput.value = "";
    ipInput.value = "";
    updateTable();
}

// Inisialisasi tabel
updateTable();
