import type { ComponentType } from "react";

import { Icon_ArasakaCommander } from "./factions/arasaka/arasaka-commander";
import { Icon_ArasakaRipperdoc } from "./factions/arasaka/arasaka-ripperdoc";
import { Icon_ArasakaSoldier } from "./factions/arasaka/arasaka-soldier";
import { Icon_ArasakaElite } from "./factions/arasaka/arasaka-elite";
import { Icon_ArasakaCyberNinja } from "./factions/arasaka/arasaka-cyber-ninja";
import { Icon_ArasakaHeavy } from "./factions/arasaka/arasaka-heavy";
import { Icon_ArasakaRecon } from "./factions/arasaka/arasaka-recon";
import { Icon_ArasakaAdamSmasher } from "./factions/arasaka/arasaka-adam-smasher";
import { Icon_MilitechCommander } from "./factions/militech/militech-commander";
import { Icon_MilitechRipperdoc } from "./factions/militech/militech-ripperdoc";
import { Icon_MilitechTrooper } from "./factions/militech/militech-trooper";
import { Icon_MilitechGunner } from "./factions/militech/militech-gunner";
import { Icon_MilitechMech } from "./factions/militech/militech-mech";
import { Icon_MilitechTank } from "./factions/militech/militech-tank";
import { Icon_MilitechDrone } from "./factions/militech/militech-drone";
import { Icon_MilitechLegendary } from "./factions/militech/militech-legendary";
import { Icon_MaelstromCommander } from "./factions/maelstrom/maelstrom-commander";
import { Icon_MaelstromRipperdoc } from "./factions/maelstrom/maelstrom-ripperdoc";
import { Icon_MaelstromGanger } from "./factions/maelstrom/maelstrom-ganger";
import { Icon_MaelstromBerserker } from "./factions/maelstrom/maelstrom-berserker";
import { Icon_MaelstromChrome } from "./factions/maelstrom/maelstrom-chrome";
import { Icon_MaelstromShotgun } from "./factions/maelstrom/maelstrom-shotgun";
import { Icon_MaelstromGlitch } from "./factions/maelstrom/maelstrom-glitch";
import { Icon_MaelstromLegendary } from "./factions/maelstrom/maelstrom-legendary";
import { Icon_TygerClawsCommander } from "./factions/tygerclaws/tyger-claws-commander";
import { Icon_TygerClawsRipperdoc } from "./factions/tygerclaws/tyger-claws-ripperdoc";
import { Icon_TygerClawsBlade } from "./factions/tygerclaws/tyger-claws-blade";
import { Icon_TygerClawsAssassin } from "./factions/tygerclaws/tyger-claws-assassin";
import { Icon_TygerClawsRunner } from "./factions/tygerclaws/tyger-claws-runner";
import { Icon_TygerClawsMonk } from "./factions/tygerclaws/tyger-claws-monk";
import { Icon_TygerClawsSmoke } from "./factions/tygerclaws/tyger-claws-smoke";
import { Icon_TygerClawsLegendary } from "./factions/tygerclaws/tyger-claws-legendary";
import { Icon_ValentinosCommander } from "./factions/valentinos/valentinos-commander";
import { Icon_ValentinosRipperdoc } from "./factions/valentinos/valentinos-ripperdoc";
import { Icon_ValentinosSoldier } from "./factions/valentinos/valentinos-soldier";
import { Icon_ValentinosGuardian } from "./factions/valentinos/valentinos-guardian";
import { Icon_ValentinosGun } from "./factions/valentinos/valentinos-gun";
import { Icon_ValentinosBrother } from "./factions/valentinos/valentinos-brother";
import { Icon_ValentinosPriest } from "./factions/valentinos/valentinos-priest";
import { Icon_ValentinosLegendary } from "./factions/valentinos/valentinos-legendary";
import { Icon_VoodooBoysCommander } from "./factions/voodooboys/voodoo-boys-commander";
import { Icon_VoodooBoysRipperdoc } from "./factions/voodooboys/voodoo-boys-ripperdoc";
import { Icon_VoodooBoysNetrunner } from "./factions/voodooboys/voodoo-boys-netrunner";
import { Icon_VoodooBoysGuard } from "./factions/voodooboys/voodoo-boys-guard";
import { Icon_VoodooBoysGhost } from "./factions/voodooboys/voodoo-boys-ghost";
import { Icon_VoodooBoysIce } from "./factions/voodooboys/voodoo-boys-ice";
import { Icon_VoodooBoysSignal } from "./factions/voodooboys/voodoo-boys-signal";
import { Icon_VoodooBoysLegendary } from "./factions/voodooboys/voodoo-boys-legendary";
import { Icon_NomadsCommander } from "./factions/nomads/nomads-commander";
import { Icon_NomadsRipperdoc } from "./factions/nomads/nomads-ripperdoc";
import { Icon_NomadsScout } from "./factions/nomads/nomads-scout";
import { Icon_NomadsRider } from "./factions/nomads/nomads-rider";
import { Icon_NomadsTech } from "./factions/nomads/nomads-tech";
import { Icon_NomadsBuggy } from "./factions/nomads/nomads-buggy";
import { Icon_NomadsSniper } from "./factions/nomads/nomads-sniper";
import { Icon_NomadsLegendary } from "./factions/nomads/nomads-legendary";
import { Icon_NcpdCommander } from "./factions/ncpd/ncpd-commander";
import { Icon_NcpdRipperdoc } from "./factions/ncpd/ncpd-ripperdoc";
import { Icon_NcpdOfficer } from "./factions/ncpd/ncpd-officer";
import { Icon_NcpdRiot } from "./factions/ncpd/ncpd-riot";
import { Icon_NcpdMaxtac } from "./factions/ncpd/ncpd-maxtac";
import { Icon_NcpdSniper } from "./factions/ncpd/ncpd-sniper";
import { Icon_NcpdDrone } from "./factions/ncpd/ncpd-drone";
import { Icon_NcpdLegendary } from "./factions/ncpd/ncpd-legendary";
import { Icon_AnimalsCommander } from "./factions/animals/animals-commander";
import { Icon_AnimalsRipperdoc } from "./factions/animals/animals-ripperdoc";
import { Icon_AnimalsBrawler } from "./factions/animals/animals-brawler";
import { Icon_AnimalsTank } from "./factions/animals/animals-tank";
import { Icon_AnimalsSlugger } from "./factions/animals/animals-slugger";
import { Icon_AnimalsWrestler } from "./factions/animals/animals-wrestler";
import { Icon_AnimalsRoider } from "./factions/animals/animals-roider";
import { Icon_AnimalsLegendary } from "./factions/animals/animals-legendary";
import { Icon_6thStreetCommander } from "./factions/sixthstreet/6th-street-commander";
import { Icon_6thStreetRipperdoc } from "./factions/sixthstreet/6th-street-ripperdoc";
import { Icon_6thStreetRifle } from "./factions/sixthstreet/6th-street-rifle";
import { Icon_6thStreetMg } from "./factions/sixthstreet/6th-street-mg";
import { Icon_6thStreetFort } from "./factions/sixthstreet/6th-street-fort";
import { Icon_6thStreetMarksman } from "./factions/sixthstreet/6th-street-marksman";
import { Icon_6thStreetPatrol } from "./factions/sixthstreet/6th-street-patrol";
import { Icon_6thStreetLegendary } from "./factions/sixthstreet/6th-street-legendary";
import { Icon_EdgeSoloBlade } from "./factions/edgerunners/edge-solo-blade";
import { Icon_EdgeNetrunnerGhost } from "./factions/edgerunners/edge-netrunner-ghost";
import { Icon_EdgeTechieWrench } from "./factions/edgerunners/edge-techie-wrench";

import { IconFallback } from "./shared/IconFallback";

/**
 * Board icon registry — unitId → unique faction SVG component.
 * Add a unit: generate icon file + one line here (or re-run generate-faction-icons.mjs).
 */
export const ICON_REGISTRY: Record<string, ComponentType> = {
  "arasaka-commander": Icon_ArasakaCommander,
  "arasaka-ripperdoc": Icon_ArasakaRipperdoc,
  "arasaka-soldier": Icon_ArasakaSoldier,
  "arasaka-elite": Icon_ArasakaElite,
  "arasaka-cyber-ninja": Icon_ArasakaCyberNinja,
  "arasaka-heavy": Icon_ArasakaHeavy,
  "arasaka-recon": Icon_ArasakaRecon,
  "arasaka-adam-smasher": Icon_ArasakaAdamSmasher,
  "militech-commander": Icon_MilitechCommander,
  "militech-ripperdoc": Icon_MilitechRipperdoc,
  "militech-trooper": Icon_MilitechTrooper,
  "militech-gunner": Icon_MilitechGunner,
  "militech-mech": Icon_MilitechMech,
  "militech-tank": Icon_MilitechTank,
  "militech-drone": Icon_MilitechDrone,
  "militech-legendary": Icon_MilitechLegendary,
  "maelstrom-commander": Icon_MaelstromCommander,
  "maelstrom-ripperdoc": Icon_MaelstromRipperdoc,
  "maelstrom-ganger": Icon_MaelstromGanger,
  "maelstrom-berserker": Icon_MaelstromBerserker,
  "maelstrom-chrome": Icon_MaelstromChrome,
  "maelstrom-shotgun": Icon_MaelstromShotgun,
  "maelstrom-glitch": Icon_MaelstromGlitch,
  "maelstrom-legendary": Icon_MaelstromLegendary,
  "tyger-claws-commander": Icon_TygerClawsCommander,
  "tyger-claws-ripperdoc": Icon_TygerClawsRipperdoc,
  "tyger-claws-blade": Icon_TygerClawsBlade,
  "tyger-claws-assassin": Icon_TygerClawsAssassin,
  "tyger-claws-runner": Icon_TygerClawsRunner,
  "tyger-claws-monk": Icon_TygerClawsMonk,
  "tyger-claws-smoke": Icon_TygerClawsSmoke,
  "tyger-claws-legendary": Icon_TygerClawsLegendary,
  "valentinos-commander": Icon_ValentinosCommander,
  "valentinos-ripperdoc": Icon_ValentinosRipperdoc,
  "valentinos-soldier": Icon_ValentinosSoldier,
  "valentinos-guardian": Icon_ValentinosGuardian,
  "valentinos-gun": Icon_ValentinosGun,
  "valentinos-brother": Icon_ValentinosBrother,
  "valentinos-priest": Icon_ValentinosPriest,
  "valentinos-legendary": Icon_ValentinosLegendary,
  "voodoo-boys-commander": Icon_VoodooBoysCommander,
  "voodoo-boys-ripperdoc": Icon_VoodooBoysRipperdoc,
  "voodoo-boys-netrunner": Icon_VoodooBoysNetrunner,
  "voodoo-boys-guard": Icon_VoodooBoysGuard,
  "voodoo-boys-ghost": Icon_VoodooBoysGhost,
  "voodoo-boys-ice": Icon_VoodooBoysIce,
  "voodoo-boys-signal": Icon_VoodooBoysSignal,
  "voodoo-boys-legendary": Icon_VoodooBoysLegendary,
  "nomads-commander": Icon_NomadsCommander,
  "nomads-ripperdoc": Icon_NomadsRipperdoc,
  "nomads-scout": Icon_NomadsScout,
  "nomads-rider": Icon_NomadsRider,
  "nomads-tech": Icon_NomadsTech,
  "nomads-buggy": Icon_NomadsBuggy,
  "nomads-sniper": Icon_NomadsSniper,
  "nomads-legendary": Icon_NomadsLegendary,
  "ncpd-commander": Icon_NcpdCommander,
  "ncpd-ripperdoc": Icon_NcpdRipperdoc,
  "ncpd-officer": Icon_NcpdOfficer,
  "ncpd-riot": Icon_NcpdRiot,
  "ncpd-maxtac": Icon_NcpdMaxtac,
  "ncpd-sniper": Icon_NcpdSniper,
  "ncpd-drone": Icon_NcpdDrone,
  "ncpd-legendary": Icon_NcpdLegendary,
  "animals-commander": Icon_AnimalsCommander,
  "animals-ripperdoc": Icon_AnimalsRipperdoc,
  "animals-brawler": Icon_AnimalsBrawler,
  "animals-tank": Icon_AnimalsTank,
  "animals-slugger": Icon_AnimalsSlugger,
  "animals-wrestler": Icon_AnimalsWrestler,
  "animals-roider": Icon_AnimalsRoider,
  "animals-legendary": Icon_AnimalsLegendary,
  "6th-street-commander": Icon_6thStreetCommander,
  "6th-street-ripperdoc": Icon_6thStreetRipperdoc,
  "6th-street-rifle": Icon_6thStreetRifle,
  "6th-street-mg": Icon_6thStreetMg,
  "6th-street-fort": Icon_6thStreetFort,
  "6th-street-marksman": Icon_6thStreetMarksman,
  "6th-street-patrol": Icon_6thStreetPatrol,
  "6th-street-legendary": Icon_6thStreetLegendary,
  "edge-solo-blade": Icon_EdgeSoloBlade,
  "edge-netrunner-ghost": Icon_EdgeNetrunnerGhost,
  "edge-techie-wrench": Icon_EdgeTechieWrench,
};

export function getUnitIconComponent(unitId: string): ComponentType {
  return ICON_REGISTRY[unitId] ?? IconFallback;
}
