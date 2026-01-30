// src/types/message.d.ts
import type Message from '@/utils/message';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $message: typeof Message;
  }
}

export {};