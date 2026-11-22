import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiBookOpen, FiSend, FiTrash2 } from 'react-icons/fi';
import { isChatConfigured, sendChatMessage } from '../lib/chatApi';
import { retrieveKnowledge } from '../lib/knowledgeRetrieval';
import './AssistantChat.css';

const maxMessages = 10;
const usageKey = 'jonathan-assistant-message-count';
const visitorKey = 'jonathan-assistant-visitor-id';

const sampleQuestions = [
  'What is Jonathan’s master’s thesis about?',
  'Which projects best demonstrate his research engineering skills?',
  'Summarize his experience with medical imaging.',
  'What does Jonathan do outside of research?',
];

function getVisitorId() {
  let visitorId = window.localStorage.getItem(visitorKey);
  if (!visitorId) {
    visitorId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    window.localStorage.setItem(visitorKey, visitorId);
  }
  return visitorId;
}

function SearchPreview({ context }) {
  return (
    <div className="assistant-preview">
      <p>
        The knowledge search is working, but the secure model endpoint is not
        connected in this environment yet. These are the most relevant sections:
      </p>
      <ul>
        {context.slice(0, 3).map((source) => (
          <li key={source.id}>
            <strong>{source.title}</strong> — {source.section}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceList({ sources }) {
  if (!sources?.length) return null;

  return (
    <details className="assistant-sources">
      <summary className="assistant-sources-label">
        <span>
          <FiBookOpen aria-hidden="true" /> Sources ({sources.length})
        </span>
      </summary>
      <div className="assistant-source-list">
        {sources.map((source, index) => {
          const label = `${source.title}${source.section && source.section !== source.title ? ` · ${source.section}` : ''}`;
          return source.url ? (
            <a key={`${source.id || label}-${index}`} href={source.url}>
              {index + 1}. {label}
            </a>
          ) : (
            <span key={`${source.id || label}-${index}`}>
              {index + 1}. {label}
            </span>
          );
        })}
      </div>
    </details>
  );
}

function TypedAssistantResponse({ content, sources, onTick }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [visibleContent, setVisibleContent] = useState(reduceMotion ? content : '');
  const [isComplete, setIsComplete] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleContent(content);
      setIsComplete(true);
      return undefined;
    }

    let visibleLength = 0;
    const interval = window.setInterval(() => {
      visibleLength = Math.min(content.length, visibleLength + 2);
      setVisibleContent(content.slice(0, visibleLength));
      onTick();

      if (visibleLength >= content.length) {
        window.clearInterval(interval);
        setIsComplete(true);
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [content, onTick, reduceMotion]);

  return (
    <>
      <div className={isComplete ? '' : 'assistant-typing-text'}>
        <ReactMarkdown>{visibleContent}</ReactMarkdown>
      </div>
      {isComplete && <SourceList sources={sources} />}
    </>
  );
}

function AssistantChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messagesUsed, setMessagesUsed] = useState(() => {
    const saved = Number(window.sessionStorage.getItem(usageKey));
    return Number.isFinite(saved) ? saved : 0;
  });
  const messageListRef = useRef(null);
  const configured = isChatConfigured();
  const remaining = Math.max(0, maxMessages - messagesUsed);

  const recentConversation = useMemo(
    () => messages.slice(-6).map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const scrollToBottom = useCallback(() => {
    const list = messageListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  async function submitMessage(value) {
    const message = value.trim();
    if (!message || isLoading || remaining === 0) return;

    setDraft('');
    setError('');
    setIsLoading(true);
    setMessages((current) => [...current, { role: 'user', content: message }]);

    try {
      const retrievalQuery = [
        ...recentConversation.filter((item) => item.role === 'user').map((item) => item.content),
        message,
      ].join(' ');
      const context = await retrieveKnowledge(retrievalQuery);

      if (!configured) {
        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            content: '',
            previewContext: context,
            sources: context,
          },
        ]);
        return;
      }

      const response = await sendChatMessage({
        message,
        history: recentConversation,
        context: context.map(({ id, title, section, url, content }) => ({
          id,
          title,
          section,
          url,
          content,
        })),
        visitorId: getVisitorId(),
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.answer,
          sources: response.sources || context,
          animate: true,
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.');
    } finally {
      const nextCount = messagesUsed + 1;
      setMessagesUsed(nextCount);
      window.sessionStorage.setItem(usageKey, String(nextCount));
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage(draft);
  }

  function clearConversation() {
    setMessages([]);
    setError('');
  }

  return (
    <div className="assistant-shell">
      <aside className="assistant-intro">
        <p className="eyebrow">Profile TL;DR</p>
        <h1>Ask Tofu</h1>
        <p>
          Inquire about Jonathan’s research, background, and occasional off-the-clock details.
        </p>
        <div className="assistant-status-row">
          <span className={`assistant-status ${configured ? 'is-ready' : 'is-preview'}`}>
            {configured ? 'AI connected' : 'Knowledge-search preview'}
          </span>
          <span className="assistant-counter">{remaining} messages remaining</span>
        </div>
        <div className="assistant-guardrail">
          Answers are grounded in the website content and a short external knowledge base. Hallucinations are possible, and this is a work in progress.
        </div>
      </aside>

      <section className="assistant-chat-card" aria-label="Chat with Tofu">
        <header className="assistant-chat-header">
          <div>
            <span className="assistant-chat-kicker">TOFU.CAT</span>
            <h2>Tofu's Office Hours</h2>
          </div>
          {messages.length > 0 && (
            <button type="button" className="assistant-clear" onClick={clearConversation}>
              <FiTrash2 aria-hidden="true" /> Clear
            </button>
          )}
        </header>

        <div className="assistant-message-list" ref={messageListRef} aria-live="polite">
          {messages.length === 0 ? (
            <div className="assistant-empty-state">
              <img
                className="assistant-avatar"
                src={`${import.meta.env.BASE_URL}avatar/tofu.png`}
                alt=""
                aria-hidden="true"
              />
              <h3>Hello—I’m Tofu.</h3>
              <p>Choose a question or ask me anything grounded in Jonathan’s website.</p>
              <div className="assistant-prompts">
                {sampleQuestions.map((question) => (
                  <button key={question} type="button" onClick={() => submitMessage(question)}>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`assistant-message is-${message.role}`}
              >
                <span className="assistant-message-role">
                  {message.role === 'user' ? 'You' : 'Tofu'}
                </span>
                {message.previewContext ? (
                  <SearchPreview context={message.previewContext} />
                ) : message.role === 'assistant' && message.animate ? (
                  <TypedAssistantResponse
                    content={message.content}
                    sources={message.sources}
                    onTick={scrollToBottom}
                  />
                ) : (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                )}
                {!message.animate && <SourceList sources={message.sources} />}
              </article>
            ))
          )}

          {isLoading && (
            <div className="assistant-thinking" role="status">
              <span /> <span /> <span />
              <em>{configured ? 'Tofu is reading the relevant pages' : 'Searching the knowledge base'}</em>
            </div>
          )}
        </div>

        {error && <div className="assistant-error" role="alert">{error}</div>}

        <form className="assistant-form" onSubmit={handleSubmit}>
          <label htmlFor="assistant-question" className="sr-only">Ask Tofu a question</label>
          <textarea
            id="assistant-question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            maxLength={1000}
            placeholder="Ask about a project, research area, credential, or hobby…"
            disabled={isLoading || remaining === 0}
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!draft.trim() || isLoading || remaining === 0}
          >
            <FiSend aria-hidden="true" />
          </button>
        </form>
        <p className="assistant-form-note">
          Enter to send · Shift + Enter for a new line · Do not submit private information.
        </p>
      </section>
    </div>
  );
}

export default AssistantChat;
