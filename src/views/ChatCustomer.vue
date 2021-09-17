<template>
  <v-container class="d-flex flex-column" fluid style="height:100%">
    <v-row style="max-height: 50px">
      <v-col>
        <h2>Cliente</h2>
      </v-col>
    </v-row>

    <v-row>
      <!-- <v-col cols="8">
        {{ chatData }}
      </v-col> -->
      <v-col cols="12" md="4">
        <v-card :flat="$vuetify.breakpoint.mobile" style="height:100%">
          <v-card-text
            class="d-flex flex-column pa-0" style="height:100%"
          >
            <div>
              <v-container>
                <v-row>
                  <v-col class="text-center" cols="2">
                    <v-avatar>
                      <v-img
                        src="https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar1_big.png"
                      ></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <h4 class="ma-0">{{ psycologist.name }}</h4>
                    <small class="text--secondary">{{
                      psycologistStatus
                    }}</small>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="flex-grow-1" style="position: relative">
              <div
                id="chatContainer"
                style="
                  position: absolute;
                  width: 100%;
                  overflow-y: auto;
                  max-height:100%
                "
              >
                <div class="ma-4">
                  <template v-for="(message, index) of messages">
                    <template v-if="message.from == 'customer'">
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
                </div>
              </div>
            </div>
            <div>
              <v-container>
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
                        placeholder="digite uma menssagem... ."
                      />
                    </div>
                    <div>
                      <v-btn
                        class="mr-2"
                        color="success"
                        fab
                        small
                        dark
                        @click="sendMessage()"
                        ><v-icon> mdi-send </v-icon></v-btn
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-card-text>
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
    customer: {
      id: 2,
      name: "Ze",
      uid: null,
    },

    // todo fetch from server
    psycologist: {
      id: 1,
      name: "Celso",
      uid: null,
    },

  }),

  created() {
    this.setChatData();

    this.storeCustomer();

    this.setCustomerStatus();

    this.fetchChatData();

    //this.login();

    // this.readMessages();

    // this.setChatRef();
  },

  computed: {
    psycologistStatus() {
      if (this.chatData) {
        try {
          return this.chatData.psycologistStatus ?? "offline";
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

    storeCustomer() {
      this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/customer")
        .set(this.customer);
    },

    setCustomerStatus() {
      var psycologistStatus = this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/customerStatus");

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
        this.scrollToEnd();
      });
    },

    sendMessage() {
      let message = {
        from: "customer",
        message: this.message,
      };

      this.$firebase
        .database()
        .ref("chats/" + this.chatId + "/messages/")
        .push(message);

      this.message = null;

      this.scrollToEnd();
    },

    scrollToEnd() {
      this.$nextTick(function () {
        var container = document.querySelector("#chatContainer");
        var scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      });
    },
  },
};
</script>

<style>
/* .fix {
  min-height: 100%;
} */
</style>