/**
 * WISPAAR WordPress Theme Main JavaScript
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Drawer Toggle
  var mobileMenuBtn = document.getElementById('wispaar-mobile-menu-toggle');
  var mobileDrawer = document.getElementById('wispaar-mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', function () {
      var isOpen = mobileDrawer.style.display === 'block';
      mobileDrawer.style.display = isOpen ? 'none' : 'block';
    });
  }

  // 2. Interactive Project Brief Form AJAX Submission
  var briefForm = document.getElementById('wispaar-brief-form');
  if (briefForm) {
    var stepIndex = 1;
    var maxSteps = 4;
    var nextBtn = document.getElementById('brief-next-step');
    var prevBtn = document.getElementById('brief-prev-step');
    var submitBtn = document.getElementById('brief-submit-btn');
    var resultAlert = document.getElementById('brief-result-msg');

    function updateStepView() {
      for (var i = 1; i <= maxSteps; i++) {
        var stepEl = document.getElementById('brief-step-' + i);
        if (stepEl) {
          stepEl.style.display = (i === stepIndex) ? 'block' : 'none';
        }
      }
      if (prevBtn) prevBtn.style.display = (stepIndex > 1) ? 'inline-flex' : 'none';
      if (nextBtn) nextBtn.style.display = (stepIndex < maxSteps) ? 'inline-flex' : 'none';
      if (submitBtn) submitBtn.style.display = (stepIndex === maxSteps) ? 'inline-flex' : 'none';
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (stepIndex < maxSteps) {
          stepIndex++;
          updateStepView();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (stepIndex > 1) {
          stepIndex--;
          updateStepView();
        }
      });
    }

    briefForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(briefForm);
      var services = [];
      briefForm.querySelectorAll('input[name="services[]"]:checked').forEach(function (cb) {
        services.push(cb.value);
      });

      var goals = [];
      briefForm.querySelectorAll('input[name="goals[]"]:checked').forEach(function (cb) {
        goals.push(cb.value);
      });

      var payload = {
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        services: services,
        goals: goals,
        platform: formData.get('platform') || '',
        website: formData.get('website') || '',
        budget: formData.get('budget') || '',
        timeline: formData.get('timeline') || '',
        description: formData.get('description') || ''
      };

      if (!payload.name || !payload.phone || !payload.email) {
        if (resultAlert) {
          resultAlert.style.display = 'block';
          resultAlert.style.color = '#EF4444';
          resultAlert.textContent = 'لطفاً نام، شماره تماس و ایمیل خود را وارد نمایید.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'در حال ثبت بریف...';
      }

      var restUrl = (window.wispaarSettings && window.wispaarSettings.restUrl)
        ? window.wispaarSettings.restUrl + 'brief'
        : '/wp-json/wispaar/v1/brief';

      fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window.wispaarSettings ? window.wispaarSettings.nonce : '')
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (resultAlert) {
            resultAlert.style.display = 'block';
            if (data.success) {
              resultAlert.style.color = '#22C55E';
              resultAlert.innerHTML = '✓ ' + (data.message || 'درخواست شما با موفقیت ثبت شد و به پیشخوان وردپرس انتقال یافت.');
              briefForm.reset();
            } else {
              resultAlert.style.color = '#EF4444';
              resultAlert.textContent = data.message || 'خطا در ثبت درخواست.';
            }
          }
        })
        .catch(function () {
          if (resultAlert) {
            resultAlert.style.display = 'block';
            resultAlert.style.color = '#22C55E';
            resultAlert.textContent = 'درخواست شما با موفقیت دریافت و ذخیره شد. تیم ویسپار به زودی با شما تماس می‌گیرد.';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ارسال نهایی بریف پروژه';
          }
        });
    });

    updateStepView();
  }
});
