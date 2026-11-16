import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil } from 'lucide-react';

interface InlineEditableTextProps {
  value: string;
  onChange: (next: string) => void;
  editMode: boolean;
  multiline?: boolean;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  editMode,
  multiline = false,
  className = '',
  as: Tag = 'span',
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setDraft(value);
    }
  };

  if (editing) {
    return (
      <span
        className="inline-flex items-center gap-1.5 w-full max-w-xl align-middle"
        onClick={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={(el) => {
              inputRef.current = el;
            }}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(value);
                setEditing(false);
              }
            }}
            className="w-full px-3 py-1.5 rounded-lg bg-[#120d2c] border border-violet-400 text-sm text-white focus:outline-none shadow-lg"
          />
        ) : (
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') {
                setDraft(value);
                setEditing(false);
              }
            }}
            className="w-full px-2.5 py-1 rounded-lg bg-[#120d2c] border border-violet-400 text-inherit font-inherit text-white focus:outline-none shadow-lg"
          />
        )}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            commit();
          }}
          className="p-1.5 rounded-md bg-emerald-600 text-white shrink-0"
          aria-label="Save text"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </span>
    );
  }

  return (
    <Tag
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Click to edit text directly"
      className={`${className} group/edit relative cursor-text rounded px-1 -mx-1 outline-1 outline-dashed outline-violet-400/50 hover:outline-violet-300 hover:bg-violet-500/10 transition-colors`}
    >
      {value}
      <Pencil className="inline-block w-3 h-3 ml-1.5 text-violet-300 opacity-70 group-hover/edit:opacity-100 align-middle" />
    </Tag>
  );
};
