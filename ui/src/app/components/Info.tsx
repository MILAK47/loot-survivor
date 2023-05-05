import { NullAdventurer } from "../types";
import { useQuery } from "@apollo/client";
import { getItemsByAdventurer } from "../hooks/graphql/queries";
import { ANSIArt } from "./ANSIGenerator";
import Heart from "../../../public/heart.svg";
import Coin from "../../../public/coin.svg";
import { ItemDisplay } from "./ItemDisplay";
import LevelBar from "./LevelBar";
interface InfoProps {
  adventurer: any;
}

export default function Info({ adventurer }: InfoProps) {
  const formatAdventurer = adventurer ? adventurer : NullAdventurer;
  const {
    loading: itemsByAdventurerLoading,
    error: itemsByAdventurerError,
    data: itemsByAdventurerData,
    refetch: itemsByAdventurerRefetch,
  } = useQuery(getItemsByAdventurer, {
    variables: {
      adventurer: formatAdventurer.id,
    },
    pollInterval: 5000,
  });

  const items = itemsByAdventurerData ? itemsByAdventurerData.items : [];

  return (
    <div className="h-full border border-terminal-green">
      {!itemsByAdventurerLoading ? (
        <>
          <div className="flex flex-row gap-2 p-1">
            <div className="flex flex-col w-full p-2 uppercase">
              <div className="flex justify-between w-full text-4xl font-medium border-b border-terminal-green">
                {formatAdventurer.name}
                <span className="flex text-terminal-yellow">
                  <Coin className="self-center w-6 h-6 fill-current" />{" "}
                  {formatAdventurer.gold}
                </span>
                <span className="flex ">
                  <Heart className="self-center w-6 h-6 fill-current" />{" "}
                  {formatAdventurer.health}
                </span>
              </div>
              <div className="flex justify-between w-full text-2xl">
                <LevelBar
                  xp={formatAdventurer.xp}
                  level={formatAdventurer.level}
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <div className="">
                    <ItemDisplay
                      type={"weapon"}
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.weaponId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="head"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.headId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="chest"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.chestId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="hands"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.handsId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="waist"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.waistId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="feet"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.feetId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="neck"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.neckId
                      )}
                    />
                  </div>
                  <div className="">
                    <ItemDisplay
                      type="ring"
                      item={items.find(
                        (item: any) => item.id == formatAdventurer.ringId
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-1 text-xl">
                  {/* <ANSIArt
                    newWidth={100}
                    src={
                      formatAdventurer.health == 0 ? "/skull.png" : "/MIKE.png"
                    }
                  /> */}
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    STRENGTH{" "}
                    <span className="pl-3">{formatAdventurer.strength}</span>
                  </div>
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    DEXTERITY{" "}
                    <span className="pl-3">{formatAdventurer.dexterity}</span>
                  </div>
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    INTELLIGENCE{" "}
                    <span className="pl-3">
                      {formatAdventurer.intelligence}
                    </span>
                  </div>
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    VITALITY{" "}
                    <span className="pl-3">{formatAdventurer.vitality}</span>
                  </div>
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    WISDOM{" "}
                    <span className="pl-3">{formatAdventurer.wisdom}</span>
                  </div>
                  <div className="flex justify-between px-3 bg-terminal-green text-terminal-black">
                    LUCK <span className="pl-3">{formatAdventurer.luck}</span>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
