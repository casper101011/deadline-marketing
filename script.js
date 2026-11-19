/* =========================================================
   НАСТРОЙКА: ник в Telegram без @ (например: timur_target).
   Меняешь здесь — меняются все кнопки на сайте.
   ========================================================= */
var TG_NICK = 'Timur_Izgutdinov';

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // Язык страницы: тексты сообщения из формы
  var UZ = document.documentElement.lang === 'uz';
  var T = UZ
    ? { hello: 'Assalomu alaykum! Akkauntimni bepul tahlil qilib berishingizni istayman.', name: 'Ism', biz: 'Biznes', need: 'Kerak' }
    : { hello: 'Здравствуйте! Хочу бесплатный разбор аккаунта.', name: 'Имя', biz: 'Бизнес', need: 'Нужно' };

  // Тёмная / светлая тема (выбор запоминается)
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  function tgUrl(text) {
    var url = 'https://t.me/' + TG_NICK;
    return text ? url + '?text=' + encodeURIComponent(text) : url;
  }

  // Все ссылки на Telegram берут ник из настройки выше
  document.querySelectorAll('[data-tg]').forEach(function (a) {
    a.href = tgUrl(a.getAttribute('data-tg-text'));
    if (a.hasAttribute('data-tg-show')) {
      a.textContent = '@' + TG_NICK;
      a.classList.toggle('ph', TG_NICK === 'TG_NICK'); // подсветка, пока ник не заменён
    }
  });

  // Ссылки-заглушки (отзыв, Instagram) не прыгают наверх страницы
  document.querySelectorAll('[data-placeholder-link]').forEach(function (a) {
    if (a.getAttribute('href') === '#') {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });

  // Меню на телефоне
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  function closeMenu() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  // Плавное появление блоков
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 20% 0px', threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Кнопка внизу экрана: видна после первого экрана, прячется у формы заявки
  var sticky = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  var contact = document.getElementById('contact');
  if (sticky && hero && contact && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var contactVisible = false;
    var update = function () {
      var show = !heroVisible && !contactVisible;
      sticky.classList.toggle('show', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      var link = sticky.querySelector('a');
      if (link) link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; update(); }).observe(contact);
  }

  // Форма заявки → готовое сообщение в Telegram
  var form = document.getElementById('lead-form');
  var error = document.getElementById('form-error');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name;
      var business = form.elements.business;
      var ok = true;
      [name, business].forEach(function (input) {
        var empty = !input.value.trim();
        input.classList.toggle('invalid', empty);
        if (empty) ok = false;
      });
      error.hidden = ok;
      if (!ok) { (name.value.trim() ? business : name).focus(); return; }

      var lines = [
        T.hello,
        T.name + ': ' + name.value.trim(),
        T.biz + ': ' + business.value.trim()
      ];
      var insta = form.elements.instagram.value.trim();
      if (insta) lines.push('Instagram: ' + insta);
      lines.push(T.need + ': ' + form.elements.need.value);

      window.open(tgUrl(lines.join('\n')), '_blank', 'noopener');
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
