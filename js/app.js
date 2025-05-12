// Main application logic

document.addEventListener('DOMContentLoaded', () => {
  // View switching
  const studentViewBtn = document.getElementById('studentViewBtn');
  const teacherViewBtn = document.getElementById('teacherViewBtn');
  const studentView = document.getElementById('studentView');
  const teacherView = document.getElementById('teacherView');
  
  // Set up view switching
  if (studentViewBtn && teacherViewBtn) {
    studentViewBtn.addEventListener('click', () => {
      switchView(studentView, teacherView);
      studentViewBtn.classList.add('active');
      teacherViewBtn.classList.remove('active');
    });
    
    teacherViewBtn.addEventListener('click', () => {
      switchView(teacherView, studentView);
      teacherViewBtn.classList.add('active');
      studentViewBtn.classList.remove('active');
    });
  }
  
  // Animations for page load
  document.body.classList.add('loaded');
});

/**
 * Switch between views with animation
 * @param {HTMLElement} showView - The view to show
 * @param {HTMLElement} hideView - The view to hide
 */
function switchView(showView, hideView) {
  // Hide current view with animation
  hideView.style.opacity = '0';
  
  setTimeout(() => {
    hideView.classList.add('hidden');
    showView.classList.remove('hidden');
    
    // Force reflow to ensure transition works
    void showView.offsetWidth;
    
    // Show new view with animation
    showView.style.opacity = '1';
  }, 300);
}