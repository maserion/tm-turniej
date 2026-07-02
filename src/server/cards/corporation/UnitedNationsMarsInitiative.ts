import {CorporationCard} from './CorporationCard';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from './ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {OrOptions} from '../../inputs/OrOptions';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export const ACTION_COST = 3;
export class UnitedNationsMarsInitiative extends CorporationCard implements IActionCard, ICorporationCard {
  constructor() {
    super({
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tag.EARTH, Tag.CITY, Tag.PLANT],
      startingMegaCredits: 40,
      tr: {oceans: 1, oxygen: 1},

      metadata: {
        cardNumber: 'T015',
        description: 'You start with 40 M€. Place 1 ocean tile, 1 city tile, and 1 greenery tile. Discard 3 cards. NIE DZIALA.',
        renderData: CardRenderer.builder((b) => {
          // TODO(chosta): find a not so hacky solutions to spacing
          // b.br.br.br;
          b.empty().megacredits(40);
          b.oceans(1).city().greenery().br.text('-3').cards(1);
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 3 M€ to raise it 1 step more.', (eb) => {
              eb.megacredits(3).startAction.tr(1).asterix();
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.hasIncreasedTerraformRatingThisGeneration && player.canAfford({cost: ACTION_COST, tr: {tr: 1}});
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 3, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => player.increaseTerraformRating());
    return undefined;
  }
 public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.cardsInHand.length >= 3 && player.canAfford({cost: 0, tr: {oceans: 1, oxygen: 1}})) {
      if (!player.game.canAddOcean()) {
        this.warnings.add('maxoceans');
      }
      return true;
    }
    return false;
  }

  private selected: Array<'ocean' | 'city' | 'greenery' | 'discard'> = [];
  private selectNextAction(player: IPlayer): void {
    const options: Array<SelectOption> = [];

    if (!player.game.canAddOcean() && !player.playedCards.has(CardName.WHALES)) {
      this.selected.push('ocean');
    }
    if (!this.selected.includes('ocean')) {
      options.push(
        new SelectOption('Place an ocean').andThen(() => {
          this.selected.push('ocean');
          player.game
            .defer(new PlaceOceanTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('city')) {
      options.push(
        new SelectOption('Place a city').andThen(() => {
          this.selected.push('city');
          player.game
            .defer(new PlaceCityTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('greenery')) {
      options.push(
        new SelectOption('Place a greenery').andThen(() => {
          this.selected.push('greenery');
          player.game
            .defer(new PlaceGreeneryTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('discard')) {
      options.push(
        new SelectOption('Discard 3 cards').andThen(() => {
          this.selected.push('discard');
          player.game
            .defer(new DiscardCards(player, 3, 3, 'Select 3 cards to discard'))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }

    if (options.length > 0) {
      player.defer(new OrOptions(...options));
    }
  }

  public override play(player: IPlayer) {
    this.selected = []; // Make compatible with double down
    this.selectNextAction(player);
    return undefined;
  }



}
