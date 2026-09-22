import { Character } from './types';

export const ANIME_CHARACTERS: Character[] = [
  {
    id: 'char_1',
    defaultName: 'Ren (Kiếm Sĩ)',
    title: 'Hỏa Kiếm Sĩ',
    color: '#ff3366',
    colorLight: 'rgba(255, 51, 102, 0.2)',
    colorBorder: '#ff5c8a',
    badge: '⚔️ HỎA',
    avatarSvg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      <defs>
        <linearGradient id="grad_ren" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff0055" />
          <stop offset="100%" stop-color="#790022" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#grad_ren)" stroke="#ff3366" stroke-width="3"/>
      <!-- Hair back -->
      <path d="M22 65 Q15 35 35 20 Q50 10 65 20 Q85 35 78 65 Z" fill="#2d0510"/>
      <!-- Face -->
      <path d="M30 40 Q50 78 70 40 Q50 28 30 40 Z" fill="#ffe0d0"/>
      <!-- Anime Eyes -->
      <ellipse cx="40" cy="46" rx="4.5" ry="6" fill="#ff0055"/>
      <circle cx="41" cy="44" r="1.8" fill="#ffffff"/>
      <ellipse cx="60" cy="46" rx="4.5" ry="6" fill="#ff0055"/>
      <circle cx="61" cy="44" r="1.8" fill="#ffffff"/>
      <!-- Blush -->
      <ellipse cx="34" cy="52" rx="4" ry="1.5" fill="#ff708f" opacity="0.6"/>
      <ellipse cx="66" cy="52" rx="4" ry="1.5" fill="#ff708f" opacity="0.6"/>
      <!-- Mouth -->
      <path d="M47 56 Q50 59 53 56" stroke="#b04040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Hair Front Spikes -->
      <path d="M25 32 Q35 15 50 18 Q65 15 75 32 Q62 25 50 35 Q38 25 25 32 Z" fill="#ff3366"/>
      <path d="M42 22 L48 42 L52 22 Z" fill="#ff0044"/>
      <!-- Fox / Ninja Headband -->
      <path d="M28 32 L72 32 L70 26 L30 26 Z" fill="#111118"/>
      <circle cx="50" cy="29" r="2.5" fill="#ffcc00"/>
    </svg>`
  },
  {
    id: 'char_2',
    defaultName: 'Aoi (Thần Nữ)',
    title: 'Băng Thần Nữ',
    color: '#00d2ff',
    colorLight: 'rgba(0, 210, 255, 0.2)',
    colorBorder: '#4de1ff',
    badge: '❄️ BĂNG',
    avatarSvg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      <defs>
        <linearGradient id="grad_aoi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0080ff" />
          <stop offset="100%" stop-color="#001a40" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#grad_aoi)" stroke="#00d2ff" stroke-width="3"/>
      <!-- Twin Tails -->
      <path d="M15 45 Q5 75 25 80 Q20 55 25 40 Z" fill="#00c8ff"/>
      <path d="M85 45 Q95 75 75 80 Q80 55 75 40 Z" fill="#00c8ff"/>
      <!-- Face -->
      <path d="M30 40 Q50 78 70 40 Q50 28 30 40 Z" fill="#fff0e8"/>
      <!-- Anime Eyes -->
      <ellipse cx="40" cy="46" rx="5" ry="6.5" fill="#0099ff"/>
      <circle cx="41" cy="43.5" r="2" fill="#ffffff"/>
      <ellipse cx="60" cy="46" rx="5" ry="6.5" fill="#0099ff"/>
      <circle cx="61" cy="43.5" r="2" fill="#ffffff"/>
      <!-- Blush -->
      <ellipse cx="34" cy="52" rx="4" ry="1.5" fill="#ff99bb" opacity="0.6"/>
      <ellipse cx="66" cy="52" rx="4" ry="1.5" fill="#ff99bb" opacity="0.6"/>
      <!-- Cute Smile -->
      <path d="M47 55 Q50 58 53 55" stroke="#cc5577" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Bangs -->
      <path d="M26 36 Q38 18 50 18 Q62 18 74 36 Q64 30 50 36 Q36 30 26 36 Z" fill="#4de1ff"/>
      <!-- Ribbon -->
      <circle cx="28" cy="36" r="3" fill="#ff3366"/>
      <circle cx="72" cy="36" r="3" fill="#ff3366"/>
    </svg>`
  },
  {
    id: 'char_3',
    defaultName: 'Kaito (Ninja)',
    title: 'Phong Ẩn Giả',
    color: '#00ff88',
    colorLight: 'rgba(0, 255, 136, 0.2)',
    colorBorder: '#4dffa6',
    badge: '🌪️ PHONG',
    avatarSvg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      <defs>
        <linearGradient id="grad_kaito" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00aa55" />
          <stop offset="100%" stop-color="#022e17" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#grad_kaito)" stroke="#00ff88" stroke-width="3"/>
      <!-- Ninja Cowl Back -->
      <circle cx="50" cy="48" r="28" fill="#141c18"/>
      <!-- Face Window -->
      <path d="M34 40 L66 40 L66 52 L34 52 Z" fill="#ffe5d6"/>
      <!-- Fierce Eyes -->
      <path d="M37 45 L47 47" stroke="#00ff88" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M63 45 L53 47" stroke="#00ff88" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="42" cy="47" r="1.5" fill="#ffffff"/>
      <circle cx="58" cy="47" r="1.5" fill="#ffffff"/>
      <!-- Mask Lower -->
      <path d="M30 50 Q50 72 70 50 L70 70 Q50 82 30 70 Z" fill="#1e2d24"/>
      <!-- Scarf Tail -->
      <path d="M65 65 Q85 75 75 90 Q65 75 60 70 Z" fill="#00ff88"/>
      <!-- Forehead Protector -->
      <rect x="35" y="30" width="30" height="7" rx="2" fill="#8ca090"/>
      <circle cx="50" cy="33.5" r="1.5" fill="#1e2d24"/>
    </svg>`
  },
  {
    id: 'char_4',
    defaultName: 'Hikari (Pháp Sư)',
    title: 'Quang Pháp Sư',
    color: '#ffaa00',
    colorLight: 'rgba(255, 170, 0, 0.2)',
    colorBorder: '#ffc04d',
    badge: '⚡ LÔI',
    avatarSvg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      <defs>
        <linearGradient id="grad_hikari" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff8800" />
          <stop offset="100%" stop-color="#402000" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#grad_hikari)" stroke="#ffaa00" stroke-width="3"/>
      <!-- Witch / Wizard Hat -->
      <path d="M50 8 L74 38 L26 38 Z" fill="#2d1d36"/>
      <ellipse cx="50" cy="38" rx="30" ry="7" fill="#442a54"/>
      <rect x="36" y="32" width="28" height="5" fill="#ffaa00"/>
      <!-- Face -->
      <path d="M32 42 Q50 78 68 42 Q50 34 32 42 Z" fill="#fff2e8"/>
      <!-- Anime Eyes -->
      <ellipse cx="41" cy="48" rx="4.5" ry="6" fill="#ffaa00"/>
      <circle cx="42" cy="46" r="1.8" fill="#ffffff"/>
      <ellipse cx="59" cy="48" rx="4.5" ry="6" fill="#ffaa00"/>
      <circle cx="60" cy="46" r="1.8" fill="#ffffff"/>
      <!-- Smile -->
      <path d="M47 57 Q50 60 53 57" stroke="#aa5522" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Blonde Hair -->
      <path d="M28 42 Q20 60 26 72 Q32 60 32 46 Z" fill="#ffe066"/>
      <path d="M72 42 Q80 60 74 72 Q68 60 68 46 Z" fill="#ffe066"/>
    </svg>`
  },
  {
    id: 'char_5',
    defaultName: 'Yuki (Cơ Giáp)',
    title: 'Ám Dạ Cơ Giáp',
    color: '#c850fe',
    colorLight: 'rgba(200, 80, 254, 0.2)',
    colorBorder: '#da80ff',
    badge: '🔮 ÁM',
    avatarSvg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      <defs>
        <linearGradient id="grad_yuki" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9900ee" />
          <stop offset="100%" stop-color="#220038" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#grad_yuki)" stroke="#c850fe" stroke-width="3"/>
      <!-- Cyber Cat Ears / Headset -->
      <path d="M25 22 L35 34 L20 38 Z" fill="#c850fe"/>
      <path d="M75 22 L65 34 L80 38 Z" fill="#c850fe"/>
      <!-- Face -->
      <path d="M30 40 Q50 78 70 40 Q50 28 30 40 Z" fill="#ffe8f2"/>
      <!-- Cyber Visor / Eyes -->
      <ellipse cx="40" cy="46" rx="5" ry="6" fill="#c850fe"/>
      <circle cx="41" cy="44" r="2" fill="#ffffff"/>
      <ellipse cx="60" cy="46" rx="5" ry="6" fill="#c850fe"/>
      <circle cx="61" cy="44" r="2" fill="#ffffff"/>
      <!-- Cyber Markings -->
      <path d="M31 49 L27 52" stroke="#00ffff" stroke-width="2"/>
      <path d="M69 49 L73 52" stroke="#00ffff" stroke-width="2"/>
      <!-- Mouth -->
      <path d="M47 57 Q50 59 53 57" stroke="#aa3377" stroke-width="1.5" fill="none"/>
      <!-- Silver Hair -->
      <path d="M26 36 Q38 20 50 20 Q62 20 74 36 Q64 30 50 36 Q36 30 26 36 Z" fill="#f0e6ff"/>
    </svg>`
  }
];
