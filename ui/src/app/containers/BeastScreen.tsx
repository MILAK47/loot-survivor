import KeyboardControl, { ButtonData } from "../components/KeyboardControls";
import { BattleDisplay } from "../components/beast/BattleDisplay";
import { BeastDisplay } from "../components/beast/BeastDisplay";
import useLoadingStore from "../hooks/useLoadingStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import { useQueriesStore } from "../hooks/useQueryStore";
import React, { useState } from "react";
import { processBeastName } from "../lib/utils";
import { Battle, NullDiscovery, NullBeast } from "../types";
import { Button } from "../components/buttons/Button";
import { syscalls } from "../lib/utils/syscalls";
import { useContracts } from "../hooks/useContracts";
import useTransactionCartStore from "../hooks/useTransactionCartStore";
import {
  useTransactionManager,
  useContractWrite,
  useAccount,
} from "@starknet-react/core";
import useUIStore from "../hooks/useUIStore";

/**
 * @container
 * @description Provides the beast screen for adventurer battles.
 */
export default function BeastScreen() {
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const loading = useLoadingStore((state) => state.loading);
  const [showBattleLog, setShowBattleLog] = useState(false);

  const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);
  const isAlive = useAdventurerStore((state) => state.computed.isAlive);
  const lastBeast = useQueriesStore(
    (state) => state.data.lastBeastQuery?.discoveries[0] || NullDiscovery
  );
  const beastData = useQueriesStore(
    (state) => state.data.beastQuery?.beasts[0] || NullBeast
  );
  const formatBattles = useQueriesStore(
    (state) => state.data.battlesByBeastQuery?.battles || []
  );

  const { gameContract, lordsContract } = useContracts();
  const { addTransaction } = useTransactionManager();
  const { data: queryData, resetData, setData } = useQueriesStore();
  const { account } = useAccount();
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);
  const calls = useTransactionCartStore((state) => state.calls);
  const handleSubmitCalls = useTransactionCartStore(
    (state) => state.handleSubmitCalls
  );
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);
  const setTxAccepted = useLoadingStore((state) => state.setTxAccepted);
  const hash = useLoadingStore((state) => state.hash);
  const setTxHash = useLoadingStore((state) => state.setTxHash);
  const { writeAsync } = useContractWrite({ calls });
  const equipItems = useUIStore((state) => state.equipItems);
  const setEquipItems = useUIStore((state) => state.setEquipItems);
  const setDropItems = useUIStore((state) => state.setDropItems);
  const setDeathMessage = useLoadingStore((state) => state.setDeathMessage);
  const showDeathDialog = useUIStore((state) => state.showDeathDialog);
  const resetNotification = useLoadingStore((state) => state.resetNotification);
  const removeEntrypointFromCalls = useTransactionCartStore(
    (state) => state.removeEntrypointFromCalls
  );

  const { attack, flee } = syscalls({
    gameContract,
    lordsContract,
    addTransaction,
    account,
    queryData,
    resetData,
    setData,
    adventurer,
    addToCalls,
    calls,
    handleSubmitCalls,
    startLoading,
    stopLoading,
    setTxHash,
    writeAsync,
    setEquipItems,
    setDropItems,
    setDeathMessage,
    showDeathDialog,
    resetNotification,
  });

  const [buttonText, setButtonText] = useState("Flee!");

  const handleMouseEnter = () => {
    setButtonText("you coward!");
  };

  const handleMouseLeave = () => {
    setButtonText("Flee!");
  };

  const attackButtonsData: ButtonData[] = [
    {
      id: 1,
      label: "SINGLE",
      action: async () => {
        attack(false, beastData);
      },
      disabled:
        adventurer?.beastHealth == undefined ||
        adventurer?.beastHealth == 0 ||
        loading,
      loading: loading,
    },
    {
      id: 2,
      label: "TILL DEATH",
      mouseEnter: handleMouseEnter,
      mouseLeave: handleMouseLeave,
      action: async () => {
        attack(true, beastData);
      },
      disabled:
        adventurer?.beastHealth == undefined ||
        adventurer?.beastHealth == 0 ||
        loading,
      loading: loading,
    },
  ];

  const fleeButtonsData: ButtonData[] = [
    {
      id: 1,
      label: adventurer?.dexterity === 0 ? "DEX TOO LOW" : "SINGLE",
      action: async () => {
        flee(true, beastData);
      },
      disabled:
        adventurer?.beastHealth == undefined ||
        adventurer?.beastHealth == 0 ||
        loading ||
        adventurer?.level == 1 ||
        adventurer.dexterity === 0,
      loading: loading,
    },
    {
      id: 2,
      label: adventurer?.dexterity === 0 ? "DEX TOO LOW" : "TILL DEATH",
      mouseEnter: handleMouseEnter,
      mouseLeave: handleMouseLeave,
      action: async () => {
        flee(true, beastData);
      },
      disabled:
        adventurer?.beastHealth == undefined ||
        adventurer?.beastHealth == 0 ||
        loading ||
        adventurer?.level == 1 ||
        adventurer.dexterity === 0,
      loading: loading,
    },
  ];

  const beastName = processBeastName(
    beastData?.beast ?? "",
    beastData?.special2 ?? "",
    beastData?.special3 ?? ""
  );

  const BattleLog: React.FC = () => (
    <div className="flex flex-col p-2 items-center">
      <Button
        className="w-1/2 sm:hidden"
        onClick={() => setShowBattleLog(false)}
      >
        Back
      </Button>
      <div className="flex flex-col items-center gap-5 p-2">
        <div className="text-xl uppercase">
          Battle log with {beastData?.beast}
        </div>
        <div className="flex flex-col gap-2 ext-sm overflow-y-auto h-96 text-center">
          {formatBattles.map((battle: Battle, index: number) => (
            <div className="border p-2 border-terminal-green" key={index}>
              <BattleDisplay battleData={battle} beastName={beastName} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (showBattleLog) {
    return <BattleLog />;
  }

  return (
    <div className="sm:w-2/3 sm:h-2/3 flex flex-col sm:flex-row">
      <div className="sm:w-1/2 order-1 sm:order-2">
        {hasBeast ? (
          <>
            <BeastDisplay beastData={beastData} />
          </>
        ) : (
          <div className="flex flex-col items-center border-2 border-terminal-green">
            <p className="m-auto text-lg uppercase text-terminal-green">
              Beast not yet discovered.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 sm:gap-0 items-center sm:w-1/2 sm:p-4 order-1 text-lg">
        {isAlive && (
          <>
            <div className="sm:hidden flex flex-row gap-2 sm:flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <p className="uppercase sm:text-2xl">Attack</p>
                <KeyboardControl
                  buttonsData={attackButtonsData}
                  size={"sm"}
                  direction="row"
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase sm:text-2xl">Flee</p>
                <KeyboardControl
                  buttonsData={fleeButtonsData}
                  size={"sm"}
                  direction="row"
                />
              </div>
            </div>
            <div className="hidden sm:block flex flex-row gap-2 sm:flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <p className="uppercase sm:text-2xl">Attack</p>
                <KeyboardControl
                  buttonsData={attackButtonsData}
                  size={"xl"}
                  direction="row"
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="uppercase sm:text-2xl">Flee</p>
                <KeyboardControl
                  buttonsData={fleeButtonsData}
                  size={"lg"}
                  direction="row"
                />
              </div>
            </div>
          </>
        )}

        <div className="hidden sm:block">
          {(hasBeast || formatBattles.length > 0) && <BattleLog />}
        </div>

        <Button
          className="sm:hidden uppercase"
          onClick={() => setShowBattleLog(true)}
        >
          Battle log with {beastData?.beast}
        </Button>
      </div>
    </div>
  );
}
