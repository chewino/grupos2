// Teacher functionality

let attendanceData = [];
let currentSort = {
  property: 'timestamp',
  direction: 'desc'
};

document.addEventListener('DOMContentLoaded', () => {
  setupFilters();
  setupExportButton();
  loadAttendanceData();
});

/**
 * Set up filter event listeners
 */
function setupFilters() {
  const codigoFilter = document.getElementById('filtroCodigo');
  const fechaFilter = document.getElementById('filtroFecha');
  const nombreFilter = document.getElementById('filtroNombre');
  
  if (codigoFilter) {
    codigoFilter.addEventListener('input', () => {
      applyFilters();
    });
  }
  
  if (fechaFilter) {
    fechaFilter.addEventListener('input', () => {
      applyFilters();
    });
  }
  
  if (nombreFilter) {
    nombreFilter.addEventListener('input', () => {
      applyFilters();
    });
  }
  
  // Setup sortable headers
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const property = header.textContent.trim().toLowerCase();
      sortData(property);
    });
  });
}

/**
 * Set up Excel export functionality
 */
function setupExportButton() {
  const exportButton = document.getElementById('exportarBtn');
  
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      exportDataToExcel();
    });
  }
}

/**
 * Load attendance data from Firestore
 */
function loadAttendanceData() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const noRecordsMessage = document.getElementById('noRecordsMessage');
  
  toggleElementVisibility(loadingIndicator, true);
  toggleElementVisibility(noRecordsMessage, false);
  
  db.collection('asistencias')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      attendanceData = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        attendanceData.push({
          id: doc.id,
          ...data
        });
      });
      
      toggleElementVisibility(loadingIndicator, false);
      applyFilters();
    }, error => {
      console.error('Error loading attendance data:', error);
      toggleElementVisibility(loadingIndicator, false);
    });
}

/**
 * Apply filters to the attendance data
 */
function applyFilters() {
  const codigoFilter = document.getElementById('filtroCodigo').value.trim().toLowerCase();
  const fechaFilter = document.getElementById('filtroFecha').value;
  const nombreFilter = document.getElementById('filtroNombre').value.trim().toLowerCase();
  const registrosTable = document.getElementById('registros');
  const recordCount = document.getElementById('recordCount');
  const noRecordsMessage = document.getElementById('noRecordsMessage');
  
  let filteredData = [...attendanceData];
  
  // Apply codigo filter
  if (codigoFilter) {
    filteredData = filteredData.filter(item => 
      item.codigo.toLowerCase().includes(codigoFilter)
    );
  }
  
  // Apply fecha filter
  if (fechaFilter) {
    const filterDate = formatDate(fechaFilter);
    filteredData = filteredData.filter(item => item.fecha === filterDate);
  }
  
  // Apply nombre filter
  if (nombreFilter) {
    filteredData = filteredData.filter(item => 
      item.nombre.toLowerCase().includes(nombreFilter)
    );
  }
  
  // Apply sorting
  filteredData = sortDataByProperty(filteredData, currentSort.property, currentSort.direction);
  
  // Update record count
  recordCount.textContent = filteredData.length;
  
  // Check if we have data to display
  if (filteredData.length === 0) {
    toggleElementVisibility(noRecordsMessage, true);
    registrosTable.innerHTML = '';
  } else {
    toggleElementVisibility(noRecordsMessage, false);
    
    // Render the table
    renderAttendanceTable(filteredData);
  }
}

/**
 * Render the attendance table with the provided data
 * @param {Array} data - The data to render
 */
function renderAttendanceTable(data) {
  const registrosTable = document.getElementById('registros');
  
  // Clear current table content
  registrosTable.innerHTML = '';
  
  // Add rows
  data.forEach(item => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.matricula}</td>
      <td>${item.codigo}</td>
      <td>${item.fecha}</td>
      <td>${item.hora}</td>
    `;
    
    registrosTable.appendChild(row);
  });
}

/**
 * Sort the data by a specific property
 * @param {string} property - The property to sort by
 */
function sortData(property) {
  // Toggle direction if same property
  if (currentSort.property === property) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.property = property;
    currentSort.direction = 'asc';
  }
  
  // Update headers to show sort direction
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    const headerProperty = header.textContent.trim().toLowerCase();
    header.querySelector('i').className = 'fas fa-sort';
    
    if (headerProperty === property) {
      header.querySelector('i').className = currentSort.direction === 'asc' 
        ? 'fas fa-sort-up' 
        : 'fas fa-sort-down';
    }
  });
  
  // Apply filters with new sort
  applyFilters();
}

/**
 * Sort an array of data by a property
 * @param {Array} data - The data to sort
 * @param {string} property - The property to sort by
 * @param {string} direction - The sort direction ('asc' or 'desc')
 * @returns {Array} - The sorted data
 */
function sortDataByProperty(data, property, direction) {
  return [...data].sort((a, b) => {
    let comparison = 0;
    
    // Special case for timestamp
    if (property === 'timestamp' && a.timestamp && b.timestamp) {
      comparison = a.timestamp.seconds - b.timestamp.seconds;
    } else {
      // General case
      const valueA = a[property] ? a[property].toString().toLowerCase() : '';
      const valueB = b[property] ? b[property].toString().toLowerCase() : '';
      
      if (valueA < valueB) {
        comparison = -1;
      } else if (valueA > valueB) {
        comparison = 1;
      }
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Export the filtered data to Excel
 */
function exportDataToExcel() {
  // Get currently filtered data
  const codigoFilter = document.getElementById('filtroCodigo').value.trim().toLowerCase();
  const fechaFilter = document.getElementById('filtroFecha').value;
  const nombreFilter = document.getElementById('filtroNombre').value.trim().toLowerCase();
  
  let dataToExport = [...attendanceData];
  
  // Apply filters
  if (codigoFilter) {
    dataToExport = dataToExport.filter(item => 
      item.codigo.toLowerCase().includes(codigoFilter)
    );
  }
  
  if (fechaFilter) {
    const filterDate = formatDate(fechaFilter);
    dataToExport = dataToExport.filter(item => item.fecha === filterDate);
  }
  
  if (nombreFilter) {
    dataToExport = dataToExport.filter(item => 
      item.nombre.toLowerCase().includes(nombreFilter)
    );
  }
  
  // Apply sort
  dataToExport = sortDataByProperty(dataToExport, currentSort.property, currentSort.direction);
  
  // Format data for Excel
  const excelData = dataToExport.map(item => ({
    'Nombre': item.nombre,
    'Matrícula': item.matricula,
    'Código de clase': item.codigo,
    'Fecha': item.fecha,
    'Hora': item.hora
  }));
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');
  
  // Generate filename with current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = `asistencias_${dateStr}.xlsx`;
  
  // Export
  XLSX.writeFile(workbook, filename);
}