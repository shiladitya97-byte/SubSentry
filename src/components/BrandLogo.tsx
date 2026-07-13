import { useState } from 'react';
import { Video, Dumbbell, Code, Package, LucideIcon } from 'lucide-react';

type Category = 'OTT' | 'Fitness' | 'Software' | 'Other';

const categoryIcons: Record<Category, LucideIcon> = {
  OTT: Video,
  Fitness: Dumbbell,
  Software: Code,
  Other: Package,
};

const categoryColors: Record<Category, string> = {
  OTT: 'bg-blue-100 text-blue-600',
  Fitness: 'bg-green-100 text-green-600',
  Software: 'bg-purple-100 text-purple-600',
  Other: 'bg-gray-100 text-gray-600',
};

// Map common subscription names to their brand domains
const brandDomainMap: Record<string, string> = {
  netflix: 'netflix.com',
  'amazon prime': 'primevideo.com',
  'prime video': 'primevideo.com',
  'disney+': 'disneyplus.com',
  'disney plus': 'disneyplus.com',
  hotstar: 'hotstar.com',
  'jio hotstar': 'hotstar.com',
  spotify: 'spotify.com',
  'apple music': 'apple.com',
  'youtube premium': 'youtube.com',
  youtube: 'youtube.com',
  'youtube music': 'music.youtube.com',
  hulu: 'hulu.com',
  'hbo max': 'hbomax.com',
  max: 'max.com',
  'sony liv': 'sonyliv.com',
  sonyliv: 'sonyliv.com',
  zee5: 'zee5.com',
  jiocinema: 'jiocinema.com',
  'apple tv': 'apple.com',
  'apple tv+': 'apple.com',
  paramount: 'paramountplus.com',
  peacock: 'peacocktv.com',
  crunchyroll: 'crunchyroll.com',
  audible: 'audible.com',
  kindle: 'amazon.com',
  'amazon kindle': 'amazon.com',
  cultfit: 'cult.fit',
  'cult.fit': 'cult.fit',
  'cure.fit': 'cure.fit',
  peloton: 'onepeloton.com',
  strava: 'strava.com',
  'nike training': 'nike.com',
  'apple fitness': 'apple.com',
  'apple fitness+': 'apple.com',
  headspace: 'headspace.com',
  calm: 'calm.com',
  fitbit: 'fitbit.com',
  myfitnesspal: 'myfitnesspal.com',
  github: 'github.com',
  'github copilot': 'github.com',
  gitlab: 'gitlab.com',
  jetbrains: 'jetbrains.com',
  figma: 'figma.com',
  notion: 'notion.so',
  slack: 'slack.com',
  zoom: 'zoom.us',
  dropbox: 'dropbox.com',
  'google one': 'one.google.com',
  'google workspace': 'workspace.google.com',
  'microsoft 365': 'microsoft.com',
  office365: 'microsoft.com',
  onedrive: 'onedrive.com',
  icloud: 'icloud.com',
  'icloud+': 'icloud.com',
  adobe: 'adobe.com',
  'adobe creative cloud': 'adobe.com',
  photoshop: 'adobe.com',
  canva: 'canva.com',
  chatgpt: 'openai.com',
  'chatgpt plus': 'openai.com',
  openai: 'openai.com',
  claude: 'anthropic.com',
  anthropic: 'anthropic.com',
  perplexity: 'perplexity.ai',
  midjourney: 'midjourney.com',
  cursor: 'cursor.sh',
  vercel: 'vercel.com',
  netlify: 'netlify.com',
  cloudflare: 'cloudflare.com',
  aws: 'aws.amazon.com',
  linode: 'linode.com',
  digitalocean: 'digitalocean.com',
  grammarly: 'grammarly.com',
  '1password': '1password.com',
  lastpass: 'lastpass.com',
  nordvpn: 'nordvpn.com',
  expressvpn: 'expressvpn.com',
  surfshark: 'surfshark.com',
  linkedin: 'linkedin.com',
  'linkedin premium': 'linkedin.com',
  duolingo: 'duolingo.com',
  coursera: 'coursera.org',
  udemy: 'udemy.com',
  masterclass: 'masterclass.com',
  medium: 'medium.com',
  substack: 'substack.com',
  nyt: 'nytimes.com',
  'new york times': 'nytimes.com',
};

function resolveDomain(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (brandDomainMap[key]) return brandDomainMap[key];
  // partial match on words
  for (const brand of Object.keys(brandDomainMap)) {
    if (key.includes(brand) || brand.includes(key)) return brandDomainMap[brand];
  }
  // fallback: guess domain from single-word name
  const cleaned = key.replace(/[^a-z0-9]/g, '');
  if (cleaned.length >= 3 && cleaned.length <= 20) return `${cleaned}.com`;
  return null;
}

interface BrandLogoProps {
  name: string;
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-10 h-10 p-2', icon: 'w-5 h-5', img: 'w-6 h-6' },
  md: { box: 'w-14 h-14 p-3', icon: 'w-6 h-6', img: 'w-8 h-8' },
  lg: { box: 'w-16 h-16 p-3', icon: 'w-8 h-8', img: 'w-10 h-10' },
};

export const BrandLogo = ({ name, category, size = 'sm', className = '' }: BrandLogoProps) => {
  const domain = resolveDomain(name);
  const [failed, setFailed] = useState(false);
  const Icon = categoryIcons[category];
  const color = categoryColors[category];
  const sz = sizeMap[size];

  if (domain && !failed) {
    return (
      <div
        className={`${sz.box} rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden ${className}`}
      >
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={`${name} logo`}
          className={`${sz.img} object-contain`}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`${sz.box} rounded-lg ${color} flex items-center justify-center ${className}`}>
      <Icon className={sz.icon} />
    </div>
  );
};
