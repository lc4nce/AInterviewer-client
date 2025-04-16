<template>
  <div class="p-4 h-[calc(100vh-110px)] overflow-auto border-b-2 border-white">
    <div v-if="interviewStarted" class="flex gap-4 items-center m-auto">
      <div class="text-md font-medium">
        Current status: {{ isRecording ? "recording" : " not recording" }}
      </div>

      <secondaryButton v-if="!isRecording" @click="startRecording"
        >Resume Interview</secondaryButton
      >
      
    </div>
    <div class="flex flex-col gap-1.5">
      <div v-for="(message, index) in messages" :key="index">
        <div class="flex gap-2 items-start transition-discrete">
          <div
            class="text-lg font-medium capitalize w-28 text-right"
            :class="{
              'text-red-500': message.type === 'user',
              'text-blue-500': message.type !== 'user',
            }"
          >
            {{ message.type }}:
          </div>
          <div
            v-if="!message.recognitions.length"
            class="text-lg text-left w-full"
          >
            {{ message.content }}
          </div>
          <div class="flex gap-2 flex-wrap text-lg" v-else>
            <span
              class="flex gap-2 flex-wrap"
              v-for="result in message.recognitions"
            >
              <span
                v-for="r in result"
                :class="{
                  'text-green-500': r.confidence > 0.92,
                  'text-red-500': r.confidence < 0.92,
                }"
              >
                {{ r.transcript }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="interimTranscript || newMessage"
        class="flex gap-2 items-start transition-discrete"
      >
        <div
          class="text-lg font-medium capitalize w-28 text-right text-red-500"
        >
          User:
        </div>
        <div class="text-lg text-left w-full">
          {{ interimTranscript }}{{ newMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from "vue";
import secondaryButton from "@/components/core/secondaryButton.vue"
const props = defineProps({
  messages: {
    type: Array,
  },
  interimTranscript: {
    type: String,
    default: "",
  },
  newMessage: {
    type: String,
    default: "",
  },
  interviewStarted: {
    type: Boolean,
    default: false,
  },
  isRecording: {
    type: Boolean,
    default: false,
  },
});
watch(props, (newProps) => {
  console.log(props);
});
</script>
