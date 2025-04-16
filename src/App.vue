:start_line:1 :end_line:2 -------
<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from "vue";
import chatContainer from "./components/chat/chatContainer.vue";
import sidePanel from "./components/chat/sidePanel.vue";
import primaryButton from "./components/core/primaryButton.vue";
import myDialog from "./components/core/myDialog.vue";
import { useDialogStore } from "@/stores/dialogStore";

const dialogStore = useDialogStore();

const messages = ref<
  {
    type: string;
    content: string;
    recognitions: Array<SpeechRecognitionResult>;
  }[]
>([]);
const newMessage = ref("");
const isRecording = ref(false);
const interimTranscript = ref("");
const interviewStarted = ref(false);
const recognition_arr_results = ref<SpeechRecognitionResult[]>([]);
const currentInterviewer = ref({});
const chatId = ref(null);

let recognition: SpeechRecognition | null = null;
let socket: WebSocket;
let inactivityTimer: number | null = null;
const inactivityTimeout = 2500; // 2.5 seconds

const sendMessage = () => {
  if (newMessage.value || interimTranscript.value) {
    const messageContent = newMessage.value || interimTranscript.value;
    messages.value.push({
      type: "user",
      content: messageContent,
      recognitions: recognition_arr_results.value,
    });
    recognition_arr_results.value = [];
    socket.send(JSON.stringify({
        chatId: chatId.value,
        interviewerId: currentInterviewer.value.id,
        message: messageContent
    }));
    newMessage.value = "";
    interimTranscript.value = "";
    clearInactivityTimer();
  }
};

const clearInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

const handleInactivityTimeout = () => {
  if (!interimTranscript.value && !newMessage.value) {
    console.log("Inactivity timeout: nothing to send..");
    return;
  }
  console.log("Inactivity timeout: sending message");
  sendMessage();
};

const initInterview = (interviewer) => {
  if (
    currentInterviewer.value &&
    currentInterviewer.value.id != interviewer.id
  ) {
    dialogStore.openDialogConfirm({
      message: `Do you want to start a conversation with ${interviewer.name} - ${interviewer.description}?`,
      onConfirm: (result) => {
        currentInterviewer.value = interviewer;
        chatId.value = Math.floor(Math.random() * 100);
        startRecording(interviewer);
      },
      onClose: (result) => {
        console.log(result, "closed");
      },
    });
  } else {
    currentInterviewer.value = interviewer;
    startRecording(interviewer);
  }
};

const startRecording = (interviewer) => {
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    if (!messages.value.length) {
      messages.value.push({
        type: "interviewer",
        content: "Hi! Nice to meet you!",
        recognitions: [],
      });
    }
    interviewStarted.value = true;

    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-EN";

    recognition.onstart = () => {
      console.log("started rekognition");
      isRecording.value = true;
      interimTranscript.value = "";
      startInactivityTimer();
      console.log("end rekognition");
    };

    recognition.onresult = (event: any) => {
      console.log("got onresult");
      console.log(event.results);
      startInactivityTimer();
      let interim_transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newMessage.value += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      let arr: SpeechRecognitionResult[] = [];
      for (let i = 0; i < event.results.length; i++) {
        arr.push(event.results[i]);
      }
      recognition_arr_results.value = arr;
      interimTranscript.value = interim_transcript;
    };

    recognition.onerror = (event: any) => {
      console.log("Error occurred in recognition: " + event.error);
      stopRecording();
    };
    recognition.onend = () => {
      console.log("ended with transcript: " + interimTranscript.value);
      isRecording.value = false;
    };

    recognition.start();
  } else {
    alert("Speech Recognition Not Available");
  }
};

const stopRecording = () => {
  if (recognition) {
    recognition.stop();
    isRecording.value = false;
    clearInactivityTimer();
  }
};

const startInactivityTimer = () => {
  clearInactivityTimer();
  inactivityTimer = setTimeout(handleInactivityTimeout, inactivityTimeout);
};

onMounted(() => {
  socket = new WebSocket("ws://localhost:8080");

  socket.addEventListener("open", () => {
    console.log("WebSocket connected");
  });

  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    messages.value.push({
      type: "interviewer",
      content: event.data,
      recognitions: [],
    });
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket closed");
  });
});
</script>

<template>
  <div class="h-screen bg-gray-100 relative">
    <nav
      class="bg-primary px-2 h-18 text-3xl flex gap-3 items-center border-b-2 border-white"
    >
      <img class="w-15 bg-white rounded-full" src="@/assets/logos/logo.png" />
      <div class="text-white">The AInterviewer</div>
    </nav>

    <div class="flex">
      <sidePanel @interviewerChosen="initInterview"> </sidePanel>
      <chatContainer
        class="w-full p-0.5"
        :messages
        :interimTranscript
        :newMessage
        :interviewStarted
        :isRecording
      ></chatContainer>
    </div>
    <myDialog></myDialog>
    <div class="absolute w-full bottom-0 bg-primary h-[40px] text-white border-t-2 ">
      <p class="absolute bottom-0 right-0 text-sm">
        AInterviewer @{{ new Date().getFullYear() }} by Francesco Guarnieri
      </p>
    </div>
  </div>
</template>

<style scoped></style>
