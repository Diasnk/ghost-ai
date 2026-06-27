"use client";

import { useCallback, useState } from "react";
import { Bot, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
] as const;

const ASSISTANT_PLACEHOLDER =
  "Ghost AI responses will appear here once generation is connected.";

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AiArchitectTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const appendExchange = useCallback((userContent: string) => {
    const trimmed = userContent.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content: trimmed },
      {
        id: createMessageId(),
        role: "assistant",
        content: ASSISTANT_PLACEHOLDER,
      },
    ]);
    setInput("");
  }, []);

  const handleSend = useCallback(() => {
    appendExchange(input);
  }, [appendExchange, input]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 pr-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 px-2 py-6 text-center">
              <Bot className="h-8 w-8 text-ai-text" />
              <p className="text-sm text-copy-muted">
                Describe your system and Ghost AI will help architect it on the
                canvas.
              </p>
              <div className="flex flex-col gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-full bg-subtle px-3 py-1.5 text-sm text-ai-text transition-colors hover:bg-elevated"
                    onClick={() => appendExchange(prompt)}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto border-2 border-brand/50 bg-accent-dim text-copy-primary"
                    : "mr-auto border border-surface-border bg-elevated text-ai-text"
                )}
              >
                {message.content}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex shrink-0 items-end gap-2">
        <Textarea
          className="min-h-[72px] max-h-40 resize-none border-surface-border bg-subtle text-copy-primary placeholder:text-copy-muted"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Ghost AI to design your system..."
          value={input}
        />
        <Button
          aria-label="Send message"
          className="shrink-0 bg-brand text-white hover:bg-brand/90"
          disabled={!canSend}
          onClick={handleSend}
          size="icon"
          type="button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
