#!/usr/bin/env python3
"""
build.py — وتعاونوا
يُحوّل ملف الموقع الأصلي إلى نسخة مرتبطة بـ Decap CMS.

الاستخدام:
    python build.py wataawano.org.html

سينتج: index.html جاهز للرفع مع باقي ملفات المجلد.
"""
import sys
import shutil
import os

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "wataawano.org.html"
    if not os.path.exists(src):
        print(f"❌  الملف '{src}' غير موجود. حدّد المسار الصحيح.")
        sys.exit(1)

    with open(src, encoding="utf-8") as f:
        html = f.read()

    patches = [
        # ── إضافة id="cms-iban" ─────────────────────────────────────────
        (
            '<div class="cx"><b>تحويل مصرفي / IBAN</b>'
            '<span class="edit">[أدخل اسم الحساب ورقم الـ IBAN]</span></div>',
            '<div class="cx"><b>تحويل مصرفي / IBAN</b>'
            '<span id="cms-iban" class="edit">[أدخل اسم الحساب ورقم الـ IBAN]</span></div>',
        ),
        # ── إضافة id="cms-omt" ─────────────────────────────────────────
        (
            '<div class="cx"><b>OMT / Whish Money</b>'
            '<span class="edit">[أدخل الاسم والرقم المخصّص]</span></div>',
            '<div class="cx"><b>OMT / Whish Money</b>'
            '<span id="cms-omt" class="edit">[أدخل الاسم والرقم المخصّص]</span></div>',
        ),
        # ── إضافة id="cms-extra-phones-donate" ─────────────────────────
        (
            '<bdi>70 826 533</bdi> &nbsp; <span class="edit">[+ أرقام إضافية]</span>',
            '<bdi>70 826 533</bdi> &nbsp; <span id="cms-extra-phones-donate" class="edit">[+ أرقام إضافية]</span>',
        ),
        # ── إضافة id="cms-contact-extra" ───────────────────────────────
        (
            '<br><span class="edit">[+ أرقام إضافية]</span></p>',
            '<br><span id="cms-contact-extra" class="edit">[+ أرقام إضافية]</span></p>',
        ),
        # ── إضافة id="cms-address" ─────────────────────────────────────
        (
            '<p><span class="edit">[أدخل عنوان المقرّ — لبنان]</span></p>',
            '<p><span id="cms-address" class="edit">[أدخل عنوان المقرّ — لبنان]</span></p>',
        ),
        # ── حقن سكريبت التحميل قبل </body> ────────────────────────────
        (
            '</body>',
            '<script src="cms-loader.js"></script>\n</body>',
        ),
    ]

    changed = 0
    for old, new in patches:
        if old in html:
            html = html.replace(old, new, 1)
            changed += 1
        else:
            print(f"⚠️  تعذّر تطبيق تعديل: {old[:60]}…")

    out = "index.html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"✅  تمّ! طُبِّق {changed} تعديل من أصل {len(patches)}.")
    print(f"    الملف الناتج: {os.path.abspath(out)}")
    print()
    print("الخطوة التالية: اقرأ README.txt لرفع الملفات ونشر الموقع.")

if __name__ == "__main__":
    main()
