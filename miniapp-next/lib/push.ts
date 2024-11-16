import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { Signer } from "ethers";

// 1: Initialize User - call triggered from user (event creator)
type InitResult = {
  pushUser: PushAPI | null;
  error: string | null;
};
export async function initUser(signer: Signer): Promise<InitResult> {
  try {
    const pushUser = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    if (pushUser.errors?.length > 0) {
      return {
        pushUser: null,
        error: pushUser.errors[0].message || "Failed to initialize Push user",
      };
    }

    return {
      pushUser,
      error: null,
    };
  } catch (err) {
    return {
      pushUser: null,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error during initialization",
    };
  }
}

// 2. Create Group - call triggered from user (event creator)
export async function createGroup(eventCreator: PushAPI, eventName: string) {
  const group = await eventCreator.chat.group.create(eventName);
  return group;
}

// 3. Join Group - call triggered from user (participant)
export async function joinGroup(
  eventCreator: PushAPI,
  chatId: string,
  participant: string
) {
  const addUserToGroup = await eventCreator.chat.group.add(chatId, {
    role: "MEMBER", // 'ADMIN' or 'MEMBER'
    accounts: [participant],
  });
  return addUserToGroup;
}

// 4. Exit Group - call triggered from user (participant)
export async function exitGroup(
  eventCreator: PushAPI,
  chatId: string,
  participant: string
) {
  const removeAdminFromGroup = await eventCreator.chat.group.remove(chatId, {
    role: "MEMBER", // 'ADMIN' or 'MEMBER'
    accounts: [participant],
  });
  return removeAdminFromGroup;
}

// 5. Send Message
export async function sendMessage(
  messageSender: PushAPI,
  chatId: string,
  message: string
) {
  const sendMessageToChat = await messageSender.chat.send(chatId, {
    type: "Text",
    content: message,
  });
}

// 6. Stream Chat
export async function streamChat(eventCreator: PushAPI, allMyEvents: string[]) {
  const stream = await eventCreator.initStream([CONSTANTS.STREAM.CHAT], {
    filter: {
      chats: ["*"],
      channels: allMyEvents,
    },
    connection: {
      retries: 3, // Retry connection 3 times if it fails
    },
    raw: false, // Receive events in structured format
  });
}
