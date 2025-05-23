export type Message = {
    text: string;
    isUser: boolean;
    timestamp?: Date;
    id?: string;
    isComplete?: boolean;
}
export type EventMessage = {
    event_id?: string;
    timestamp?: string;
    [key: string]: any;
  };