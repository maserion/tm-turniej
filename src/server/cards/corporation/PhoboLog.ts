import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {ICorporationCard} from './ICorporationCard';

export class PhoboLog extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      tags: [Tag.SPACE],
      startingMegaCredits: 28,

      behavior: {
        stock: {titanium: 10},
        production: {plants: 1},
        titanumValue: 1,
        tr: 1,
      },

      metadata: {
        cardNumber: 'T003',
        description: 'You start with 10 titanium, 28 M€, 1 plant production and 1 TR.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(28).nbsp.titanium(10, {digit});
          b.br;
          b.production((pb) => pb.plants(1)).nbsp.tr(1);
          b.corpBox('effect', (ce) => {
            ce.effect('Your titanium resources are each worth 1 M€ extra.', (eb) => {
              eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
            });
          });
        }),
      },
    });
  }
}
