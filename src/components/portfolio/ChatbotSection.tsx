import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Minimize2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 8;

const STARTER_REPLY =
  "Hello. I can help with Eddy's portfolio, projects, skills, experience, and contact details.";

const STARTER_PROMPTS = [
  "What are Eddy's strongest tech stacks?",
  "Tell me about the PayMatrix project.",
  "How can I contact Eddy?",
];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMessage(role: ChatRole, content: string): ChatMessage {
  return { id: createId(), role, content };
}

export default function ChatbotSection() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([createMessage("assistant", STARTER_REPLY)]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const historyPayload = useMemo(
    () =>
      messages
        .filter((item) => item.content !== STARTER_REPLY)
        .slice(-MAX_HISTORY_MESSAGES)
        .map((item) => ({ role: item.role, content: item.content })),
    [messages],
  );

  useEffect(() => {
    const openChatFromHash = () => {
      if (window.location.hash.toLowerCase() === "#chatbot") {
        setIsOpen(true);
      }
    };
    openChatFromHash();
    window.addEventListener("hashchange", openChatFromHash);
    return () => window.removeEventListener("hashchange", openChatFromHash);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const node = messagesContainerRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, sending, isOpen]);

  async function sendMessage(rawMessage: string): Promise<void> {
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage || sending) {
      return;
    }

    const userMessage = createMessage("user", trimmedMessage);
    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        let message = "Unable to get response right now.";
        try {
          const errorData = await response.json();
          message = errorData.error || message;
        } catch {
          // no-op
        }
        throw new Error(message);
      }

      const data = (await response.json()) as { reply?: string };
      const assistantReply =
        typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply.trim()
          : "I can only answer questions related to this portfolio system.";

      setMessages((prev) => [...prev, createMessage("assistant", assistantReply)]);
    } catch (error) {
      console.error("Chatbot request failed.", error);
      const errorMessage =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Please try again in a moment.";
      toast({
        title: "Chatbot unavailable",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void sendMessage(messageInput);
  }

  function handlePromptClick(prompt: string): void {
    if (!isOpen) {
      setIsOpen(true);
    }
    void sendMessage(prompt);
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot"
            type="button"
            aria-label="Open chatbot"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-[70] group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-4 py-3 text-primary-foreground shadow-[0_16px_40px_-18px_hsl(var(--primary)/0.75)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            initial={{ opacity: 0, scale: 0.85, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold hidden sm:inline">Chatbot</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            aria-label="Portfolio chatbot"
            className="fixed bottom-3 left-3 right-3 z-[75] h-[72vh] max-h-[620px] rounded-2xl border border-border/70 bg-card/95 shadow-[0_25px_80px_-35px_hsl(var(--foreground)/0.45)] backdrop-blur-xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-[390px]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="h-full rounded-2xl overflow-hidden flex flex-col">
              <div className="relative border-b border-border/70 px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Portfolio Assistant</p>
                      <p className="text-xs text-muted-foreground">Professional portfolio support</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Minimize chatbot"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.06),_transparent_42%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--background)))]"
              >
                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";
                  return (
                    <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          isAssistant
                            ? "bg-secondary text-secondary-foreground border border-border"
                            : "bg-primary text-primary-foreground shadow-sm"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}
                {sending && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-secondary text-secondary-foreground border border-border text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border/70 px-4 py-3 space-y-3 bg-card/85">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={sending}
                      onClick={() => handlePromptClick(prompt)}
                      className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-secondary transition-colors disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                  <Textarea
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage(messageInput);
                      }
                    }}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={2}
                    placeholder="Ask about projects, skills, experience, or contact..."
                    className="resize-none rounded-xl"
                    disabled={sending}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-muted-foreground">
                      {messageInput.trim().length}/{MAX_MESSAGE_LENGTH}
                    </p>
                    <Button
                      type="submit"
                      disabled={sending || messageInput.trim().length === 0}
                      className="rounded-full h-9 px-4"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
