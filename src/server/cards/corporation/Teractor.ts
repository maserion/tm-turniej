import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';

export class Teractor extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.TERACTOR,
      tags: [Tag.EARTH, Tag.SCIENCE],
      startingMegaCredits: 60,

      behavior: {
        production: {plants: 1},
        drawCard: 3,
      },

      cardDiscount: {tag: Tag.EARTH, amount: 3},
      metadata: {
        cardNumber: 'T005',
        description: 'You start with 60 M€ and 1 plant production. Draw 3 cards.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(60).cards(3);
          b.production((pb) => pb.plants(1)).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, you pay 3 M€ less for it.', (eb) => {
              eb.tag(Tag.EARTH).startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }
}
