export interface PINEventType {
  PAGE_VIEW: string;
}

interface PINPayload {
  type: typeof PIN_PAGEVIEW_EVT_TYPE;
  pgid: string;
}

export interface PIN {
  sendData(type: string, data: PINPayload): void;
}
