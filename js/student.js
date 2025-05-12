// Student functionality

document.addEventListener('DOMContentLoaded', () => {
  setupAttendanceForm();
});

/**
 * Set up the attendance form submission
 */
function setupAttendanceForm() {
  const attendanceForm = document.getElementById('attendanceForm');
  const successMessage = document.getElementById('successMessage');
  
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const nombre = document.getElementById('nombre').value.trim();
      const matricula = document.getElementById('matricula').value.trim();
      const codigo = document.getElementById('codigoClase').value.trim();
      
      // Validate inputs
      if (!nombre || !matricula || !codigo) {
        alert('Por favor completa todos los campos');
        return;
      }
      
      try {
        // Get current date and time
        const ahora = new Date();
        const fecha = formatDateObject(ahora);
        const hora = ahora.toLocaleTimeString('es-MX');
        
        // Disable form while submitting
        const submitButton = attendanceForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        // Add attendance record to Firestore
        await db.collection('asistencias').add({
          nombre,
          matricula,
          codigo,
          fecha,
          hora,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Clear form
        attendanceForm.reset();
        
        // Show success message with animation
        toggleElementVisibility(successMessage, true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          toggleElementVisibility(successMessage, false);
        }, 3000);
        
      } catch (error) {
        handleError(error, 'Error al registrar asistencia');
      } finally {
        // Re-enable form
        const submitButton = attendanceForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-check-circle"></i> Pasar lista';
      }
    });
  }
}