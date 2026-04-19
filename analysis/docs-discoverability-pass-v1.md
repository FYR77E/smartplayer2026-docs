# Docs Discoverability Pass V1

## Scope
- Key operational docs pages inside the main documentation tree
- Goal: make it easier to understand where to go next without returning to the home page

## Pages Updated
- `4. Разделы мониторинга и устройств`
- `5. Работа с контентом`
- `6. Работа с трансляциями`
- `7. Расписания`
- `Администрирование`
- `12. Типовые ошибки и решения`

## Real Issues Found
1. These pages explained their own topic, but several of them ended without an explicit next-step handoff.
2. Users could understand a single section, but still lose momentum between:
   - devices
   - content
   - broadcasts
   - schedules
   - troubleshooting
3. Home and onboarding routes were already improved, but discoverability deeper in docs was weaker.

## Fixes Applied
1. Added short `Куда идти дальше` callouts to the key operational pages.
2. Added `Связанные материалы` lists with concrete next destinations.
3. Kept the current information architecture intact and improved only local discoverability.

## Product Effect
- Docs now support a more continuous reading flow.
- Users can move between related operational sections without going back to the homepage.
- The platform feels more like a connected documentation system and less like isolated articles.

## Verification
- `npm run check:release:full`
- Manual live checks after deploy:
  - `/generated/09-4-разделы-мониторинга-и-устройств`
  - `/generated/10-5-работа-с-контентом`
  - `/generated/10-6-работа-с-трансляциями`
  - `/generated/11-7-расписания`
  - `/generated/14-10-администрирование`
  - `/generated/16-12-типовые-ошибки-и-решения`
