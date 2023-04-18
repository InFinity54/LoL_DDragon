# _League of Legends_ - Data Dragon

Do you want to use DDragon for an another game from _Riot Games_? Check the [_Data Dragon_ repository for _Teamfight Tactics_](https://github.com/InFinity54/TFT_DDragon), [for _Legends of Runeterra_](https://github.com/InFinity54/LoR_DDragon) or the [_Valorant_ one](https://github.com/InFinity54/Valorant_DDragon).

## Introduction
_Data Dragon_ is a package of files you can use for your projects about [_League of Legends_](https://www.leagueoflegends.com), distributed by Riot Games. A new version of Data Dragon is released some days after each game update. This repository allows you to update automatically all files more easily.

Don't forget that new patchs will be added right after their release on Riot Games' Developers website, but it takes often many days to come.

## Additional contents in this repository
This repository contains some additional files, not included in Data Dragon :

- Icons of all tiers with sublevels (I/II/III/IV) : Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grand Master, Challenger
- Icons of all lanes in the game, with some bonus : Top, Jungle, Mid, Bot, Support, Autofill, Unknown
- Icons of lanes in the game, for each tier (from Iron to Challenger) : Top, Jungle, Mid, Bot, Support
- Icons of all dragons : Cloud, Infernal, Mountain, Ocean, Elder
- Icons of others monsters : Rift Herald, Baron Nashor
- Icons of masteries level 1 to 7
- Icons for Creeps, Golds and Towers
- Icons of all champions types : Assassin, Fighter, Mage, Marksman, Support, Tank
- Icons of all Honor levels (from 0 to 5), their checkpoints and their rewards (Orb, Capsule, Flair, Key, Key Fragment, Honor 5 Token)
- All Summoners Spells Pictures and Data² (Ignite, Flash, Exhaust...)
- Animated icons of all Honor levels and their checkpoints (in .mp4 and .gif, use of .mp4 recommended)
- Champions Splashs used for the League of Legends' 10th Anniversary
- Game constants JSON files : list of all seasons, queues, maps, gamemodes and types of games from the game
- Some wallpapers used while in group or in queue in game client
- Some game loading screen backgrounds
- Previous and actual icons and logo of _League of Legends_
- Previous tiers icons (replaced since patch 12.1)
- Icons of all possible levels (from Iron to Challenger) for all existing challenges
- Icons for Mythic Essences

²For the moment, Data about Summoner Spells is only available in `en_US`, but the file will be translated into others langages later. 

## Unused contents in this repository
Because of the presence of all previous patchs (which can still be downloaded from Riot Games servers), some contents which became unused in _League of Legends_ are available in this repository. This content can be some deleted elements, or old versions of actual stuff. In the repository, you will find :

- Old runes and masteries, deleted from the game since patch 7.22 (November 8th, 2017)
- Some items icons that was previously removed from the game
- Minimap from old games modes or previous temporary games modes
- Old items icons, before the remastering of in-game shop and the remastering of all items of the game of patch 10.23, for the preseason 11 (patch released on November 11th, 2020)

## Additional notes
- Some files (tiles, loading splashs and splashs of champions especially) can be incorrect. This problem has been notifed to Riot Games, and [they actually work on a fix](https://github.com/RiotGames/developer-relations/issues/348).
- There is some other problems in champions JSON, like Ornn's upgraded items which doesn't appear in this JSONs files. Riot has been notified for this problem too, and [they are investigating the problem](https://github.com/RiotGames/developer-relations/issues/419).
- Some champions, like Fiddlesticks, are missed spelled in JSON files, which can create some problems when trying to retrieve images from data in JSONs files. [A fix is on the way](https://github.com/RiotGames/developer-relations/issues/83).
- Others problems has been reported to Riot Games, and you can find all of them (and the 3 above too) in the [Riot Games' Developer Relations Bug Tracking about League of Legends' Data Dragon](https://github.com/RiotGames/developer-relations/labels/topic%3A%20ddrag%20lol).

## Patchs added to this repository for the current season
This list contains patchs from actual season. For all previous patchs of all previous seasons, you can check [OLDPATCHS.md](OLDPATCHS.md).

The date in front of each patch represents the date when the patch was pushed to this repository, not the date when it was released by Riot Games. Here's a list of all patchs of current seasons included in this repository :

- (April 18th, 2023) 13.8.1
- (April 4th, 2023) 13.7.1
- (March 21st, 2023) 13.6.1
- (March 10th, 2023) 13.5.1
- (February 22nd, 2023) 13.4.1
- (February 10th, 2023) 13.3.1
- (January 10th, 2023) 13.1.1

## Missing patchs for the current season
Some patchs wasn't added to this repository, during this season, for various reasons :

- 13.2 : this patch was replaced by a hotfix (13.1B) after Riot hack, and don't exist at all
- 13.1B : _Data Dragon_ never released by Riot Games for this patch

Some patchs wasn't released by Riot Games for the oldest versions of League of Legends, for all hotfixes releases for the game. This is the case, for example, for patchs 3.6.1 to 3.6.13. Some others (old) patchs were also handled that way by Riot.