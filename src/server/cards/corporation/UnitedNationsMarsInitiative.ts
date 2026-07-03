import { CorporationCard } from './CorporationCard';
import { IActionCard } from '../ICard';
import { Tag } from '../../../common/cards/Tag';
import { IPlayer } from '../../IPlayer';
import { ICorporationCard } from './ICorporationCard';
import { CardName } from '../../../common/cards/CardName';
import { CardRenderer } from '../render/CardRenderer';
import { SelectPaymentDeferred } from '../../deferredActions/SelectPaymentDeferred';
import { TITLES } from '../../inputs/titles';
import { SelectOption } from '../../inputs/SelectOption';
import { OrOptions } from '../../inputs/OrOptions';
import { DiscardCards } from '../../deferredActions/DiscardCards';
import { SelectSpace } from '../../inputs/SelectSpace';
import { DeferredAction } from '../../deferredActions/DeferredAction';
import { PlayerInput } from '../../PlayerInput';

export const ACTION_COST = 3;

/**
 * Action triggered by the engine to start the corporation setup choices.
 */
class UNMInitiativeAction extends DeferredAction {
  constructor(player: IPlayer, private card: UnitedNationsMarsInitiative) {
    super(player);
  }

  public override execute(): PlayerInput | undefined {
    this.card['selectNextAction'](this.player);
    return undefined;
  }
}

export class UnitedNationsMarsInitiative extends CorporationCard implements IActionCard, ICorporationCard {
  private selected: Array<'ocean' | 'city' | 'greenery' | 'discard'> = [];

  constructor() {
    super({
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tag.EARTH, Tag.CITY, Tag.PLANT],
      startingMegaCredits: 40,
      tr: { oceans: 1, oxygen: 1 },
      metadata: {
        cardNumber: 'T015',
        description: 'You start with 40 M€. Place 1 ocean tile, 1 city tile, and 1 greenery tile. Discard 3 cards.',
        renderData: CardRenderer.builder((b) => {
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

  // Zmieniamy zwracany typ na PlayerInput | undefined, aby zgadzał się z interfejsem silnika
  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    this.selected = [];
    // Wrzucamy akcję bezpośrednio do kolejki gracza zamiast ją zwracać
    player.game.defer(new UNMInitiativeAction(player, this));
    return undefined;
  }

  public canAct(player: IPlayer): boolean {
    return player.hasIncreasedTerraformRatingThisGeneration && player.canAfford({ cost: ACTION_COST, tr: { tr: 1 } });
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 3, { title: TITLES.payForCardAction(this.name) }))
      .andThen(() => player.increaseTerraformRating());
    return undefined;
  }

  private selectNextAction(player: IPlayer): void {
    if (!player.game.canAddOcean() && !player.playedCards.has(CardName.WHALES)) {
      this.selected.push('ocean');
    }

    const options: Array<SelectOption> = [];

    if (!this.selected.includes('ocean')) {
      options.push(new SelectOption('Place an ocean').andThen(() => {
        this.selected.push('ocean');
        const input = new SelectSpace('Select space for ocean', player.game.board.getAvailableSpacesForType(player, 'ocean'));
        input.andThen((space) => {
          const savedBonus = space.bonus;
          const originalBonus = player.oceanBonus;
          space.bonus = [];
          player.oceanBonus = 0;
          player.game.addOcean(player, space);
          space.bonus = savedBonus;
          player.oceanBonus = originalBonus;
          this.selectNextAction(player);
        });
        player.defer(input);
        return undefined;
      }));
    }

    if (!this.selected.includes('city')) {
      options.push(new SelectOption('Place a city').andThen(() => {
        this.selected.push('city');
        const input = new SelectSpace('Select space for city', player.game.board.getAvailableSpacesForType(player, 'city'));
        input.andThen((space) => {
          const savedBonus = space.bonus;
          const originalBonus = player.oceanBonus;
          space.bonus = [];
          player.oceanBonus = 0;
          player.game.addCity(player, space);
          space.bonus = savedBonus;
          player.oceanBonus = originalBonus;
          this.selectNextAction(player);
        });
        player.defer(input);
        return undefined;
      }));
    }

    if (!this.selected.includes('greenery')) {
      options.push(new SelectOption('Place a greenery').andThen(() => {
        this.selected.push('greenery');
        const input = new SelectSpace('Select space for greenery', player.game.board.getAvailableSpacesForType(player, 'greenery'));
        input.andThen((space) => {
          const savedBonus = space.bonus;
          const originalBonus = player.oceanBonus;
          space.bonus = [];
          player.oceanBonus = 0;
          player.game.addGreenery(player, space, true);
          space.bonus = savedBonus;
          player.oceanBonus = originalBonus;
          this.selectNextAction(player);
        });
        player.defer(input);
        return undefined;
      }));
    }

    if (!this.selected.includes('discard')) {
      options.push(new SelectOption('Discard 3 cards').andThen(() => {
        this.selected.push('discard');
        player.game.defer(new DiscardCards(player, 3, 3, 'Select 3 cards to discard'))
          .andThen(() => {
            this.selectNextAction(player);
            return undefined;
          });
        return undefined;
      }));
    }

    if (options.length > 0) {
      player.defer(new OrOptions(...options));
    }
  }
}