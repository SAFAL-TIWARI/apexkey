// Toast Notification System
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    this.toasts = [];
  }

  show(message, type = 'info', duration = 3000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => this.remove(toast), duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
      <i class="toast-icon ${icons[type]}"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="toastManager.remove(this.parentElement)">
        <i class="fas fa-times"></i>
      </button>
    `;

    return toast;
  }

  remove(toast) {
    if (toast && toast.parentElement) {
      toast.style.animation = 'slideOutToast 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }
  }

  success(message) {
    return this.show(message, 'success');
  }

  error(message) {
    return this.show(message, 'error');
  }

  warning(message) {
    return this.show(message, 'warning');
  }

  info(message) {
    return this.show(message, 'info');
  }
}

// Initialize Toast Manager
const toastManager = new ToastManager();

// Loading Overlay Manager
class LoadingManager {
  constructor() {
    this.overlay = document.getElementById('loadingOverlay');
  }

  show() {
    this.overlay.classList.add('active');
  }

  hide() {
    this.overlay.classList.remove('active');
  }
}

const loadingManager = new LoadingManager();

// Form Validation
class FormValidator {
  constructor() {
    this.rules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      password: {
        required: true,
        minLength: 6,
        message: 'Password must be at least 6 characters long'
      }
    };
  }

  validate(field, value) {
    const rule = this.rules[field];
    if (!rule) return { valid: true };

    if (rule.required && !value.trim()) {
      return { valid: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` };
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, message: rule.message };
    }

    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, message: rule.message };
    }

    return { valid: true };
  }

  validateForm(formData) {
    const errors = {};
    let isValid = true;

    for (const [field, value] of Object.entries(formData)) {
      const result = this.validate(field, value);
      if (!result.valid) {
        errors[field] = result.message;
        isValid = false;
      }
    }

    return { isValid, errors };
  }
}

const validator = new FormValidator();

// Main Application
class AuthApp {
  constructor() {
    this.currentMode = 'login';

    // Mode toggle elements
    this.loginModeBtn = document.getElementById('loginModeBtn');
    this.signupModeBtn = document.getElementById('signupModeBtn');
    this.loginContainer = document.getElementById('loginContainer');
    this.signupContainer = document.getElementById('signupContainer');

    // Login form elements
    this.loginForm = document.getElementById('loginForm');
    this.loginEmailInput = document.getElementById('loginEmail');
    this.loginPasswordInput = document.getElementById('loginPassword');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginPasswordToggle = document.getElementById('loginPasswordToggle');
    this.rememberCheckbox = document.getElementById('remember');

    // Signup form elements
    this.signupForm = document.getElementById('signupForm');
    this.firstNameInput = document.getElementById('firstName');
    this.lastNameInput = document.getElementById('lastName');
    this.signupEmailInput = document.getElementById('signupEmail');
    this.signupPasswordInput = document.getElementById('signupPassword');
    this.signupBtn = document.getElementById('signupBtn');
    this.signupPasswordToggle = document.getElementById('signupPasswordToggle');
    this.agreeTermsCheckbox = document.getElementById('agreeTerms');

    // Other elements
    this.dividerText = document.getElementById('dividerText');

    this.initializeEventListeners();
    this.showWelcomeMessage();
  }

  initializeEventListeners() {
    // Mode toggle
    this.loginModeBtn.addEventListener('click', () => this.switchMode('login'));
    this.signupModeBtn.addEventListener('click', () => this.switchMode('signup'));
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchMode('login');
    });

    // Form submissions
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));

    // Password toggles
    this.loginPasswordToggle.addEventListener('click', () => this.togglePassword('login'));
    this.signupPasswordToggle.addEventListener('click', () => this.togglePassword('signup'));

    // Input focus effects
    const allInputs = [
      this.loginEmailInput, this.loginPasswordInput,
      this.firstNameInput, this.lastNameInput,
      this.signupEmailInput, this.signupPasswordInput
    ];

    allInputs.forEach(input => {
      input.addEventListener('focus', (e) => this.handleInputFocus(e));
      input.addEventListener('blur', (e) => this.handleInputBlur(e));
      input.addEventListener('input', (e) => this.handleInputChange(e));
    });

    // Social login buttons
    document.getElementById('googleLogin').addEventListener('click', () => this.handleSocialLogin('Google'));
    document.getElementById('appleLogin').addEventListener('click', () => this.handleSocialLogin('Apple'));
    document.getElementById('linkedinLogin').addEventListener('click', () => this.handleSocialLogin('LinkedIn'));
    document.getElementById('githubLogin').addEventListener('click', () => this.handleSocialLogin('GitHub'));

    // Other links
    document.getElementById('forgotPassword').addEventListener('click', (e) => this.handleForgotPassword(e));
    document.getElementById('ssoLogin').addEventListener('click', (e) => this.handleSSOLogin(e));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  switchMode(mode) {
    this.currentMode = mode;

    if (mode === 'login') {
      this.loginModeBtn.classList.add('active');
      this.signupModeBtn.classList.remove('active');
      this.loginContainer.classList.remove('hidden');
      this.signupContainer.classList.add('hidden');
      this.dividerText.textContent = 'or sign in with';
    } else {
      this.signupModeBtn.classList.add('active');
      this.loginModeBtn.classList.remove('active');
      this.signupContainer.classList.remove('hidden');
      this.loginContainer.classList.add('hidden');
      this.dividerText.textContent = 'or sign up with';
    }
  }

  showWelcomeMessage() {
    setTimeout(() => {
      toastManager.info('Welcome to VisionCraft! Please sign in to continue.');
    }, 500);
  }

  async handleLogin(e) {
    e.preventDefault();

    const formData = {
      email: this.loginEmailInput.value,
      password: this.loginPasswordInput.value
    };

    // Validate form
    const validation = validator.validateForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toastManager.error(firstError);
      return;
    }

    // Show loading state
    this.setLoadingState('login', true);
    loadingManager.show();

    try {
      // Simulate API call
      // await this.simulateAuth(formData, 'login');

      // Success
      toastManager.success('Sign in feature Coming Soon!');

    } catch (error) {
      toastManager.error(error.message || 'Sign in failed. Please try again.');
    } finally {
      setTimeout(() => {
        this.setLoadingState('login', false);
        loadingManager.hide();
      }, 2000);
    }
  }

  async handleSignup(e) {
    e.preventDefault();

    const formData = {
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      email: this.signupEmailInput.value,
      password: this.signupPasswordInput.value
    };

    // Validate required fields
    if (!formData.firstName.trim()) {
      toastManager.error('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      toastManager.error('Last name is required');
      return;
    }

    // Validate email and password
    const validation = validator.validateForm({
      email: formData.email,
      password: formData.password
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toastManager.error(firstError);
      return;
    }

    // Check terms agreement
    if (!this.agreeTermsCheckbox.checked) {
      toastManager.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Show loading state
    this.setLoadingState('signup', true);
    loadingManager.show();

    try {

      // Success
      toastManager.success('Signup feature Coming Soon!');

    } catch (error) {
      toastManager.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setTimeout(() => {
        this.setLoadingState('signup', false);
        loadingManager.hide();
      }, 2000);
    }
  }



  setLoadingState(mode, loading) {
    const btn = mode === 'login' ? this.loginBtn : this.signupBtn;

    if (loading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  togglePassword(mode) {
    const input = mode === 'login' ? this.loginPasswordInput : this.signupPasswordInput;
    const toggle = mode === 'login' ? this.loginPasswordToggle : this.signupPasswordToggle;

    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;

    const icon = toggle.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  handleInputFocus(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.add('focused');
  }

  handleInputBlur(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.remove('focused');
  }

  handleInputChange(e) {
    const input = e.target;
    const wrapper = input.closest('.input-wrapper');

    if (input.value) {
      wrapper.classList.add('has-value');
    } else {
      wrapper.classList.remove('has-value');
    }
  }

  handleSocialLogin(provider) {
    const action = this.currentMode === 'login' ? 'sign in' : 'sign up';
    toastManager.info(`${provider} ${action} is coming soon!`);

  }

  handleForgotPassword(e) {
    e.preventDefault();
    toastManager.info('Password reset functionality is coming soon!');
  }

  handleSSOLogin(e) {
    e.preventDefault();
    toastManager.info('Single Sign-On (SSO) is coming soon!');
  }

  handleKeyboardShortcuts(e) {
    // Enter key on forms
    const currentInputs = this.currentMode === 'login'
      ? [this.loginEmailInput, this.loginPasswordInput]
      : [this.firstNameInput, this.lastNameInput, this.signupEmailInput, this.signupPasswordInput];

    if (e.key === 'Enter' && currentInputs.includes(e.target)) {
      const currentBtn = this.currentMode === 'login' ? this.loginBtn : this.signupBtn;
      if (!currentBtn.disabled) {
        const currentForm = this.currentMode === 'login' ? this.loginForm : this.signupForm;
        currentForm.dispatchEvent(new Event('submit'));
      }
    }

    // Escape key to clear form
    if (e.key === 'Escape') {
      this.clearForm();
      toastManager.info('Form cleared');
    }

    // Tab to switch modes
    if (e.key === 'Tab' && e.ctrlKey) {
      e.preventDefault();
      this.switchMode(this.currentMode === 'login' ? 'signup' : 'login');
      toastManager.info(`Switched to ${this.currentMode} mode`);
    }
  }

  clearForm() {
    // Clear login form
    this.loginEmailInput.value = '';
    this.loginPasswordInput.value = '';
    this.rememberCheckbox.checked = false;

    // Clear signup form
    this.firstNameInput.value = '';
    this.lastNameInput.value = '';
    this.signupEmailInput.value = '';
    this.signupPasswordInput.value = '';
    this.agreeTermsCheckbox.checked = false;

    // Remove focus states
    document.querySelectorAll('.input-wrapper').forEach(wrapper => {
      wrapper.classList.remove('focused', 'has-value');
    });
  }
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutToast {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// Monkey Avatar Class
class MonkeyAvatar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.avatar = this.container?.querySelector('.monkey-avatar');
    this.blindCheck = this.container?.querySelector('.blind-check');
    this.form = this.container?.querySelector('.auth-form');
    this.passwordInputs = this.container?.querySelectorAll('input[type="password"]');

    if (this.avatar && this.form) {
      this.init();
    }
  }

  init() {
    // Handle password visibility toggle
    this.handlePasswordToggle();

    // Handle mouse tracking
    this.handleMouseTracking();

    // Handle form focus events
    this.handleFormFocus();
  }

  handlePasswordToggle() {
    // Listen for password toggle button clicks
    const passwordToggle = this.container.querySelector('.password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        // Toggle the blind check state
        if (this.blindCheck) {
          this.blindCheck.checked = !this.blindCheck.checked;
        }
      });
    }

    // Also handle direct clicks on the monkey avatar
    if (this.avatar) {
      this.avatar.addEventListener('click', () => {
        if (this.blindCheck) {
          this.blindCheck.checked = !this.blindCheck.checked;
        }
      });
    }
  }

  handleMouseTracking() {
    if (!this.avatar) return;

    let isTracking = false;

    // Start tracking when mouse enters the container
    this.container.addEventListener('mouseenter', () => {
      isTracking = true;
      this.avatar.classList.add('tracking');
    });

    // Stop tracking when mouse leaves the container
    this.container.addEventListener('mouseleave', () => {
      isTracking = false;
      this.avatar.classList.remove('tracking');
      this.resetEyePosition();
    });

    // Track mouse movement
    this.container.addEventListener('mousemove', (e) => {
      if (!isTracking || this.blindCheck?.checked) return;

      const rect = this.avatar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      // Calculate eye movement (limit the range)
      const maxMove = 2;
      const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / 20));
      const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / 20));

      this.moveEyes(moveX, moveY);
    });
  }

  handleFormFocus() {
    if (!this.form) return;

    // Add focus event listeners to all inputs
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // The CSS will handle the animation when form is focused
      });

      input.addEventListener('blur', () => {
        // Reset eye position when no input is focused
        setTimeout(() => {
          if (!this.form.querySelector('input:focus')) {
            this.resetEyePosition();
          }
        }, 100);
      });
    });
  }

  moveEyes(x, y) {
    const eyes = this.avatar.querySelectorAll('.monkey-eye-r, .monkey-eye-l');
    eyes.forEach(eye => {
      eye.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  resetEyePosition() {
    const eyes = this.avatar.querySelectorAll('.monkey-eye-r, .monkey-eye-l');
    eyes.forEach(eye => {
      eye.style.transform = 'translate(0, 0)';
    });
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main app
  const app = new AuthApp();

  // Initialize monkey avatars
  const loginMonkey = new MonkeyAvatar('loginContainer');
  const signupMonkey = new MonkeyAvatar('signupContainer');
});



