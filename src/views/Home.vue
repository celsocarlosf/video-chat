<template>
  <div>
    <video ref="webcamVideo" autoplay playsinline />
    <video ref="remoteVideo" autoplay playsinline />
    <button @click="setup()">Iniciar</button>
    <button @click="call()">call</button>
    <hr />
    <input v-model="callId" label="CallId" />
    <button @click="answerCall()">answerCall</button>

    <br />
    {{ iceCandidates }}
    <hr />
    callid : {{ callId }}
    <hr />
    {{ users }}
  </div>
</template>

<script>
export default {
  data: () => ({
    servers: {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    },

    callId: null,
    pc: null,
    localStream: null,
    remoteStream: null,
    offer: null,
    iceCandidates: null,
    users : null
  }),

  watch: {
    offer(val) {
      this.incommingCall(val);
    },
  },

  methods: {
    async setup() {
      this.users = this.$firestore.collection("user").doc();
      let users = await this.users.get()
      console.log('users...')
      console.log(users)
      // this.users.set({ username : 'celso', status : 1})

      this.pc = new RTCPeerConnection(this.servers);

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.remoteStream = new MediaStream();

      this.localStream.getTracks().forEach((track) => {
        console.log("track...", track);
        this.pc.addTrack(track, this.localStream);
      });

      this.$refs.webcamVideo.srcObject = this.localStream;
      this.$refs.remoteVideo.srcObject = this.remoteStream;

      this.pc.ontrack = (event) => {
        console.log("event...", event);
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
          console.log("track2...", track);
        });
      };
    },

    async call() {
      const callDoc = this.$firestore.collection("calls").doc();

      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      this.callId = callDoc.id;

      // Get candidates for caller, save to db
      this.pc.onicecandidate = (event) => {
        console.log("onicecandidate...", event);
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      // create offer
      const offerDescription = await this.pc.createOffer();

      await this.pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        console.log("listen to remote answer...", data);
        if (!this.pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          this.pc.setRemoteDescription(answerDescription);
        }
      });

      // Listen for remote ICE candidates
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            this.pc.addIceCandidate(candidate);
          }
        });
      });

      // this.offer = offer;
    },

    async incommingCall() {},

    async answerCall() {
      // const callId = callInput.value;
      const callDoc = this.$firestore.collection("calls").doc(this.callId);
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      this.pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await this.pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      // Listen to offer candidates

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === "added") {
            let data = change.doc.data();
            this.pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    },
  },
};
</script>
