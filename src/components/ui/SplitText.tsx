type SplitTextProps = {
  text: string
  charClass?: string
  className?: string
}

// Wraps each character in a masked span so a parent timeline can slide them up.
export function SplitText({ text, charClass = 'split-char', className }: SplitTextProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} aria-hidden="true">
          {wordIndex > 0 ? ' ' : null}
          <span className="inline-block overflow-hidden align-bottom pb-[0.12em] pr-[0.08em] -mb-[0.12em] -mr-[0.08em]">
            {[...word].map((char, charIndex) => (
              <span className={`${charClass} inline-block will-change-transform`} key={charIndex}>
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
