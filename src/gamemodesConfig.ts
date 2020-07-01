import {
  BpBling,
  BpDeathSound,
  BpTrail,
  SgVanityColor,
  SgArrowTrail,
  SgBattleCrie,
  HbClass,
  GameTypes
} from "hive-api/dist/hive.min.js";

const numFormat = (a: string | number) => new Number(a || 0).toLocaleString();
const strFormat = (a: string | number) =>
  a
    ? a
        .toString()
        .split(/\s/g)
        .map(
          a =>
            a
              .toString()
              .charAt(0)
              .toUpperCase() +
            a
              .toString()
              .slice(1)
              .toLowerCase()
        )
        .join(" ")
    : "none";
const dateFormat = (a: string) => new Date(a).toLocaleDateString();
const boolFormat = (a: string) =>
  strFormat(`${a == undefined ? "false" : a.toString()}`);

const secToDays = (a: number) => Math.floor(a / (60 * 60 * 24));
const secToHours = (a: number) => Math.floor(a / (60 * 60));
const secToMinutes = (a: number) => Math.floor(a / 60);

const timeFormat = (a: number) => {
  if (a < 0 || a === null) {
    return "???";
  }

  let res = "";

  if (secToDays(a) >= 1) {
    res += `${secToDays(a)}d `;
    a = a - secToDays(a) * 60 * 60 * 24;
  }

  if (secToHours(a) >= 1 || res != "") {
    res += `${secToHours(a)}h `;
    a = a - secToHours(a) * 60 * 60;
  }

  if (secToMinutes(a) >= 1 || res != "") {
    res += `${secToMinutes(a)}m `;
    a = a - secToMinutes(a) * 60;
  }

  res += `${a}s`;

  return res;
};
const subPropCount: <B>(a: keyof B) => (b: B) => string = a => b =>
  b ? numFormat(b[a] as any) : "0";

const unlocks = (a: { [key: number]: unknown }) => (b: unknown[]) =>
  `${numFormat(b ? b.length : 0)} / ${Object.keys(a).length}`;

const gameModeConfigs: {
  [key: string]: {
    stats: { title: string; prop: string; func: (val: any) => unknown }[];
    logins: { title: string; prop: string; func: (val: any) => unknown }[];
    leaderboard: { key: string; title: string }[];
  };
} = {
  BED: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Kills",
        prop: "kills",
        func: numFormat
      },
      {
        title: "Deaths",
        prop: "deaths",
        func: numFormat
      },
      {
        title: "Beds Destroyed",
        prop: "bedsDestroyed",
        func: numFormat
      },
      {
        title: "Teams Eliminated",
        prop: "teamsEliminated",
        func: numFormat
      },
      {
        title: "Win Streak",
        prop: "winStreak",
        func: numFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "total_points",
        title: "Points"
      },
      {
        key: "games_played",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "kills",
        title: "Kills"
      },
      {
        key: "deaths",
        title: "Deaths"
      },
      {
        key: "beds_destroyed",
        title: "Beds destroyed"
      },
      {
        key: "teams_eliminated",
        title: "Teams eliminated"
      }
    ]
  },
  BP: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Eliminations",
        prop: "totalElimination",
        func: numFormat
      },
      {
        title: "Placings",
        prop: "totalPlacing",
        func: numFormat
      },
      {
        title: "Selected Bling",
        prop: "selectedBling",
        func: strFormat
      },
      {
        title: "Blings Unlocked",
        prop: "unlockedBling",
        func: unlocks(Object.keys(BpBling))
      },
      {
        title: "Selected Death Sound",
        prop: "selectedDeathSound",
        func: strFormat
      },
      {
        title: "Death Sounds Unlocked",
        prop: "unlockedDeathSounds",
        func: unlocks(BpDeathSound)
      },
      {
        title: "Selected Trail",
        prop: "selectedTrail",
        func: strFormat
      },
      {
        title: "Trails Unlocked",
        prop: "unlockedTrails",
        func: unlocks(BpTrail)
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "total_points",
        title: "Points"
      },
      {
        key: "games_played",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "total_eliminations",
        title: "Eliminations"
      },
      {
        key: "total_placing",
        title: "Placings"
      }
    ]
  },
  DRAW: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Correct Guesses",
        prop: "correctGuesses",
        func: numFormat
      },
      {
        title: "Incorrect Guesses",
        prop: "incorrectGuesses",
        func: numFormat
      },
      {
        title: "Skips",
        prop: "skips",
        func: numFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "total_points",
        title: "Points"
      },
      {
        key: "gamesplayed",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "correct_guesses",
        title: "Correct Guesses"
      },
      {
        key: "incorrect_guesses",
        title: "Incorrect Guesses"
      },
      {
        key: "skips",
        title: "Skips"
      }
    ]
  },
  DR: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Kills",
        prop: "kills",
        func: numFormat
      },
      {
        title: "Deaths",
        prop: "deaths",
        func: numFormat
      },
      {
        title: "Games as Death",
        prop: "deathGamesPlayed",
        func: numFormat
      },
      /*
      These aren't working
      {
        title: "Wins as Death",
        prop: "deathWins",
        func: numFormat
      },*/
      {
        title: "Games as Runner",
        prop: "runnerGamesPlayed",
        func: numFormat
      },
      {
        title: "Wins as Runner",
        prop: "runnerWins",
        func: numFormat
      },
      {
        title: "Checkpoints passed",
        prop: "totalCheckpoints",
        func: numFormat
      },
      {
        title: "Traps activated",
        prop: "trapsActivated",
        func: numFormat
      },
      {
        title: "Runner Visibility",
        prop: "visibility",
        func: strFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "total_points",
        title: "Points"
      },
      {
        key: "games_played",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "kills",
        title: "Kills"
      },
      {
        key: "deaths",
        title: "Deaths"
      }
    ]
  },
  GRAV: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "points",
        title: "Points"
      },
      {
        key: "gamesplayed",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      }
    ]
  },
  HIDE: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Deaths",
        prop: "deaths",
        func: numFormat
      },
      {
        title: "Time Alive",
        prop: "timeAlive",
        func: timeFormat
      },
      {
        title: "Unlocked Blocks",
        prop: "blocks",
        func: a => (a ? a.length : 0)
      },
      {
        title: "Hider Kills",
        prop: "hiderKills",
        func: numFormat
      },
      {
        title: "Seeker Kills",
        prop: "seekerKills",
        func: numFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "points",
        title: "Points"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "hiderKills",
        title: "Hider Kills"
      },
      {
        key: "seekerKills",
        title: "SeekerKills"
      },
      {
        key: "deaths",
        title: "Deaths"
      }
    ]
  },
  SKY: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Kills",
        prop: "kills",
        func: numFormat
      },
      {
        title: "Deaths",
        prop: "deaths",
        func: numFormat
      },
      {
        title: "Most Points",
        prop: "mostPoints",
        func: numFormat
      },
      {
        title: "Time Alive",
        prop: "timeAlive",
        func: timeFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "total_points",
        title: "Points"
      },
      {
        key: "gamesplayed",
        title: "Games Played"
      },
      {
        key: "victories",
        title: "Victories"
      },
      {
        key: "kills",
        title: "Kills"
      },
      {
        key: "deaths",
        title: "Deaths"
      },
      {
        key: "most_points",
        title: "Most Points"
      }
    ]
  },
  SP: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Victories",
        prop: "victories",
        func: numFormat
      },
      {
        title: "Games Played",
        prop: "gamesPlayed",
        func: numFormat
      },
      {
        title: "Deaths",
        prop: "deaths",
        func: numFormat
      },
      {
        title: "Eggs fired",
        prop: "eggsFired",
        func: numFormat
      },
      {
        title: "Blocks Destroyed",
        prop: "blocksDestroyed",
        func: numFormat
      },
      {
        title: "Time Alive",
        prop: "timeAlive",
        func: timeFormat
      }
    ],
    logins: [
      {
        title: "First Login",
        prop: "firstLogin",
        func: dateFormat
      }
    ],
    leaderboard: [
      {
        key: "points",
        title: "Points"
      },
      {
        key: "played",
        title: "Games Played"
      },
      {
        key: "eggs",
        title: "Eggs Fired"
      },
      {
        key: "blocks",
        title: "Blocks Destoyed"
      },
      {
        key: "deaths",
        title: "Deaths"
      }
    ]
  },
  TIMV: {
    stats: [
      {
        title: "Points",
        prop: "points",
        func: numFormat
      },
      {
        title: "Most Points",
        prop: "mostPoints",
        func: numFormat
      },
      {
        title: "Role Points",
        prop: "rolePoints",
        func: numFormat
      },
      {
        title: "Traitor Points",
        prop: "traitorPoints",
        func: numFormat
      },
      {
        title: "Innocent Points",
        prop: "innocentPoints",
        func: numFormat
      },
      {
        title: "Detective Points",
        prop: "detectivePoints",
        func: numFormat
      },
      /*  {
          title: "Active Detective Stick",
          prop: "activeDetectiveStick",
          func: strFormat
        },
        {
          title: "Unlocked Detective Sticks",
          prop: "detectiveSticks",
          func: unlocks("TimvDetectiveStick")
        },
        {
          title: "Active Flare",
          prop: "activeFlareUpgrade",
          func: strFormat
        },
        {
          title: "Unlocked Flares",
          prop: "flareUpgrades",
          func: unlocks("TimvFlare")
        },*/
      {
        title: "Detective Book",
        prop: "detectiveBook",
        func: boolFormat
      }
    ],
    logins: [
    ],
    leaderboard: [
      {
        key: "karma",
        title: "Karma"
      },
      {
        key: "detective",
        title: "Detective Games"
      },
      {
        key: "innocent",
        title: "Innocent Games"
      },
      {
        key: "traitor",
        title: "Traitor Games"
      },
      {
        key: "mostPoints",
        title: "Most Points"
      }
    ]
  }
};

export default gameModeConfigs;
