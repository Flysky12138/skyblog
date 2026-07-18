#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")" || exit

pnpm exec shadcn add -y -o \
  alert \
  alert-dialog \
  avatar \
  badge \
  breadcrumb \
  button \
  button-group \
  card \
  checkbox \
  combobox \
  command \
  context-menu \
  dialog \
  drawer \
  dropdown-menu \
  empty \
  field \
  input \
  input-group \
  input-otp \
  item \
  kbd \
  label \
  pagination \
  popover \
  radio-group \
  resizable \
  scroll-area \
  select \
  separator \
  sheet \
  sidebar \
  skeleton \
  slider \
  sonner \
  spinner \
  switch \
  table \
  tabs \
  textarea \
  toggle \
  toggle-group \
  tooltip

# 替换组件中的 /components-override/ 为 /components/
if [[ "$(uname -s)" == "Darwin" ]]; then
  find ./src/components -type f -name "*.tsx" -exec sed -i '' 's|components-override|components|g' {} +
else
  find ./src/components -type f -name "*.tsx" -exec sed -i 's|components-override|components|g' {} +
fi
