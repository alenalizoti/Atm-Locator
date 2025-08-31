const allBanks = [
  'raiffeisen', 'intesa', 'erste', 'otp', 'addiko', 'aik',
  'unicredit', 'eurobank', 'komercijalna', 'mobi', 'credit agricole',
  'poštanska štedionica', 'multicard', 'yettel'
];

const cyrillicToLatinMap = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Ђ: 'Dj', Е: 'E', Ж: 'Z', З: 'Z', И: 'I', Ј: 'J',
  К: 'K', Л: 'L', Љ: 'Lj', М: 'M', Н: 'N', Њ: 'Nj', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T',
  Ћ: 'C', У: 'U', Ф: 'F', Х: 'H', Ц: 'C', Ч: 'Č', Џ: 'Dž', Ш: 'S',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'dj', е: 'e', ж: 'z', з: 'z', и: 'i', ј: 'j',
  к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  ћ: 'c', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'c', џ: 'dz', ш: 's'
};

function transliterate(text) {
  return text.split('').map(c => cyrillicToLatinMap[c] || c).join('');
}

function normalize(text) {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBankInText(text) {
  const normalized = normalize(text);
  
  if(normalized.startsWith('aik')) return 'aik';
  if(normalized.startsWith('moneyget')) return 'moneyget';
  if(normalized.startsWith('postanska stedionica')) return 'poštanska štedionica';
  if(normalized.startsWith('banka postanska stedionica')) return 'poštanska štedionica';
  if(normalized.startsWith('potanska tedionica')) return 'poštanska štedionica';
  if(normalized.startsWith('halkbank')) return 'halkbank';
  if(normalized.startsWith('multicard')) return 'multicard'
  if (normalized.startsWith('hypo')) return 'addiko'; // Hypo Alpe-Adria je postao Addiko
  if (normalized.startsWith('point menjacnica')) return 'menjačnica';
  if (normalized.startsWith('trafika')) return 'menjačnica';
  if (normalized.startsWith('uni credit')) return 'unicredit';
  if (normalized.startsWith('posta srbije')) return 'poštanska štedionica';
  if (normalized.startsWith('postanska stedionica')) return 'poštanska štedionica';
  if (normalized.startsWith('banka intesa')) return 'intesa';
  if (normalized.startsWith('inteza')) return 'intesa';
  if (normalized.startsWith('alta pey')) return 'menjačnica';
  if (normalized === 'bankomat') return 'nepoznato'; // generički bankomat
  if (normalized.startsWith('menjacnica')) return 'menjačnica';
  if (normalized.startsWith('menjačnica')) return 'menjačnica';
  if (normalized.startsWith('telenor')) return 'yettel';
  if (normalized.startsWith('gosse')) return 'menjačnica';
  if (normalized.startsWith('antiplam')) return 'menjačnica'; // ili 'nepoznato', ako nije jasno
  if (normalized.startsWith('postal savings bank')) return 'poštanska štedionica';
  if (normalized.startsWith('postanske stedionice')) return 'poštanska štedionica';
  if (normalized.startsWith('atm banka postanska stedionica')) return 'poštanska štedionica';
  if (normalized.startsWith('privredna banka beograd')) return 'privredna banka beograd';
  if (normalized.startsWith('atm unicreditbank')) return 'unicredit';
  if (normalized.startsWith('kes agencija')) return 'menjačnica';
  if (normalized.startsWith('atm halkbank')) return 'halkbank';
  if (normalized.startsWith('atm adriatic bank')) return 'adriatic bank';
  if (normalized.startsWith('alta menjacnica')) return 'menjačnica';
  if (normalized.startsWith('alta system')) return 'menjačnica';
  if (normalized.startsWith('dollar exchange office')) return 'menjačnica';
  if (normalized.startsWith('kbc banka')) return 'kbc banka';
  if (normalized.startsWith('vojvodjanska')) return 'vojvodjanska banka';
  if (normalized.startsWith('dunav')) return 'dunav osiguranje'; // ako je to ta institucija

  return allBanks.find(bank => {
    const pattern = new RegExp(`\\b${bank}\\b`, 'i'); 
    return pattern.test(normalized);
  }) || null;
}


module.exports = {
  findBankInText,
  normalize
};
