<template>
    <div class="bg-primary w-120">
        <div class="flex flex-col gap-2 m-1 shadow text-white" >
            <div @click="$emit('interviewerChosen',interviewer)" class="cursor-pointer border-b-2 p-2 hover:bg-white/20 transition ease-in-out" v-for="interviewer of interviewers">
                <div class="text-lg font-medium">
                    {{ interviewer.name }}
                </div>
                <div class="text-sm">
                    {{ interviewer.description }}
                </div>
            </div>            
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const interviewers = ref([{
    name: "HR OpenAI",
    description: "first phone call",
    type: "HR",
    id: "OPENAI_HR_1"
},{
    name: "HR OpenAI",
    description: "conoscitivo meet",
    type: "HR",
    id: "OPENAI_HR_2"
},{
    name: "Technical interview OpenAI",
    description: "focus on tech stack and experience",
    type: "TECH",
    id: "OPENAI_TECH_1"
}])
</script>

