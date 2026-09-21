#!/usr/bin/env bash
#
# Сборка статики для файлового хостинга (FTP, отдача файлов без Node).
#
# Складывает три приложения в одну папку dist-ftp в той раскладке, в какой
# они должны лежать на сервере:
#   dist-ftp/        — публичный сайт
#   dist-ftp/care/   — кабинет пациента и опекуна  (basePath /care)
#   dist-ftp/staff/  — рабочее место специалиста   (basePath /staff)
#
# Адреса вшиваются в сборку: ссылки между приложениями ведут на полный URL,
# потому что это три отдельных Next-приложения, а не разделы одного.
# Меняется домен — пересобираем, иначе ссылки уведут на старый.
#
# Запуск:
#   bash scripts/build-static.sh                      # https://amaru.tennet.kz
#   SITE_URL=https://other.kz bash scripts/build-static.sh
#
set -euo pipefail

SITE_URL="${SITE_URL:-https://amaru.tennet.kz}"
SITE_URL="${SITE_URL%/}"

# Публичная лид-форма CRM: туда уходят заявки с сайта. Не секрет — этот адрес
# виден в любом коде встраивания формы. Пустое значение означало бы, что форма
# на сайте молча не работает, поэтому адрес задан здесь, а не оставлен на память.
CRM_LEAD_FORM_URL="${CRM_LEAD_FORM_URL:-https://crm.tennet.kz/api/public/forms/d4ad399c-701d-411e-a884-64881accca18/}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/dist-ftp"

echo "Домен сборки: $SITE_URL"

export STATIC_EXPORT=1
export NEXT_PUBLIC_SITE_URL="$SITE_URL"
export NEXT_PUBLIC_CRM_LEAD_FORM_URL="$CRM_LEAD_FORM_URL"
export NEXT_PUBLIC_CARE_URL="$SITE_URL/care"
export NEXT_PUBLIC_STAFF_URL="$SITE_URL/staff"

cd "$ROOT"
pnpm --filter @amare/site --filter @amare/care --filter @amare/staff build

rm -rf "$OUT"
mkdir -p "$OUT/care" "$OUT/staff"
cp -r apps/site/out/. "$OUT/"
cp -r apps/care/out/. "$OUT/care/"
cp -r apps/staff/out/. "$OUT/staff/"

# Служебные RSC-потоки Next нужны только серверу приложений; на файловом
# хостинге они не читаются и лишь занимают место
find "$OUT" -name '__next*.txt' -delete
find "$OUT" -name 'index.txt' -delete

echo
echo "Готово: $OUT"
du -sh "$OUT"
echo "Файлов: $(find "$OUT" -type f | wc -l)"
