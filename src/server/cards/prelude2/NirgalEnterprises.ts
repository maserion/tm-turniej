import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class NirgalEnterprises extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.NIRGAL_ENTERPRISES,
      tags: [Tag.POWER, Tag.PLANT, Tag.BUILDING, Tag.BUILDING],
      startingMegaCredits: 30,

      behavior: {
        production: {energy: 1, plants: 1, steel: 1, heat: 3},
        stock: {heat: 3},
      },

      metadata: {
        cardNumber: 'T008', // Renumber
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(30).heat(3).br.production((pb) => pb.energy(1).plants(1).steel(1).heat(3)).br;
          b.effect('AWARDS AND MILESTONES ALWAYS COST 0 M€ FOR YOU.', (eb) => {
            // TODO(kberg): replace with award().slash.milestone() when award and milestone can be stacked.
            eb.plate('Awards and Milestones').startEffect.megacredits(1, {text: '0'});
          });
        }),
        description: 'You start with 30 M€ and 3 heat units. Increase your energy, plant, and steel production 1 step each and your heat production 3 steps.',
      },
    });
  }
}
