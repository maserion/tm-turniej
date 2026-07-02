import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';
import {digit} from '../Options';


export class Inventrix extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INVENTRIX,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      startingMegaCredits: 45,
      globalParameterRequirementBonus: {steps: 2},

      firstAction: {
        text: 'Draw 3 cards',
        drawCard: 3,
      },

      behavior: {
        production: {steel: 2},
        stock: {steel: 4},
      },

      metadata: {
        cardNumber: 'T001',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€. Gain 2 steel producrtion and 4 steel units.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.br;
          b.production((pb) => pb.steel(2)).steel(4, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 2');
            });
          });
        }),
      },
    });
  }
}

