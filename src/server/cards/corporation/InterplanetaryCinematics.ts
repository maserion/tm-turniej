import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {Resource} from '../../../common/Resource';
import {ICorporationCard} from './ICorporationCard';

export class InterplanetaryCinematics extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INTERPLANETARY_CINEMATICS,
      tags: [Tag.BUILDING, Tag.BUILDING, Tag.MICROBE],
      startingMegaCredits: 30,

      behavior: {
        stock: {steel: 20, plants: 2},
        production: {plants: 1, energy: 1},
      },

      metadata: {
        cardNumber: 'T010',
        description: 'You start with 20 steel, 2 plants and 30 M€. Increase your plant and energy production 1 step each.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(30).steel(20, {digit}).plants(2).br.production((pb) => pb.plants(1).energy(1));
          b.corpBox('effect', (ce) => {
            ce.effect('Each time you play an event, you gain 2 M€.', (eb) => {
              eb.tag(Tag.EVENT).startEffect.megacredits(2);
            });
          });
        }),
      },
    });
  }
  public onCardPlayed(player: IPlayer, card: ICard) {
    if (card.type === CardType.EVENT) {
      player.stock.add(Resource.MEGACREDITS, 2, {log: true, from: {card: this}});
    }
  }
}
