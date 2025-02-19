# _League of Legends_ - Data Dragon

Do you want to use DDragon for an another game from _Riot Games_? Check the _Data Dragon_ repository for [_2XKO_](https://github.com/InFinity54/2XKO_DDragon), [_Legends of Runeterra_](https://github.com/InFinity54/LoR_DDragon), or [_Valorant_](https://github.com/InFinity54/Valorant_DDragon). _Teamfight Tactics_ data is now included in this repository.

## Introduction
_Data Dragon_ is a package of files you can use for your projects about [_League of Legends_](https://www.leagueoflegends.com), distributed by Riot Games. A new version of Data Dragon is released some days after each game update. This repository allows you to update automatically all files more easily.

Don't forget that new patchs will be added right after their release on Riot Games' Developers website, but it takes often many days to come.

Since patch 13.12.1 and set 9 release for _Teamfight Tactics_, this repository is also containing data from _Teamfight Tactics_.

Starting the 15th season of _League_, _Riot_ decided to change the way patchs are named. This repository will not reflect this change, because _Riot_ did not reflect it in _Data Dragon_'s files too. You can find more information about this in the "Patchs added to this repository for the current season" of this document. This change has been partially reverted on February 19th: changes will appear here too, in README, but not in repository.

## Additional contents in this repository
This repository contains some additional files, not included in Data Dragon :

- Icons of all tiers (without sublevels), since the last rework in patch 12.1 : Unranked, Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grand Master, Challenger
- Icons of all tiers with sublevels (I/II/III/IV), used after the first rework and until the end of season 11 : Unranked, Bronze, Silver, Gold, Platinum, Diamond, Master, Grand Master, Challenger
- Icons of all tiers with sublevels (I/II/III/IV/V), used in first seasons of League : Provisional, Bronze, Silver, Gold, Platinum, Diamond, Master, Challenger
- Icons of all lanes in the game, with some bonus : Top, Jungle, Mid, Bot, Support, Autofill, Unknown
- Icons of lanes in the game, for each tier (from Iron to Challenger) : Top, Jungle, Mid, Bot, Support
- Icons of all dragons : Cloud, Infernal, Mountain, Ocean, Elder
- Icons of others monsters : Rift Herald, Baron Nashor
- Icons of new champion masteries system (released on live servers in patch 14.10)
- Icons for Creeps, Golds and Towers
- Icons of all champions types : Assassin, Fighter, Mage, Marksman, Support, Tank
- Icons of all Honor levels (from 0 to 5), their checkpoints and their rewards (Orb, Capsule, Flair, Key, Key Fragment, Honor 5 Token)
- Icons of all possible in-game statistics, like health, AD, AP, armor...
- All Summoners Spells Pictures and Data² (Ignite, Flash, Exhaust...)
- Animated icons of all Honor levels and their checkpoints (in .mp4 and .gif, use of .mp4 recommended)
- Champions Splashs used for the League of Legends' 10th Anniversary
- Game constants JSON files : list of all seasons, queues, maps, gamemodes and types of games from the game
- Some wallpapers used while in group or in queue in game client
- Some game loading screen backgrounds
- Previous and actual icons and logo of _League of Legends_
- Icons of all possible levels (from Iron to Challenger) for all existing challenges
- Icons for Mythic Essences
- Icons of all turbo badges (used for _Hyper Roll_ game mode for _Teamfight Tactics_)
- Icons of all _Double Up_ badges (used for _Double Up_ game mode for _Teamfight Tactics_)
- Icons of old champion mastery levels 1 to 7, before the rework of patch 14.10

## Unused contents in this repository
Because of the presence of all previous patchs (which can still be downloaded from Riot Games servers), some contents which became unused in _League of Legends_ are available in this repository. This content can be some deleted elements, or old versions of actual stuff. In the repository, you will find :

- Old runes and masteries, deleted from the game since patch 7.22 (November 8th, 2017)
- Some items icons that was previously removed from the game
- Minimap from old games modes or previous temporary games modes
- Old items icons, before the remastering of in-game shop and the remastering of all items of the game of patch 10.23, for the preseason 11 (patch released on November 11th, 2020)

## Additional notes
- Some champions, like Fiddlesticks, are missed spelled in JSON files, which can create some problems when trying to retrieve images from data in JSONs files. [A fix is on the way](https://github.com/RiotGames/developer-relations/issues/83).
- Others problems has been reported to Riot Games, and you can find all of them (and the 3 above too) in the [Riot Games' Developer Relations Bug Tracking about League of Legends' Data Dragon](https://github.com/RiotGames/developer-relations/labels/topic%3A%20ddrag%20lol).
- Starting patch 13.10.1, Vietnamese language code has been changed by Riot from `vn_VN` to `vi_VN`. The `vn_VN` files has been moved to the `vi_VN` folder, including unused data. This has been [announced by Riot on Twitter](https://twitter.com/RiotGamesDevRel/status/1658949539867271171).

## Patchs added to this repository for the current season
This list contains patchs from actual season. For all previous patchs of all previous seasons, you can check [OLDPATCHS.md](OLDPATCHS.md).

**IMPORTANT NOTE: _Riot_ decided to change the way patchs are named since the start of the 15th season. Please note that this repository will not reflect this change, because _Riot_ did not reflect it either in files provided for the _League of Legends Data Dragon_. This can be explained by _Teamfight Tactics_, which is included in these files, keeping the old name system. The first patch of the 15th season will be named 25.S1.1 for _LoL_ and 15.1 for _TFT_. This README will contain both names, but Git tags and repository files will keep the old naming system.**

The date in front of each patch represents the date when the patch was pushed to this repository, not the date when it was released by Riot Games. Here's a list of all patchs of current seasons included in this repository :

- (February 19th, 2024) 15.4.1 / 25.04
- (February 5th, 2024) 15.3.1 / 25.S1.3
- (January 22nd, 2024) 15.2.1 / 25.S1.2
- (January 8th, 2024) 15.1.1 / 25.S1.1

## Missing patchs for the current season
There is currently no missing patch for the current season.