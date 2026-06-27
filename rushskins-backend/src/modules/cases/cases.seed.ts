import { DataSource } from 'typeorm'
import { Case } from './entities/case.entity'
import { CaseItem } from './entities/case-item.entity'
import { Skin, SkinRarity } from '../skins/entities/skin.entity'

const STEAM_IMAGE =
  'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIANfw_aqNmlD09-ywoKJkqauYu-BxjlSvZV0j7j--Y-0ig/360fx360f'

const RARITY_WEIGHT: Record<SkinRarity, number> = {
  [SkinRarity.CONSUMER]: 40,
  [SkinRarity.INDUSTRIAL]: 30,
  [SkinRarity.MILSPEC]: 15,
  [SkinRarity.RESTRICTED]: 8,
  [SkinRarity.CLASSIFIED]: 4,
  [SkinRarity.COVERT]: 2,
  [SkinRarity.CONTRABAND]: 0.5,
}

const RARITY_PRICE: Record<SkinRarity, number> = {
  [SkinRarity.CONSUMER]: 15,
  [SkinRarity.INDUSTRIAL]: 35,
  [SkinRarity.MILSPEC]: 80,
  [SkinRarity.RESTRICTED]: 180,
  [SkinRarity.CLASSIFIED]: 650,
  [SkinRarity.COVERT]: 1500,
  [SkinRarity.CONTRABAND]: 5000,
}

const SKIN_POOLS: Record<SkinRarity, string[]> = {
  [SkinRarity.CONSUMER]: [
    'P250 | Sand Dune',
    'Glock-18 | High Beam',
    'Nova | Polar Mesh',
    'Sawed-Off | Sage Spray',
    'MP7 | Army Recon',
    'Five-SeveN | Forest Night',
    'Tec-9 | Groundwater',
    'MAC-10 | Palm',
    'SG 553 | Army Sheen',
    'AUG | Contractor',
    'Dual Berettas | Colony',
    'PP-Bizon | Urban Dashed',
  ],
  [SkinRarity.INDUSTRIAL]: [
    'AK-47 | Safari Mesh',
    'M4A4 | Mainframe',
    'AWP | Safari Mesh',
    'USP-S | Night Ops',
    'P90 | Ash Wood',
    'Galil AR | Sage Spray',
    'FAMAS | Cyanospatter',
    'MAG-7 | Metallic DDPAT',
    'Negev | CaliCamo',
    'MP9 | Orange Peel',
  ],
  [SkinRarity.MILSPEC]: [
    'AK-47 | Elite Build',
    'M4A1-S | Flashback',
    'AWP | Phobos',
    'USP-S | Guardian',
    'Glock-18 | Moonrise',
    'Desert Eagle | Oxide Blaze',
    'FAMAS | Mecha Industries',
    'Galil AR | Rocket Pop',
    'MP9 | Goo',
    'P250 | Wingshot',
    'Tec-9 | Isaac',
    'MAC-10 | Lapis Gator',
    'SG 553 | Pulse',
    'AUG | Ricochet',
    'UMP-45 | Exposure',
  ],
  [SkinRarity.RESTRICTED]: [
    'AK-47 | Blue Laminate',
    'M4A4 | Desolate Space',
    'AWP | Fever Dream',
    'USP-S | Cortex',
    'Glock-18 | Vogue',
    'Desert Eagle | Light Rail',
    'P250 | Asiimov',
    'Five-SeveN | Monkey Business',
    'MP7 | Bloodsport',
    'MAC-10 | Neon Rider',
    'FAMAS | Djinn',
    'Galil AR | Eco',
    'AUG | Stymphalian',
    'SG 553 | Cyrex',
    'CZ75-Auto | Xiangliu',
    'P90 | Shapewood',
    'Nova | Hyper Beast',
    'MAG-7 | Justice',
  ],
  [SkinRarity.CLASSIFIED]: [
    'AK-47 | Redline',
    'M4A1-S | Hyper Beast',
    'M4A4 | The Emperor',
    'AWP | Electric Hive',
    'USP-S | Neo-Noir',
    'Glock-18 | Water Elemental',
    'Desert Eagle | Code Red',
    'P250 | See Ya Later',
    'Five-SeveN | Hyper Beast',
    'MAC-10 | Stalker',
    'MP9 | Starlight Protector',
    'FAMAS | Commemoration',
    'Galil AR | Chatterbox',
    'AUG | Momentum',
    'SG 553 | Integrale',
    'P90 | Asiimov',
    'Tec-9 | Fuel Injector',
    'UMP-45 | Primal Saber',
    'CZ75-Auto | The Fuschia Is Now',
    'Nova | Bloomstick',
    'Sawed-Off | The Kraken',
  ],
  [SkinRarity.COVERT]: [
    'AK-47 | Vulcan',
    'AK-47 | Neon Revolution',
    'AK-47 | Bloodsport',
    'M4A4 | Asiimov',
    'M4A4 | Poseidon',
    'M4A1-S | Printstream',
    'AWP | Asiimov',
    'AWP | Hyper Beast',
    'AWP | The Prince',
    'Desert Eagle | Blaze',
    'Desert Eagle | Printstream',
    'USP-S | Kill Confirmed',
    'Glock-18 | Fade',
    'FAMAS | Roll Cage',
  ],
  [SkinRarity.CONTRABAND]: [
    'M4A4 | Howl',
    'AWP | Dragon Lore',
    'Karambit | Doppler',
    'Butterfly Knife | Fade',
    'M9 Bayonet | Marble Fade',
  ],
}

interface CaseSeed {
  name: string
  price: number
  contents: Array<[SkinRarity, number]>
}

const CASES: CaseSeed[] = [
  {
    name: 'Starter Case',
    price: 50,
    contents: [
      [SkinRarity.CONSUMER, 12],
      [SkinRarity.INDUSTRIAL, 10],
      [SkinRarity.MILSPEC, 3],
    ],
  },
  {
    name: 'Fire Case',
    price: 150,
    contents: [
      [SkinRarity.MILSPEC, 12],
      [SkinRarity.RESTRICTED, 10],
      [SkinRarity.CLASSIFIED, 3],
    ],
  },
  {
    name: 'Elite Case',
    price: 500,
    contents: [
      [SkinRarity.RESTRICTED, 8],
      [SkinRarity.CLASSIFIED, 10],
      [SkinRarity.COVERT, 2],
    ],
  },
  {
    name: 'Knife Case',
    price: 1000,
    contents: [
      [SkinRarity.CLASSIFIED, 8],
      [SkinRarity.COVERT, 5],
      [SkinRarity.CONTRABAND, 2],
    ],
  },
  {
    name: 'Premium Case',
    price: 2500,
    contents: [
      [SkinRarity.COVERT, 7],
      [SkinRarity.CONTRABAND, 3],
    ],
  },
]

export async function seedCases(dataSource: DataSource): Promise<void> {
  const caseRepo = dataSource.getRepository(Case)
  const skinRepo = dataSource.getRepository(Skin)
  const caseItemRepo = dataSource.getRepository(CaseItem)

  const count = await caseRepo.count()
  if (count > 0) {
    // eslint-disable-next-line no-console
    console.log('Cases already seeded, skipping')
    return
  }

  for (const caseSeed of CASES) {
    const createdCase = await caseRepo.save({
      name: caseSeed.name,
      imageUrl: STEAM_IMAGE,
      price: caseSeed.price,
      isActive: true,
    })

    for (const [rarity, count] of caseSeed.contents) {
      for (let index = 0; index < count; index += 1) {
        const fullName = SKIN_POOLS[rarity][index % SKIN_POOLS[rarity].length]
        const [weapon, name] = fullName.split(' | ')
        const skin = await skinRepo.save({
          name,
          weapon,
          wear: pickWear(index),
          rarity,
          price: RARITY_PRICE[rarity],
          imageUrl: STEAM_IMAGE,
          float: Number((0.01 + index * 0.007).toFixed(6)),
          lisSkinId: null,
        })

        await caseItemRepo.save({
          caseId: createdCase.id,
          skinId: skin.id,
          dropWeight: RARITY_WEIGHT[rarity],
        })
      }
    }
  }
}

function pickWear(index: number): string {
  const wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
  return wears[index % wears.length]
}
