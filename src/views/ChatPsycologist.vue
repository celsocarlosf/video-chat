<template>
  <v-container class="d-flex flex-column" fluid>
    <v-row style="max-height: 80px">
      <v-col>
        <h4>Psicologo</h4>
      </v-col>
    </v-row>

    <v-row>
      <!-- <v-col cols="8">
        {{ chatData }}
      </v-col> -->
      <v-col cols="12" md="4">
        <v-card class="d-flex flex-column" style="height: 100%" :flat="$vuetify.breakpoint.mobile">
          <v-card-title>
            <v-row>
              <v-col class="text-center" cols="2">
                <v-avatar>
                  <v-img
                    src="https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar1_big.png"
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col>
                <h4 class="ma-0">{{ customer.name }}</h4>
                <small class="text--secondary">{{ customerStatus }}</small>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text style="flex: 1 1 auto">
            <template v-for="(message, index) of messages">
              <template v-if="message.from !== 'customer'">
                <div
                  class="d-flex"
                  style="flex-direction: row-reverse; width: 100%"
                  :key="index"
                >
                  <v-alert
                    color="green lighten-2"
                    dense
                    dark
                    style="display: inline-block"
                  >
                    {{ message.message }}
                  </v-alert>
                </div>
              </template>
              <template v-else>
                <div
                  class="d-flex"
                  style="flex-direction: row; width: 100%"
                  :key="index"
                >
                  <v-alert
                    color="grey lighten-1"
                    dense
                    dark
                    style="display: inline-block"
                  >
                    {{ message.message }}
                  </v-alert>
                </div>
              </template>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col class="d-flex align-center" cols="12">
                <div class="flex-grow-1">
                  <v-text-field
                    class="mr-4"
                    v-model="message"
                    solo
                    :hide-details="true"
                    flat
                    background-color="grey lighten-3"
                    placeholder="digite uma menssagem..."
                  />
                </div>
                <div>
                  <v-btn class="mr-2" color="success" fab small dark @click="sendMessage()"
                    ><v-icon> mdi-send </v-icon></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    /**
     *  chatId
     *    psycologist
     *    psycologistStatus
     *     participants
     *        name
     *        status
     *
     *     messages
     */
    chatId: null,

    message: null,

    chatData: {},

    // todo fetch from server
    psycologist: {
      id: 1,
      name: "Celso",
      uid: null,
    },

    // todo fetch from server
    customer: {
      id: 1,
      name: "Jose",
      uid: null,
    },
  }),

  created() {
    this.setChatData();

    this.storePsycologist();

    this.setPyscologistStatus();

    this.fetchChatData();

    //this.login();

    // this.readMessages();

    // this.setChatRef();
  },

  computed: {
    customerStatus() {
      if (this.chatData) {
        try {
          return this.chatData.customerStatus ?? "offline";
        } catch (e) {
          return "offline";
        }
      }
    },

    messages() {
      if (this.chatData) {
        try {
          return this.chatData.messages ?? [];
        } catch (e) {
          return [];
        }
      }

      return [];
    },
  },

  methods: {
    setChatData() {
      this.chatId = this.$route.params.chatId;
    },

    storePsycologist() {
      this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/psycologist")
        .set(this.psycologist);
    },

    setPyscologistStatus() {
      var psycologistStatus = this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/psycologistStatus");

      this.$firebase
        .database()
        .ref(".info/connected")
        .on("value", function (snapshot) {
          if (snapshot.val() == false) {
            return;
          }

          psycologistStatus
            .onDisconnect()
            .set("offline")
            .then(function () {
              psycologistStatus.set("online");
            });
        });
    },

    fetchChatData() {
      let counter = this.$firebase.database().ref("chats/" + this.chatId);
      counter.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        this.chatData = data;
      });
    },

    sendMessage() {
      let message = {
        from: "psycologist",
        message: this.message,
      };

      this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/messages/")
        .push(message);

      this.message = null;
    },
  },
};
</script>

<style>
</style>