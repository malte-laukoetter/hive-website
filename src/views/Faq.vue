<template>
  <hive-app>
    <div class="full-height">
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(question, index) in faq" :key="index">
          <v-expansion-panel-header>
            <span class="subtitle-1 ml-2">{{question.question}}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>            
            <span v-html="question.answer"></span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  metaInfo: {
    title: "FAQ",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `FAQ`
      }
    ]
  }
})
export default class FAQ extends Vue {
  faq: {question: string, answer: string}[] = [
    {
      question: 'Is this an offical The Hive website',
      answer: 'No.'
    }, {
      question: 'Who created this?',
      answer: '<a href="/players/ebdf264aabda45708f61f2d7a2bb4758">Lergin_</a>, you can find out more about him on his website: <a href="https://m-l.dev">https://m-l.dev</a>'
    }, {
      question: 'I think I\'m missing from one of the rankings, eventhough I have enough points/medals/...! Can I do something about that?',
      answer: 'It is not feasable to automaticly check all players. You can make sure a player is checked within the next 24 hours by opening the profile page about the them on this website (use the search).'
    }, {
      question: 'How are the levels for the Hide Block Levels ranking calculated?',
      answer: 'The calculation takes the block experience for all blocks and adds these together. Then these are converted to a level using the algorithm The Hive uses for calculating the levels while ignoring that a highest level exists.'
    }, {
      question: 'The achievement count used by the rankings is different than on the profile page!',
      answer: 'The achievement ranking only includes achievements that can still be collected on the server. The profile page includes all achievements.'
    }, {
      question: 'The maximal achievement count for the same game mode is different between players!',
      answer: 'The Hive API achievement list is missing the map win achievements, these are therefore only shown if they have already been collected. The count is therefore not always correct as it calculates the current amount of completed achievements + the missing achievements according to the api. With this calculation missing map achievements are not counted for the maximum number of possible achievements.'
    }, {
      question: 'Is there a forum post about this site?',
      answer: 'Yes there is: <a href="https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/">https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/</a>'
    }, {
      question: 'I found a bug! Where can I report it?',
      answer: 'You can send a message to Lergin_, either by e-mail to <a href="mailto:hive@lergin.de">hive@lergin.de</a> or on the <a href="https://forum.hivemc.com/conversations/add?to=lergin_">The Hive forums</a>. You can also just write a message in this forum post: <a href="https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/">https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/</a>'
    }, {
      question: 'Can you add XYZ?',
      answer: 'Maybe, just suggest it on the forum post: <a href="https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/">https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/</a>'
    }, {
      question: 'Can I get a notification when there is a change in the The Hive team?',
      answer: 'Yes! Just follow this twitter bot, it will tweet after every change: <a href="https://twitter.com/hivemc_updates">@hivemc_updates</a>'
    }, {
      question: 'Can I get a notification when there is a new map available on The Hive?',
      answer: 'Yes! Just follow this twitter bot, it will tweet whenever there is a new map: <a href="https://twitter.com/hivemc_updates">@hivemc_updates</a>'
    }, {
      question: 'Can I see the source code?',
      answer: 'Sure! It\'s available, split over multiple repositories, on GitHub: <a href="https://github.com/Lergin/hive-website">Lergin/hive-website</a>, <a href="https://github.com/Lergin/hive-datacollection">Lergin/hive-datacollection</a> and <a href="https://github.com/Lergin/hive-api">Lergin/hive-api</a>'
    }, {
      question: 'Life, the Universe, and Everything?',
      answer: '101010'
    }, {
      question: 'I have more questions!',
      answer: 'Just send a message to Lergin_ or post it in the <a href="https://forum.hivemc.com/threads/lergins-hive-stats-and-leaderboards.279319/">forum post</a>!'
    }
  ]
}
</script>
