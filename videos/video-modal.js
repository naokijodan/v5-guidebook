(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('vm-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'vm-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', '動画プレーヤー');
      overlay.innerHTML = [
        '<div id="vm-box">',
        '  <button id="vm-close" aria-label="閉じる">✕</button>',
        '  <video id="vm-video" controls playsinline></video>',
        '</div>'
      ].join('');
      document.body.appendChild(overlay);
    }
    var box = document.getElementById('vm-box');
    var closeButton = document.getElementById('vm-close');
    var video = document.getElementById('vm-video');
    var videoButtons = document.querySelectorAll('.video-btn');
    function closeModal() {
      video.pause();
      video.removeAttribute('src');
      video.load();
      overlay.style.display = 'none';
    }
    videoButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var videoSrc = button.getAttribute('data-video');
        if (!videoSrc) return;
        video.src = videoSrc;
        overlay.style.display = 'flex';
        video.play().catch(function () {});
      });
    });
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    box.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') closeModal();
    });
  });
}());
