"use client";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const suggestions = [
  "Explain NextJS in detail",
  "What is Partial Pre Rendering?",
  "What is the weather in Delhi?",
  "Explain me React in detail",
];

type outputType = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

const RAGChatBot = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat();
  const [theme, setTheme] = useState("");
  // const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { isSignedIn, user, isLoaded } = useUser();

  // console.log(user);

  function submitHandler(message: PromptInputMessage) {
    if (status === "streaming" || status == "submitted") {
      stop();
      return;
    }

    if (!message.text) return;

    sendMessage({ text: input });
    setInput("");
  }

  function handleClickSuggestion(suggestion: string) {
    sendMessage({ text: suggestion });
  }

  useEffect(() => {
    function getData() {
      let theme = localStorage.getItem("theme");
      setTheme(theme || "");
    }
    getData();
  }, []);

  if (!isLoaded) {
    return <div>Loading....</div>;
  }

  if (!isSignedIn) {
    return <div> You need to be signed in to view this page</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-5rem)]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationScrollButton />
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      // console.log(part.type);
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                  <MessageAvatar
                    src={message.role === "user" ? user.imageUrl : ""}
                    name={message.role}
                  />
                </Message>
              ))
            )}
            {(status === "submitted" || status === "streaming") && <Loader />}
          </ConversationContent>
          {/* <ConversationScrollButton /> */}
        </Conversation>
        <Suggestions className="py-4">
          {suggestions.map((suggestion) => (
            <Suggestion
              suggestion={suggestion}
              key={suggestion}
              onClick={handleClickSuggestion}
            />
          ))}
        </Suggestions>
        <PromptInput onSubmit={submitHandler} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              {/* {model selector, web search, etc} */}
            </PromptInputTools>
            <PromptInputSubmit
              status={status === "streaming" ? "streaming" : "ready"}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default RAGChatBot;
