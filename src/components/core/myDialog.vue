<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "radix-vue";
import { Icon } from "@iconify/vue";
import { useDialogStore } from "../../stores/dialogStore";
import { ref, watch } from "vue";

const dialogStore = useDialogStore();
const isOpen = ref(false);
watch(dialogStore, (newStore) => {
  isOpen.value = newStore.isDialogOpen;
});
</script>

<template>
  <div>
    <DialogRoot :open="isOpen" @update:open="isOpen = $event" >
      <DialogPortal>
        <DialogOverlay
          class="bg-primary/20 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle class="m-0 text-lg font-semibold">
            Message from AInterviewer
          </DialogTitle>
          <DialogDescription class="my-5 leading-normal">
            {{ dialogStore.dialogData?.message }}
          </DialogDescription>

          <div class="mt-10 flex gap-4 justify-end">
            <div class="flex gap-2 justify-end" v-if="dialogStore.isDialogConfirm">
              <DialogClose
                as-child
                @click="dialogStore.closeDialog('Dialog closed with success')"
              >
                <button
                  class="bg-white border-primary border-2 text-primary hover:bg-primary/20 focus:shadow-primary inline-flex h-10 items-center justify-center rounded-md px-4 font-semibold leading-none focus:shadow-sm outline-none"
                >
                  Close
                </button>
              </DialogClose>
              <DialogClose
                as-child
                @click="dialogStore.confirmDialog('Dialog confirmed with success')"
              >
                <button
                  class="bg-primary text-white hover:bg-primary/80 focus:shadow-primary inline-flex h-10 items-center justify-center rounded-md px-4 font-semibold leading-none focus:shadow-sm outline-none"
                >
                  Confirm
                </button>
              </DialogClose>
            </div>
            <div v-else>
              <DialogClose
                as-child
                @click="dialogStore.closeDialog('Dialog closed with success')"
              >
                <button
                  class="bg-primary text-white hover:bg-primary/80 focus:shadow-primary inline-flex h-10 items-center justify-center rounded-md px-4 font-semibold leading-none focus:shadow-sm outline-none"
                >
                  Close
                </button>
              </DialogClose>
            </div>
          </div>

          <DialogClose
            @click="dialogStore.closeDialog('Dialog closed with success')"
            class="hover:bg-primary/10 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-sm shadow-primary focus:outline-none"
            aria-label="Close"
          >
            <Icon icon="lucide:x" />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
