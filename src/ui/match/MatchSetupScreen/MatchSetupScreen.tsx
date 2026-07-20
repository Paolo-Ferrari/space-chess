import { useEffect, useMemo, useState } from "react";

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
  const defaultHeroId = collection.heroes[0]?.id ?? "";

  const [armies, setArmies] = useState<Army[]>(() => listArmies());
  const [seat0, setSeat0] = useState<SeatDraft>(() => {
    const stored = listArmies();
    const heroId = defaultHeroId;
    return {
      heroId,
      armyId: stored.find((army) => army.heroId === heroId)?.id ?? null,
    };
  });
  const [seat1, setSeat1] = useState<SeatDraft>(() => {
    const stored = listArmies();
    const heroId = collection.heroes[1]?.id ?? defaultHeroId;
    return {
      heroId,
      armyId: stored.find((army) => army.heroId === heroId)?.id ?? null,
    };
  });
  const [error, setError] = useState("");

  // Re-read armies every time this screen opens (after editing in «Армии»).
  useEffect(() => {
    const stored = listArmies();
    setArmies(stored);

    const resolveArmyId = (heroId: string, armyId: string | null) => {
      if (
        armyId &&
        stored.some((army) => army.id === armyId && army.heroId === heroId)
      ) {
        return armyId;
      }
      return stored.find((army) => army.heroId === heroId)?.id ?? null;
    };

    setSeat0((current) => ({
      ...current,
      armyId: resolveArmyId(current.heroId, current.armyId),
    }));
    setSeat1((current) => ({
      ...current,
      armyId: resolveArmyId(current.heroId, current.armyId),
    }));
  }, []);

  const armiesFor = (heroId: string) =>
    armies.filter((army) => army.heroId === heroId);

  const canStart = Boolean(
    buildSeat(seat0, armies, "Игрок 1") &&
      buildSeat(seat1, armies, "Игрок 2"),
  );

  const handleStart = () => {
    const fresh = listArmies();
    setArmies(fresh);
    const player0 = buildSeat(seat0, fresh, "Игрок 1");
    const player1 = buildSeat(seat1, fresh, "Игрок 2");
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
              const firstArmy =
                listArmies().find((army) => army.heroId === heroId)?.id ?? null;
              setDraft({ heroId, armyId: firstArmy });
              setArmies(listArmies());
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
    <AppShell title="Классический · Локальная (2 окна)" onBack={onBack}>
      <div className="match-setup">
        <p className="match-setup-lead">
          После старта: эта вкладка — Игрок 1 (ваша армия), вторая вкладка —
          Игрок 2 (его армия). Ходы по очереди, партия общая.
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
