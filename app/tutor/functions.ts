import { EventMessage } from "../types";
export const createEventMessage = (itemType:string,role:string,inputType:string,text:string):EventMessage=>{
    const msg:EventMessage = {
        type: "conversation.item.create",
        item:{
            type:itemType,
            role,
            content:[{
                type:inputType,
                text
            }
            ]
        }
    }
    return msg
}
// export function sendClientEvent(message: EventMessage,dataChannel:RTCDataChannel,setEvents:(prev:any[])=>any[]) {
//     if (dataChannel) {
//       const timestamp = new Date().toLocaleTimeString();
//       message.event_id = message.event_id || crypto.randomUUID();
//       dataChannel.send(JSON.stringify(message));
//       if (!message.timestamp) message.timestamp = timestamp;
//       setEvents((prev:any[]) => [message, ...prev]);
//     } else  console.error("Failed to send message - no data channel available",message);
    
//   }