<template>
  <div class="w-full flex flex-col flex-grow items-center justify-center h-full">
    <div
      :class="`h-full flex-grow text-center relative mdlg:px-0 gap-5 flex flex-col items-center lg:text-sm mdlg:text-[12px] text-xs w-full`">
      <slot />
    </div>
  </div>
</template>