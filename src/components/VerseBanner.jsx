import { getContent } from '../data/versesHadith';

export default function VerseBanner({ contextKey }) {
  const content = getContent(contextKey);
  return (
    <div className="relative border border-gold/30 bg-emeraldDeep/90 text-parchment px-6 py-5 max-w-md mx-auto text-center backdrop-blur-sm">
      <p className="font-display text-lg leading-loose text-goldSoft mb-2">{content.arabic}</p>
      <p className="font-mono text-xs text-parchment/55">
        {content.type === 'quran' ? content.ref : `${content.ref}`}
      </p>
    </div>
  );
}
