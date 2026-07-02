import {CorporationCard} from './CorporationCard';
import {IPlayer} from '../../IPlayer';
import {IProjectCard, isIProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IStandardProjectCard} from '../IStandardProjectCard';
import {Resource} from '../../../common/Resource';
import {ICorporationCard} from './ICorporationCard';
import {ICard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';

export class CrediCor extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.CREDICOR,
      tags: [Tag.BUILDING],
      startingMegaCredits: 57,
      

      metadata: {
        cardNumber: 'T004',
        description: 'You start with 57 M€, 2 heat units, 1 steel production and 2 heat production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(57).heat(2);
          b.br;
          b.production((pb) => pb.steel(1).heat(2));
          b.corpBox('effect', (ce) => {
            ce.effect('After you pay for a card or standard project with a basic cost of 20M€ or more, you gain 4 M€.', (eb) => {
              eb.minus().megacredits(20).startEffect.megacredits(4);
            });
          });
        }),
      },
    });
  }
  private effect(player: IPlayer, card: IProjectCard | IStandardProjectCard): void {
    if (card.cost >= 20) {
      player.stock.add(Resource.MEGACREDITS, 4, {log: true});
    }
  }
  public onCardPlayed(player: IPlayer, card: ICard) {
    if (isIProjectCard(card)) {
      this.effect(player, card);
    }
  }

  public onStandardProject(player: IPlayer, project: IStandardProjectCard) {
    this.effect(player, project);
  }
}
