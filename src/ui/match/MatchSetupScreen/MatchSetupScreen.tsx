import { useMemo, useState } from "react";

import type { Army } from "../../../domain/army/army.types";
import type { MatchConfig, MatchPlayerSetup } from "../../../domain/match/match.types";
import { listArmies } from "../../../services/army/armyRepository";
import {
  getCollection,
  getHeroById,
} from "../../../services/collection/collectionService";
import AppShell from "../../shell/AppShell/AppShell";
import NeonPortrait from "../../shared/NeonPortrait/NeonPortrait";

import "./MatchSetupScreen.css";

interface MatchSetupScreenProps {
  onBack: () => void;
  onStart: (config: MatchConfig) => void;
}

interface SeatDraft {
  heroId: string;
  armyId: string | null;
}

function buildSeat(
  draft: SeatDraft,
  armies: Army[],
  displayName: string,
): MatchPlayerSetup | null {
  if (!draft.heroId || !draft.armyId) {
    return null;
  }
  const army = armies.find((item) => item.id === draft.armyId);
  if (!army || army.heroId !== draft.heroId) {
    return null;
  }
  return {
    displayName,
    heroId: draft.heroId,
    army,
  };
}

function MatchSetupScreen({ onBack, onStart }: MatchSetupScreenProps) {
  const collection = useMemo(() => getCollection(), []);
  const armies = useMemo(() => listArmies(), []);
  const defaultHeroId = collection.heroes[0]?.id ?? "";

  const [seat0, setSeat0] = useState<SeatDraft>({
    heroId: defaultHeroId,
    armyId: null,
  });
  const [seat1, setSeat1] = useState<SeatDraft>({
    heroId: collection.heroes[1]?.id ?? defaultHeroId,
    armyId: null,
  });
  const [error, setError] = useState("");

  const armiesFor = (heroId: string) =>
    armies.filter((army) => army.heroId === heroId);

  const canStart = Boolean(
    buildSeat(seat0, armies, "Игрок 1") &&
      buildSeat(seat1, armies, "Игрок 2"),
  );

  const handleStart = () => {
    const player0 = buildSeat(seat0, armies, "Игрок 1");
    const player1 = buildSeat(seat1, armies, "Игрок 2");
    if (!player0 || !player1) {
      setError("Каждому игроку нужны герой и сохранённая армия.");
      return;
    }
    onStart({ players: [player0, player1] });
  };

  const renderSeat = (
    title: string,
    draft: SeatDraft,
    setDraft: (next: SeatDraft) => void,
  ) => {
    const hero = draft.heroId ? getHeroById(draft.heroId) : null;
    const heroArmies = armiesFor(draft.heroId);

    return (
      <section className="match-setup-seat">
        <header className="match-setup-seat-header">
          <h2>{title}</h2>
          {hero && (
            <NeonPortrait
              portraitId={hero.portraitId}
              label={hero.name}
              size="md"
            />
          )}
        </header>

        <label className="match-setup-field">
          <span>Герой</span>
          <select
            value={draft.heroId}
            onChange={(event) => {
              const heroId = event.target.value;
              setDraft({ heroId, armyId: null });
              setError("");
            }}
          >
            {collection.heroes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        {hero && (
          <p className="match-setup-trait">{hero.traitDescription}</p>
        )}

        <label className="match-setup-field">
          <span>Армия</span>
          <select
            value={draft.armyId ?? ""}
            onChange={(event) => {
              setDraft({
                ...draft,
                armyId: event.target.value || null,
              });
              setError("");
            }}
          >
            <option value="">— выберите сборку —</option>
            {heroArmies.map((army) => (
              <option key={army.id} value={army.id}>
                {army.name} ({army.unitDefinitionIds.length})
              </option>
            ))}
          </select>
        </label>

        {heroArmies.length === 0 && (
          <p className="match-setup-hint">
            Нет сохранённых армий для этого героя. Создайте сборку в разделе
            «Армии».
          </p>
        )}
      </section>
    );
  };

  return (
    <AppShell title="Классический · Оффлайн" onBack={onBack}>
      <div className="match-setup">
        <p className="match-setup-lead">
          Оффлайн: два игрока ходят по очереди, как в шахматах. Выберите героя
          и сохранённую армию для каждого, затем начните партию.
        </p>

        <div className="match-setup-grid">
          {renderSeat("Игрок 1", seat0, setSeat0)}
          {renderSeat("Игрок 2", seat1, setSeat1)}
        </div>

        {error && (
          <p className="match-setup-error" role="alert">
            {error}
          </p>
        )}

        <div className="match-setup-actions">
          <button
            type="button"
            className="match-setup-start"
            disabled={!canStart}
            onClick={handleStart}
          >
            Начать игру
          </button>
        </div>
      </div>
    </AppShell>
  );
}

export default MatchSetupScreen;
