/**
 * cms-loader.js — وتعاونوا
 * يقرأ content.json ويحدّث الصفحة تلقائياً.
 * أضف في index.html قبل </body>:
 *   <script src="cms-loader.js"></script>
 */
(function () {
  'use strict';

  fetch('content.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      applyImpact(d.impact);
      applyDonate(d.donate);
      applyContact(d.contact);
      applySocial(d.social);
      applyNews(d.news);
    })
    .catch(function () {
      // فشل صامت — تبقى القيم الاحتياطية الموجودة في HTML
    });

  /* ── أرقام الأثر ────────────────────────────────────────── */
  function applyImpact(impact) {
    if (!impact) return;
    var counts = document.querySelectorAll('[data-count]');
    var labels = document.querySelectorAll('.stat .lbl');
    var statNums = document.querySelectorAll('.stat .num');

    // الإحصاء 1
    if (counts[0] && impact.stat1_count !== undefined) {
      counts[0].dataset.count = impact.stat1_count;
    }
    if (labels[0] && impact.stat1_label) labels[0].textContent = impact.stat1_label;

    // الإحصاء 2
    if (counts[1] && impact.stat2_count !== undefined) {
      counts[1].dataset.count = impact.stat2_count;
    }
    if (labels[1] && impact.stat2_label) labels[1].textContent = impact.stat2_label;

    // الإحصاء 3
    if (counts[2] && impact.stat3_count !== undefined) {
      counts[2].dataset.count = impact.stat3_count;
    }
    if (labels[2] && impact.stat3_label) labels[2].textContent = impact.stat3_label;

    // الإحصاء 4 (نصّي)
    if (statNums[3] && impact.stat4_text) statNums[3].textContent = impact.stat4_text;
    if (labels[3] && impact.stat4_label) labels[3].textContent = impact.stat4_label;
  }

  /* ── قسم التبرّع ────────────────────────────────────────── */
  function applyDonate(donate) {
    if (!donate) return;

    // رقم الهاتف (الرابط + الظاهر)
    if (donate.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
        a.href = 'tel:' + donate.phone.replace(/\s/g, '');
        var bdi = a.querySelector('bdi');
        if (bdi) bdi.textContent = donate.phone;
      });
      document.querySelectorAll('.hotline bdi').forEach(function (el) {
        el.textContent = donate.phone;
      });
    }

    // IBAN
    setText('#cms-iban', donate.iban_details);
    // OMT
    setText('#cms-omt', donate.omt_details);
    // أرقام إضافية
    setText('#cms-extra-phones-donate', donate.extra_phones);
    setText('#cms-extra-phones-contact', donate.extra_phones || (donate.extra_phones));
  }

  /* ── قسم التواصل ────────────────────────────────────────── */
  function applyContact(contact) {
    if (!contact) return;
    if (contact.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = 'mailto:' + contact.email;
        if (!a.querySelector('*')) a.firstChild && (a.firstChild.textContent = contact.email);
      });
    }
    setText('#cms-address', contact.address);
    setText('#cms-contact-extra', contact.extra_phones);
    if (contact.phone) {
      setText('#cms-contact-phone', contact.phone);
    }
  }

  /* ── روابط التواصل الاجتماعي ────────────────────────────── */
  function applySocial(social) {
    if (!social) return;
    setHref('فيسبوك', social.facebook);
    setHref('انستغرام', social.instagram);
    setHref('X', social.twitter);
    setHref('يوتيوب', social.youtube);
    setHref('واتساب', social.whatsapp);
  }

  /* ── بطاقات الأخبار ─────────────────────────────────────── */
  function applyNews(news) {
    if (!news || !news.length) return;
    var grid = document.querySelector('.news-grid');
    if (!grid) return;
    grid.innerHTML = news.map(function (item) {
      return '<article class="ncard reveal"><div class="band"></div><div class="body">' +
        '<div class="meta">' +
        '<span class="chip">' + esc(item.type) + '</span>' +
        (item.date ? '<span class="date">' + esc(item.date) + '</span>' : '') +
        '</div>' +
        '<h3>' + esc(item.title) + '</h3>' +
        '<p>' + esc(item.body) + '</p>' +
        '<a class="more" href="' + esc(item.link || '#') + '">اقرأ المزيد ←</a>' +
        '</div></article>';
    }).join('');
  }

  /* ── مساعدات ────────────────────────────────────────────── */
  function setText(selector, val) {
    if (!val) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = val;
  }

  function setHref(ariaLabel, href) {
    if (!href || href === '#') return;
    document.querySelectorAll('[aria-label="' + ariaLabel + '"]').forEach(function (a) {
      a.href = href;
    });
  }

  function esc(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
